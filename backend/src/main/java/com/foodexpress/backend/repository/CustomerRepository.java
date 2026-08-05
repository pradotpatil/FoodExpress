package com.foodexpress.backend.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.foodexpress.backend.model.Customer;
public interface CustomerRepository
        extends MongoRepository<Customer, String> {

}
