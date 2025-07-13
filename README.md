# RentWise 🏠

**RentWise** is a practical full-stack rental management app designed to teach the entire modern web development lifecycle.  
The backend is built with Django + DRF, and the frontend is a React/TypeScript SPA created and refined using AI-assisted tools. The project is structured for easy containerization and cloud deployment.

---

## ✨ Highlights

- **End-to-end full-stack template**  
  Learn how to connect a Django REST API with a React/TypeScript SPA, including JWT authentication, validation, and role-based data access control.

- **AI-powered frontend generation**  
  The entire React frontend — components, forms, routing — was generated and improved with state-of-the-art AI assistant tools, showcasing automation of repetitive scaffolding.

- **Deployment-focused architecture**  
  Designed from the start for Docker Compose containerization and cloud deployment on AWS (EC2, RDS, S3, SSL), enabling hands-on experience with CI/CD and infrastructure automation.

---

## 🚀 Features

### Web UI

- **Landing & Authentication**  
  - Public homepage with feature overview  
  - User registration and login with JWT token management  

- **Dashboard**  
  - Summary cards: total properties, active leases, payments  
  - Color-coded status badges (e.g., `available`, `rented`, `under_renovation`)  

- **Property Management**  
  - Create, update, and delete properties with details like address, rent, and status  

- **Lease & Tenant Management**  
  - Create new leases: select tenant, define lease term, set rent rate  
  - Lease calendar with validation for start and end dates  
  - Automatic property status updates when leases become active  
  - PDF export: auto-generate lease contracts  

- **Payments & Balances**  
  - Payment history linked to each lease  

---

# API Endpoints Documentation

## 🔌 REST API (JWT-secured) (http://localhost:8000)

| Method | Endpoint                         | Description                              |
|--------|---------------------------------|------------------------------------------|
| POST   | /users/api/token/                | Obtain access & refresh JWT tokens       |
| POST   | /users/api/token/refresh/        | Refresh access token                      |
| GET    | /users/api/users/                | List all users                           |
| GET    | /properties/api/                 | List user’s properties                   |
| POST   | /properties/api/                 | Add a new property                       |
| GET    | /properties/api/{id}/            | Retrieve property details                |
| PUT    | /properties/api/{id}/            | Update property                         |
| DELETE | /properties/api/{id}/            | Delete property                         |
| GET    | /properties/api/leases/          | List leases for user’s properties        |
| POST   | /properties/api/leases/          | Create a new lease                       |
| GET    | /properties/api/leases/{id}/     | Retrieve lease details                   |
| PUT    | /properties/api/leases/{id}/     | Update lease                            |
| DELETE | /properties/api/leases/{id}/     | Cancel lease                           |
| GET    | /properties/api/payments/        | List payments for leases                 |
| POST   | /properties/api/payments/        | Record a payment                        |
| GET    | /properties/api/payments/{id}/   | Retrieve payment details                |
| PUT    | /properties/api/payments/{id}/   | Update payment                         |
| DELETE | /properties/api/payments/{id}/   | Delete payment                         |
| GET    | /properties/leases/{pk}/contract/ | Download lease contract PDF             |

---

### Notes

- All endpoints require JWT authentication except for the token obtain and refresh endpoints.
- Ownership is enforced server-side: users can only access and modify their own properties, leases, and payments.
- Lease contract PDFs are generated on demand and accessible only by the tenant or property owner.

---

## 🛠 Tech Stack

| Layer       | Technology                                 |
|-------------|--------------------------------------------|
| Backend     | Python 3.x, Django, Django REST Framework, PostgreSQL |
| Authentication | JWT (SimpleJWT / Djoser)                   |
| Containerization | Docker & Docker Compose                     |
| Frontend    | React, TypeScript                           |
| Forms       | React Hook Form                       |
| Styling     | Bootstrap                                   |
| HTTP Client | Axios                                       |
| Testing     | Django Test Framework                        |

---

## 🎓 Learning Goals

- Architect a clean separation between API and UI  
- Master JWT-based authentication flows  
- Automate repetitive scaffolding with AI tools  
- Build production-ready Docker stacks  

---

## 🐳 Getting Started - *with Docker*  
Follow these steps to set up and run RentWise locally:

1. **Clone the repository**  
    ```bash
    git clone https://github.com/LuckyS-J/RentWise.git
    ```

2. **Navigate to the project**  
    ```bash
    cd RentWise
    ```

3. **Create a `.env` file**  
Create a file named `.env` in the project root and add the following environment variables. Replace the placeholder values with your own settings:

    ```env
    DJANGO_KEY='your_secret_key_here'
    DEBUG=True
    DB_NAME=RentWise
    DB_USER='your_username'
    DB_PASSWORD='your_password'
    DB_HOST=db
    DB_PORT=5432
    POSTGRES_DB=RentWise
    POSTGRES_USER='your_username'
    POSTGRES_PASSWORD='your_password'
    ```
   

4. **Build Docker containers and run them**
    ```bash
   docker-compose up -d --build
   ```

5. **Shut down containers**  
    ```bash
   docker-compose down
    ```

6. **Run tests**  
    ```bash
   docker compose run --rm backend python manage.py test
    ```

7. **Start Docker containers and run them**
    ```bash
   docker-compose up -d --build
   ```
   
8. **Open the app in your browser**

    Go to:  
    http://localhost:3000
   
9. **Shut down containers**  
    ```bash
   docker-compose down
    ```
