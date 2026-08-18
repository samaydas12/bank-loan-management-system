# Bank Loan Management System

A Spring Boot REST API for managing bank customers and their loan applications — from application to approval to disbursement.

## Tech Stack

- Java 17
- Spring Boot 3.3.4
- Spring Data JPA (Hibernate)
- H2 (in-memory, default) / MySQL (optional)
- Maven
- Lombok
- Bean Validation

## Features

- **Customer management** — register, view, update, delete customers (with PAN/email uniqueness checks)
- **Loan application workflow** — PENDING → UNDER_REVIEW → APPROVED/REJECTED → DISBURSED → CLOSED
- **EMI calculation** — standard reducing-balance formula, auto-computed on application and available as a standalone endpoint
- **Basic eligibility checks** — credit score and EMI-to-income ratio validated at approval time
- **Centralized exception handling** — clean JSON error responses for validation, not-found, duplicate, and invalid-operation cases

## Project Structure

```
src/main/java/com/samay/bankloan/
├── controller/       REST endpoints
├── service/          Business logic (loan workflow, EMI calculator)
├── repository/       Spring Data JPA repositories
├── entity/           JPA entities (Customer, LoanApplication) + enums
├── dto/               Request/response DTOs
├── exception/         Custom exceptions + global handler
```

## Getting Started

### Prerequisites
- JDK 17+
- Maven 3.8+

### Run locally
```bash
mvn spring-boot:run
```
App starts on `http://localhost:8080`. H2 console available at `http://localhost:8080/h2-console`
(JDBC URL: `jdbc:h2:mem:bankloandb`, username: `sa`, no password).

### Switch to MySQL
Edit `src/main/resources/application.properties` — comment the H2 block, uncomment the MySQL block, and set your credentials.

## API Endpoints

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/customers` | Create a customer |
| GET    | `/api/customers` | List all customers |
| GET    | `/api/customers/{id}` | Get customer by ID |
| PUT    | `/api/customers/{id}` | Update customer |
| DELETE | `/api/customers/{id}` | Delete customer |

### Loan Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/loans/apply/{customerId}` | Apply for a loan |
| GET    | `/api/loans` | List all applications |
| GET    | `/api/loans/{id}` | Get application by ID |
| GET    | `/api/loans/customer/{customerId}` | Applications for a customer |
| GET    | `/api/loans/status/{status}` | Applications by status |
| PATCH  | `/api/loans/{id}/review` | Move to UNDER_REVIEW |
| PATCH  | `/api/loans/{id}/approve` | Approve (runs eligibility check) |
| PATCH  | `/api/loans/{id}/reject` | Reject |
| PATCH  | `/api/loans/{id}/disburse` | Disburse an approved loan |
| PATCH  | `/api/loans/{id}/close` | Close a disbursed loan |
| DELETE | `/api/loans/{id}` | Delete an application |

### EMI Calculator
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/emi/calculate?principal=&annualInterestRate=&tenureInMonths=` | Standalone EMI calculation |

## Sample Request — Create Customer
```json
POST /api/customers
{
  "fullName": "Samay Das",
  "email": "samay@example.com",
  "phoneNumber": "9876543210",
  "panNumber": "ABCDE1234F",
  "dateOfBirth": "1998-05-14",
  "address": "Kolkata, West Bengal",
  "monthlyIncome": 65000,
  "creditScore": 720
}
```

## Sample Request — Apply for Loan
```json
POST /api/loans/apply/1
{
  "loanType": "HOME_LOAN",
  "loanAmount": 2500000,
  "interestRate": 8.5,
  "tenureInMonths": 240
}
```

## License
MIT
