package com.foodexpress.backend.controller;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodexpress.backend.model.Customer;
import com.foodexpress.backend.repository.CustomerRepository;
@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {
    private final CustomerRepository customerRepository;

public CustomerController(CustomerRepository customerRepository) {
    this.customerRepository = customerRepository;
    
}
@PostMapping
public Customer addCustomer(@RequestBody Customer customer) {
    return customerRepository.save(customer);
}

@GetMapping
public List<Customer> getAllCustomers() {
    return customerRepository.findAll();
}
}
