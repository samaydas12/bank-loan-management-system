package com.samay.bankloan.controller;

import com.samay.bankloan.dto.EmiResponse;
import com.samay.bankloan.service.EmiCalculatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/emi")
@RequiredArgsConstructor
public class EmiCalculatorController {

    private final EmiCalculatorService emiCalculatorService;

    @GetMapping("/calculate")
    public EmiResponse calculateEmi(
            @RequestParam double principal,
            @RequestParam double annualInterestRate,
            @RequestParam int tenureInMonths) {

        double emi = emiCalculatorService.calculateEmi(principal, annualInterestRate, tenureInMonths);
        double totalPayment = emiCalculatorService.calculateTotalPayment(emi, tenureInMonths);
        double totalInterest = emiCalculatorService.calculateTotalInterest(principal, totalPayment);

        return new EmiResponse(principal, annualInterestRate, tenureInMonths, emi, totalPayment, totalInterest);
    }
}
