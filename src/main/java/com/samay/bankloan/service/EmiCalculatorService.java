package com.samay.bankloan.service;

import org.springframework.stereotype.Service;

/**
 * Calculates EMI using the standard reducing balance formula:
 * EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
 * where P = principal, R = monthly interest rate, N = tenure in months
 */
@Service
public class EmiCalculatorService {

    public double calculateEmi(double principal, double annualInterestRate, int tenureInMonths) {
        double monthlyRate = annualInterestRate / 12 / 100;

        if (monthlyRate == 0) {
            return principal / tenureInMonths;
        }

        double factor = Math.pow(1 + monthlyRate, tenureInMonths);
        double emi = (principal * monthlyRate * factor) / (factor - 1);
        return Math.round(emi * 100.0) / 100.0;
    }

    public double calculateTotalPayment(double emi, int tenureInMonths) {
        return Math.round(emi * tenureInMonths * 100.0) / 100.0;
    }

    public double calculateTotalInterest(double principal, double totalPayment) {
        return Math.round((totalPayment - principal) * 100.0) / 100.0;
    }
}
