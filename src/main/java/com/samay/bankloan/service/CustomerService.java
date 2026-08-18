package com.samay.bankloan.service;

import com.samay.bankloan.entity.Customer;
import com.samay.bankloan.exception.DuplicateResourceException;
import com.samay.bankloan.exception.ResourceNotFoundException;
import com.samay.bankloan.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;

    public Customer createCustomer(Customer customer) {
        if (customerRepository.existsByEmail(customer.getEmail())) {
            throw new DuplicateResourceException("Customer already exists with email: " + customer.getEmail());
        }
        if (customerRepository.existsByPanNumber(customer.getPanNumber())) {
            throw new DuplicateResourceException("Customer already exists with PAN: " + customer.getPanNumber());
        }
        return customerRepository.save(customer);
    }

    @Transactional(readOnly = true)
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    public Customer updateCustomer(Long id, Customer updatedCustomer) {
        Customer existing = getCustomerById(id);
        existing.setFullName(updatedCustomer.getFullName());
        existing.setPhoneNumber(updatedCustomer.getPhoneNumber());
        existing.setAddress(updatedCustomer.getAddress());
        existing.setMonthlyIncome(updatedCustomer.getMonthlyIncome());
        existing.setCreditScore(updatedCustomer.getCreditScore());
        return customerRepository.save(existing);
    }

    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customerRepository.delete(customer);
    }
}
