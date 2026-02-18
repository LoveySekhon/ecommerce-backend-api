# 🛒 E-Commerce Backend API (Node.js + Express + MySQL)

🌐 Live API: https://ecommerce-backend-api-1mbm.onrender.com

---

## 🚀 Project Overview

This is the backend API for a full-stack E-Commerce application.

It is built using:

- Node.js
- Express.js
- MySQL
- JWT Authentication
- Role-Based Access Control (RBAC)

The backend is deployed on **Render** and connects to a production MySQL database.

---

## 🌍 Architecture

Client (Vercel Frontend)
⬇
REST API (Render Backend)
⬇
MySQL Database

---

## 🔐 Authentication & Security

- JWT-based authentication
- Role-based access (Admin / User)
- Protected routes (Product management, Orders)
- Transaction-based order processing
- Server-side validation
- Error handling middleware

---

## 📦 Core Features

### 👤 User
- Register
- Login
- JWT Token generation

### 📦 Products
- Create (Admin only)
- Update (Admin only)
- Delete (Admin only)
- Get all products
- Get single product
- Server-side pagination
- Sorting
- Category filtering

### 🛒 Cart
- Add to cart
- Update quantity
- Remove from cart
- View cart

### 📦 Orders
- Transaction-based order creation
- Stock deduction
- Order history
- Admin order status updates

### 📊 Analytics
- Dashboard summary
- Total revenue
- Total orders
- Total products

---

## 🧱 Folder Structure

```
Backend/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 ├── config/
 ├── server.js
 └── package.json
```

Separation of concerns:

- Models → Database queries
- Controllers → Business logic
- Routes → Endpoint definitions
- Middleware → Authentication & Authorization

---

## 🔧 Tech Stack

- Node.js
- Express
- MySQL (Railway / Production DB)
- JWT
- Render (Deployment)

---

## 📦 Local Setup

Clone repository:

```bash
git clone <repo-url>
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```
PORT=5000
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
JWT_SECRET=your_secret_key
```

Run server:

```bash
npm run dev
```

---

## 👤 Author

Lovepreet Singh  
Full-Stack Developer
