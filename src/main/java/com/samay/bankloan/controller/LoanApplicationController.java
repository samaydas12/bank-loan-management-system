package com.samay.bankloan.controller;

import com.samay.bankloan.dto.LoanDecisionRequest;
import com.samay.bankloan.entity.LoanApplication;
import com.samay.bankloan.entity.LoanStatus;
import com.samay.bankloan.service.LoanApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanApplicationController {

    private final LoanApplicationService loanApplicationService;

    @PostMapping("/apply/{customerId}")
    public ResponseEntity<LoanApplication> applyForLoan(
            @PathVariable Long customerId,
            @Valid @RequestBody LoanApplication application) {
        LoanApplication created = loanApplicationService.applyForLoan(customerId, application);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<LoanApplication>> getAllApplications() {
        return ResponseEntity.ok(loanApplicationService.getAllApplications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanApplication> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(loanApplicationService.getApplicationById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<LoanApplication>> getApplicationsByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(loanApplicationService.getApplicationsByCustomer(customerId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<LoanApplication>> getApplicationsByStatus(@PathVariable LoanStatus status) {
        return ResponseEntity.ok(loanApplicationService.getApplicationsByStatus(status));
    }

    @PatchMapping("/{id}/review")
    public ResponseEntity<LoanApplication> moveToReview(@PathVariable Long id) {
        return ResponseEntity.ok(loanApplicationService.moveToReview(id));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<LoanApplication> approveLoan(
            @PathVariable Long id,
            @RequestBody(required = false) LoanDecisionRequest decision) {
        String remarks = decision != null ? decision.getRemarks() : null;
        return ResponseEntity.ok(loanApplicationService.approveLoan(id, remarks));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<LoanApplication> rejectLoan(
            @PathVariable Long id,
            @RequestBody(required = false) LoanDecisionRequest decision) {
        String remarks = decision != null ? decision.getRemarks() : null;
        return ResponseEntity.ok(loanApplicationService.rejectLoan(id, remarks));
    }

    @PatchMapping("/{id}/disburse")
    public ResponseEntity<LoanApplication> disburseLoan(@PathVariable Long id) {
        return ResponseEntity.ok(loanApplicationService.disburseLoan(id));
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<LoanApplication> closeLoan(@PathVariable Long id) {
        return ResponseEntity.ok(loanApplicationService.closeLoan(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        loanApplicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }
}
