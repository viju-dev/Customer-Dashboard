package com.example.DataTable.Services;

import com.example.DataTable.Entities.Customer;
import com.example.DataTable.EntryDtos.CustomerEntryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface CustomerService {

    public Page<Customer> getCustomers(int page, int size,String sortBy,String direction);

    public Customer getCustomerById(int id);

    public Customer addCustomer(CustomerEntryDto customerEntryDto);

}
