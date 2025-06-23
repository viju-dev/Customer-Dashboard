package com.example.DataTable.Services.Impl;

import com.example.DataTable.Entities.Customer;
import com.example.DataTable.Repositories.CustomerRepo;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.properties.UnitValue;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.poi.ss.usermodel.*;

import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;


import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.List;

@Service
public class DataExportServiceImpl {

    private final CustomerRepo customerRepo;

    @Autowired
    public DataExportServiceImpl(CustomerRepo customerRepo){
        this.customerRepo = customerRepo;
    }

    public void writeDataToCsv(PrintWriter writer) {
        try (CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader("ID", "Name", "Age", "Gender", "Contact"))) {
            List<Customer> dataList = customerRepo.findAll();  // Fetch all data at once or in manageable chunks
            for (Customer data : dataList) {
                csvPrinter.printRecord(data.getId(), data.getName(), data.getAge(), data.getGender(), data.getContact());
            }
            csvPrinter.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

public void writeDataToExcel(OutputStream outputStream) throws IOException {
    // Creates an Excel workbook with a low memory footprint
    SXSSFWorkbook workbook = new SXSSFWorkbook(100); // keep 100 rows in memory, exceeding rows will be flushed to disk
    Sheet sheet = workbook.createSheet("Customers");

    // Enable tracking of columns for auto-sizing
    if(sheet instanceof SXSSFSheet) {
        ((SXSSFSheet) sheet).trackAllColumnsForAutoSizing();
    }

    // Create a Font for styling header cells
    Font headerFont = workbook.createFont();
    headerFont.setBold(true);
    headerFont.setFontHeightInPoints((short) 14);
    headerFont.setColor(IndexedColors.RED.getIndex());

    // Create a CellStyle with the font
    CellStyle headerCellStyle = workbook.createCellStyle();
    headerCellStyle.setFont(headerFont);

    Row headerRow = sheet.createRow(0);

    String[] columns = {"ID", "Name", "Age", "Gender", "Contact"};
    for (int i = 0; i < columns.length; i++) {
        Cell cell = headerRow.createCell(i);
        cell.setCellValue(columns[i]);
        cell.setCellStyle(headerCellStyle);
    }

    CellStyle ageCellStyle = workbook.createCellStyle();
    ageCellStyle.setDataFormat(workbook.createDataFormat().getFormat("#"));

    List<Customer> customers = customerRepo.findAll(); // Fetch all customers
    int rowNum = 1;
    for (Customer customer : customers) {
        Row row = sheet.createRow(rowNum++);

        row.createCell(0).setCellValue(customer.getId());
        row.createCell(1).setCellValue(customer.getName());

        Cell ageCell = row.createCell(2);
        ageCell.setCellValue(customer.getAge());
        ageCell.setCellStyle(ageCellStyle);

        row.createCell(3).setCellValue(String.valueOf(customer.getGender()));
        row.createCell(4).setCellValue(customer.getContact());
    }

    // Resize all columns to fit the content size
    for (int i = 0; i < columns.length; i++) {
        sheet.autoSizeColumn(i);
    }

    workbook.write(outputStream);
    workbook.dispose();
    workbook.close();
}

    public void writeDataToPdf(OutputStream outputStream) throws IOException {

        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        float[] columnWidths = {1, 3, 1, 1, 3};
        com.itextpdf.layout.element.Table table = new com.itextpdf.layout.element.Table(UnitValue.createPercentArray(columnWidths));
        table.addCell("ID");
        table.addCell("Name");
        table.addCell("Age");
        table.addCell("Gender");
        table.addCell("Contact");

        int batchSize = 1000;
        int pageNumber = 0;
        Page<Customer> page;

        do {
            page = customerRepo.findAll(PageRequest.of(pageNumber++, batchSize));
            List<Customer> customers = page.getContent();
            for (Customer customer : customers) {
                table.addCell(String.valueOf(customer.getId()));
                table.addCell(customer.getName());
                table.addCell(String.valueOf(customer.getAge()));
                table.addCell(customer.getGender().name());
                table.addCell(customer.getContact());
            }
            document.add(table); // Add filled table to document
            table = new com.itextpdf.layout.element.Table(UnitValue.createPercentArray(columnWidths)); // Reinitialize table for the next batch
        } while (pageNumber < page.getTotalPages());

        document.close();
    }

}
