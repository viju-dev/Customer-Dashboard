package com.example.DataTable.Services.Impl;

import com.example.DataTable.Convertors.CustomerConvertors;
import com.example.DataTable.Entities.Customer;
import com.example.DataTable.EntryDtos.CustomerEntryDto;
import com.example.DataTable.Exceptions.ResourceNotFoundException;
import com.example.DataTable.Repositories.CustomerRepo;
import com.example.DataTable.Services.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepo customerRepo;

    @Autowired
    public CustomerServiceImpl(CustomerRepo customerRepo) {
        this.customerRepo = customerRepo;
    }


    @Override
    public Page<Customer> getCustomers(int page, int size,String sortBy,String direction) {

        Sort sort = direction.equals("desc")? Sort.by(sortBy).descending() :Sort.by(sortBy).ascending();
        PageRequest pageable = PageRequest.of(page,size,sort);
        Page<Customer> customers= customerRepo.findAll(pageable);
        return customers;
    }

    @Override
    public Customer getCustomerById(int id) {
        Customer customer = customerRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Customer","id",Integer.toString(id)));
        return customer;
    }

    @Override
    public Customer addCustomer(CustomerEntryDto customerEntryDto) {
        Customer customer = CustomerConvertors.CustEntryToEntity(customerEntryDto);
        Customer customer1 = customerRepo.save(customer);
        return customer1;
    }
}
