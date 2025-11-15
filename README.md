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
## Run
npm run dev
**Please add .env file both on frontend and backend**

## Environment Setup

Create a .env file in the root directory:
```text
GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json
# FIREBASE_DATABASE_URL=https://analytic-dashboard-12345.firebaseio.com
PORT=4000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password123
FIREBASE_ADMIN_JSON='{".....couldn't add here"}'
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
```TypeScript Installation ```
npm install --save-dev typescript ts-node nodemon @types/node

npx tsc --init


# Start server
 ``` npm run dev ```

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
