package com.samay.bankloan.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "loan_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonIgnoreProperties({"loanApplications"})
    private Customer customer;

    @NotNull(message = "Loan type is required")
    @Enumerated(EnumType.STRING)
    private LoanType loanType;

    @NotNull(message = "Loan amount is required")
    @Positive(message = "Loan amount must be positive")
    private Double loanAmount;

    @NotNull(message = "Interest rate is required")
    @Positive(message = "Interest rate must be positive")
    private Double interestRate;

    @NotNull(message = "Tenure in months is required")
    @Positive(message = "Tenure must be positive")
    private Integer tenureInMonths;

    @Enumerated(EnumType.STRING)
    private LoanStatus status = LoanStatus.PENDING;

    private Double emiAmount;

    private LocalDate applicationDate = LocalDate.now();

    private LocalDate approvalDate;

    private String remarks;

    @Version
    private Long version;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
