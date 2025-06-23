package com.example.DataTable.Controllers;

import com.example.DataTable.Services.Impl.DataExportServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/Customer")
public class DataExportController {

    private final DataExportServiceImpl dataExportService;

    @Autowired
    public DataExportController(DataExportServiceImpl dataExportService){
        this.dataExportService = dataExportService;
    }

    @GetMapping("/exportData")
    public void exportData(HttpServletResponse response,
                           @RequestParam(defaultValue = "excel") String type) throws IOException {
        switch (type.toLowerCase()) {
            case "excel":
                response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                response.setHeader("Content-Disposition", "attachment; filename=\"customers.xlsx\"");
                dataExportService.writeDataToExcel(response.getOutputStream());
                break;
            case "pdf":
                response.setContentType("application/pdf");
                response.setHeader("Content-Disposition", "attachment; filename=\"data.pdf\"");
                dataExportService.writeDataToPdf(response.getOutputStream());
                break;
            case "csv":
            default:
                response.setContentType("text/csv");
                response.setHeader("Content-Disposition", "attachment; filename=\"data.csv\"");
                dataExportService.writeDataToCsv(response.getWriter());
                break;
        }
    }
}
