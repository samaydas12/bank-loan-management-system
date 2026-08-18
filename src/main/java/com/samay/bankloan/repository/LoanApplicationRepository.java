package com.samay.bankloan.repository;

import com.samay.bankloan.entity.LoanApplication;
import com.samay.bankloan.entity.LoanStatus;
import com.samay.bankloan.entity.LoanType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
    List<LoanApplication> findByCustomerId(Long customerId);
    List<LoanApplication> findByStatus(LoanStatus status);
    List<LoanApplication> findByLoanType(LoanType loanType);
}
