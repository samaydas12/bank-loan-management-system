package com.samay.bankloan.service;

import com.samay.bankloan.entity.Customer;
import com.samay.bankloan.entity.LoanApplication;
import com.samay.bankloan.entity.LoanStatus;
import com.samay.bankloan.exception.InvalidLoanOperationException;
import com.samay.bankloan.exception.ResourceNotFoundException;
import com.samay.bankloan.repository.LoanApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LoanApplicationService {

    private final LoanApplicationRepository loanApplicationRepository;
    private final CustomerService customerService;
    private final EmiCalculatorService emiCalculatorService;

    // A simple, transparent minimum-eligibility rule used to auto-route applications.
    private static final int MIN_CREDIT_SCORE = 650;
    private static final double MAX_EMI_TO_INCOME_RATIO = 0.5;

    public LoanApplication applyForLoan(Long customerId, LoanApplication application) {
        Customer customer = customerService.getCustomerById(customerId);
        application.setCustomer(customer);
        application.setStatus(LoanStatus.PENDING);
        application.setApplicationDate(LocalDate.now());

        double emi = emiCalculatorService.calculateEmi(
                application.getLoanAmount(),
                application.getInterestRate(),
                application.getTenureInMonths());
        application.setEmiAmount(emi);

        return loanApplicationRepository.save(application);
    }

    @Transactional(readOnly = true)
    public List<LoanApplication> getAllApplications() {
        return loanApplicationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public LoanApplication getApplicationById(Long id) {
        return loanApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan application not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<LoanApplication> getApplicationsByCustomer(Long customerId) {
        customerService.getCustomerById(customerId); // ensures customer exists
        return loanApplicationRepository.findByCustomerId(customerId);
    }

    @Transactional(readOnly = true)
    public List<LoanApplication> getApplicationsByStatus(LoanStatus status) {
        return loanApplicationRepository.findByStatus(status);
    }

    public LoanApplication moveToReview(Long id) {
        LoanApplication application = getApplicationById(id);
        if (application.getStatus() != LoanStatus.PENDING) {
            throw new InvalidLoanOperationException(
                    "Only PENDING applications can be moved to review. Current status: " + application.getStatus());
        }
        application.setStatus(LoanStatus.UNDER_REVIEW);
        return loanApplicationRepository.save(application);
    }

    public LoanApplication approveLoan(Long id, String remarks) {
        LoanApplication application = getApplicationById(id);
        if (application.getStatus() != LoanStatus.UNDER_REVIEW && application.getStatus() != LoanStatus.PENDING) {
            throw new InvalidLoanOperationException(
                    "Cannot approve a loan in status: " + application.getStatus());
        }
        checkEligibility(application);
        application.setStatus(LoanStatus.APPROVED);
        application.setApprovalDate(LocalDate.now());
        application.setRemarks(remarks);
        return loanApplicationRepository.save(application);
    }

    public LoanApplication rejectLoan(Long id, String remarks) {
        LoanApplication application = getApplicationById(id);
        if (application.getStatus() == LoanStatus.DISBURSED || application.getStatus() == LoanStatus.CLOSED) {
            throw new InvalidLoanOperationException(
                    "Cannot reject a loan in status: " + application.getStatus());
        }
        application.setStatus(LoanStatus.REJECTED);
        application.setRemarks(remarks);
        return loanApplicationRepository.save(application);
    }

    public LoanApplication disburseLoan(Long id) {
        LoanApplication application = getApplicationById(id);
        if (application.getStatus() != LoanStatus.APPROVED) {
            throw new InvalidLoanOperationException(
                    "Only APPROVED loans can be disbursed. Current status: " + application.getStatus());
        }
        application.setStatus(LoanStatus.DISBURSED);
        return loanApplicationRepository.save(application);
    }

    public LoanApplication closeLoan(Long id) {
        LoanApplication application = getApplicationById(id);
        if (application.getStatus() != LoanStatus.DISBURSED) {
            throw new InvalidLoanOperationException(
                    "Only DISBURSED loans can be closed. Current status: " + application.getStatus());
        }
        application.setStatus(LoanStatus.CLOSED);
        return loanApplicationRepository.save(application);
    }

    public void deleteApplication(Long id) {
        LoanApplication application = getApplicationById(id);
        loanApplicationRepository.delete(application);
    }

    /**
     * Basic eligibility check used at approval time. Real underwriting would be
     * far more involved; this keeps the workflow demonstrable and transparent.
     */
    private void checkEligibility(LoanApplication application) {
        Customer customer = application.getCustomer();

        if (customer.getCreditScore() != null && customer.getCreditScore() < MIN_CREDIT_SCORE) {
            throw new InvalidLoanOperationException(
                    "Customer credit score (" + customer.getCreditScore() + ") is below the minimum required ("
                            + MIN_CREDIT_SCORE + ")");
        }

        double emiToIncomeRatio = application.getEmiAmount() / customer.getMonthlyIncome();
        if (emiToIncomeRatio > MAX_EMI_TO_INCOME_RATIO) {
            throw new InvalidLoanOperationException(
                    "EMI-to-income ratio (" + String.format("%.2f", emiToIncomeRatio)
                            + ") exceeds the maximum allowed (" + MAX_EMI_TO_INCOME_RATIO + ")");
        }
    }
}
