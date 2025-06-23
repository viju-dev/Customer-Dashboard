package com.example.DataTable.Convertors;

import com.example.DataTable.Entities.Customer;
import com.example.DataTable.EntryDtos.CustomerEntryDto;
import lombok.Builder;

public class CustomerConvertors {

    public static Customer CustEntryToEntity(CustomerEntryDto customerEntryDto){
        Customer customer = Customer.builder().name(customerEntryDto.getName()).age(customerEntryDto.getAge()).contact(customerEntryDto.getContact()).gender(customerEntryDto.getGender()).build();
        return customer;
    }
}
