package com.example.DataTable.Controllers;

import com.example.DataTable.Entities.Customer;
import com.example.DataTable.EntryDtos.CustomerEntryDto;
import com.example.DataTable.Payloads.ApiResponse;
import com.example.DataTable.Payloads.ResponseData;
import com.example.DataTable.Services.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/Customer")
public class CustomerController {

    private final CustomerService customerService;

    @Autowired
    public CustomerController(CustomerService customerService){
        this.customerService = customerService;
    };

    @PostMapping("/Customer/")
    public ResponseEntity<ApiResponse> addCustomer(@RequestBody CustomerEntryDto customerEntryDto){
        Customer customer = customerService.addCustomer(customerEntryDto);
        return new ResponseEntity<>(new ApiResponse<>("Customer added successfully...!",true,new ResponseData(customer)), HttpStatus.CREATED);
    }
    @GetMapping("/Customer/{customerId}")
    public ResponseEntity<ApiResponse> getCustomerById(@PathVariable() int customerId){
        Customer customer = customerService.getCustomerById(customerId);
        return new ResponseEntity<>(new ApiResponse<>("Customer retrieved successfully...!",true,new ResponseData(customer)), HttpStatus.OK);
    }

    @GetMapping("/getAll")
    public  ResponseEntity<ApiResponse> getCustomers(@RequestParam(value = "page",defaultValue = "0") int page, @RequestParam(value = "size",defaultValue = "20") int size, @RequestParam(value = "sortBy",defaultValue = "id") String sortBy, @RequestParam(value = "direction",defaultValue = "asc") String direction){
        Page<Customer> customers = customerService.getCustomers(page, size, sortBy, direction);
//        System.out.println(customers.getContent());
        return new ResponseEntity<>(new ApiResponse<>("Customers retrieved successfully...!",true,new ResponseData(customers)), HttpStatus.OK);
    }

}
