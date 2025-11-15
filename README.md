# 📊 Analytic Real-Time Product - Backend

A **Node.js + Express** backend API for the Real-Time Product Management Dashboard. Handles product CRUD operations, authentication, and provides secure API endpoints for frontend consumption.
![Backend](https://github.com/user-attachments/assets/d3c957ad-84ec-4612-8f21-0a4046410c78)

---

## 🚀 Features

* **🔐 JWT Authentication** – Secure login and protected routes
* **📦 Product CRUD API** – Create, Read, Update, Delete products
* **📡 Realtime Ready** – Works with **Firestore listeners** for live updates
* **🧾 Data Validation** – Input validation using custom middleware
* **⚡ Simple Express Server** – Easy to extend with additional endpoints

---

## 🛠 Tech Stack

* **Backend Framework:** Node.js + Express
* **Database:** Firebase Firestore
* **Authentication:** JWT (JSON Web Tokens)
* **Middleware:** CORS, Cookie-Parser, Body-Parser
* **Environment Variables:** dotenv
* **Validation:** Custom middleware

---

## 📁 Project Structure

```text
src/
├── index.ts             # Entry point, Express server setup
├── routes/
│   ├── authRoutes.ts    # Authentication endpoints
│   └── productRoutes.ts # Product CRUD endpoints
├── controllers/
│   ├── authController.ts
│   └── productController.ts
├── lib/
│   ├── firebaseAdmin.ts # Firebase Admin SDK setup
│   └── middleware/      # Auth, error handling, and validation middleware
├── models/              # Optional: TypeScript interfaces/types
└── utils/               # Utility functions
```
## ⚡ Quick Start
Prerequisites

Node.js 18+

npm or yarn

Firebase project with service account credentials

## Installation
```text
git clone <repository-url>
cd product-dashboard-backend
npm install
```

## Environment Setup

Create a .env file in the root directory:
```text
GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json
# FIREBASE_DATABASE_URL=https://analytic-dashboard-12345.firebaseio.com
PORT=4000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password123
FIREBASE_ADMIN_JSON='{"type":"service_account","project_id":"analytic-dashboard-fac7a","private_key_id":"a5507ad94e5ab6005d470690a2918613c7d0d426","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDSNe7+U+u0Dbqp\nQuDDf9n/iWlBSe+X9nBhlSsmKpzy2juyuuR9LkMicim7Maumo/2QQWe4eUDO32zc\n3WAU0mpSRjD25g7LH7tU3CxojZECYZVEiJ9LiNZxhB1bxPVdjCCQe3onrxx7w19H\n4cjCGAwiIGuuUchmTUjJzae9+Q602jpCVlH7NyuR1N/HUaE2JRj2tMW/YIEBXS95\nBJYgfr4+nBr3MwXqFgmq200cHVAfko5ea+UeQRtyXk5Wdtwm31Gi++Rg1gcF+DN+\nShkccGiqXIR6Q9HbDaPHf4PGGj0zf1UhfZJimXIPRaJ8ce0jxOWtAY3l+6Z+np1O\nDaxnHrdVAgMBAAECggEAUZ60Zdbi6Z39ELSRfgc592D81+dj2s7K0vDu+JpKJ3d5\n/4tWpY5dbdYDAxalrgX1sdnbcoLOGaUh6V4hbORIeRqc73jjXJY9EBWPPqddGx4V\nra8YnuUKUrg4CAZhOQnsKP1wsFDrT9jLuabe4xIgP+3zsZM6qxIuBYFPNNGsFqcD\nCWvQzu2h+eoZ2jJGT92BBZbbHCxDcslqTzqZHBBkEc0BA1fE6KwZfvZSVq8MdmzF\nOh8ZZve/M2PADDOpVnOS1m+nii9V52gWf34rLGVQARrz2kGpkk4avn7w3TZtFzJm\navi48cU4h86PIhP/60GdjY29o13vmOWjyY8M6gXujwKBgQDukMKtDoMN6zLSLid8\ndwaaITZXJSg0sAPqhT92CazeDS0HnLIbOHTd67kXr6sJr+RW3BE9CaHva6bdUgqP\nFa+Sg5Lgj/dnsqQmk+mVK+A+MHWhdrMiuaP6BiLyYhC/YjXwhibUJKrrezLG84/g\nTLza0AWRQpjh/QH0qdjbaHG3gwKBgQDhkrFqWyLmq7e9kMC/GcZIWztkoJgqr4PD\nX7K2KEeOFsDQBCxRJhZ4+VwNcZ+hcTPL2D7x9n/psS8nqGtXArh9FORo+BInzSiu\nbZy8HGGK2Ec5j483jxLSaHd7D3JsMMthmuZZnRXshj/3+U5HdXnjEBkN4rRpmlfG\nHHQ2N01GRwKBgQCt/D0+YPsLR6EE0ExT5aqW9enfnGW6JzRz8UHbICtGtm1Ew+7R\nE1eIEcYnlCI1KmZpQo3/6eqD5gsIFjFFMReezv5rcBOLOSmmSPFtrVYZhNYFL8Bt\nbt48FgWeqA52xXV5OR1QUn2kx3C80Bz6BH0nR9cHnX5KMm8etFBHk+B7aQKBgQDR\nYruw//v7pvYdzto8CY7W52jQVYoqRVXH63MWR3l0WYaNEPKaOQKvNLjP+eK1l0D/\nPTHgpHHD2SbuZxWMZQgfg18qWOtxaq0SjMjqjGW23l/u/GVyqypLiZEu9/28k+aW\nKZUdJgWN0mhapF6XUmLb9Lts+j2BsTU8vnjZQqhGTQKBgGXAS26D49CBrQxlsKl3\nCQjlXGZW09jDNeydiNqEKtN04NGzf0jk2Bme14Ka9kppZqFxjgihntDdv5Bpuksu\nMA2QRAhdl6LcNHGVZbF+D5kipFaLUvnrvH5FgIHdLaZluKp5rA6xpuVEFSkQIzdL\ntl5KRO7Qt7S9Rtuk3LRkOIES\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-fbsvc@analytic-dashboard-fac7a.iam.gserviceaccount.com","client_id":"115547351911950156367","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40analytic-dashboard-fac7a.iam.gserviceaccount.com","universe_domain":"googleapis.com"}'
```
## Run Development Server
```text
npm run dev
```
Open **http://localhost:4000** to test endpoints.

🔗 API Endpoints
Authentication

POST /api/auth/login – Login with email & password, returns JWT

POST /api/auth/register – Register a new user (optional)

Products

GET /api/products – Get all products

GET /api/products/:id – Get a single product

POST /api/products – Add a new product

PUT /api/products/:id – Update product by ID

DELETE /api/products/:id – Delete product by ID

All product endpoints are JWT protected.

## 🏗 Production Build
# Compile TypeScript
```text npm run build ```

# Start server
 ```text npm start ```

🔧 Development Scripts
**npm run dev**         # Start development server with nodemon

**npm run build**        # Compile TypeScript to JavaScript

**npm run start**        # Start production server

**npm run lint**         # Run ESLint

**npm run type-check**   # Run TypeScript compiler


## 📫 Contact
Any questions? Send an email to **jerinrubaiyakhan11@gmail.com**

Built using **Node.js, Express, Firebase Firestore, and TypeScript.**

---
