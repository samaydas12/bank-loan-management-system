package com.samay.bankloan.exception;

public class InvalidLoanOperationException extends RuntimeException {
    public InvalidLoanOperationException(String message) {
        super(message);
    }
}
