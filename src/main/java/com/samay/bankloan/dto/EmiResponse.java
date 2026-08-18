package com.samay.bankloan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmiResponse {
    private double principal;
    private double annualInterestRate;
    private int tenureInMonths;
    private double emiAmount;
    private double totalPayment;
    private double totalInterest;
}
