package com.example.DataTable.Repositories;
import com.example.DataTable.Entities.Customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface CustomerRepo extends JpaRepository<Customer,Integer> {
    Page<Customer> findAll(Pageable pageable);
}
