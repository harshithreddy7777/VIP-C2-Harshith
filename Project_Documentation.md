# SUMMER INTERNSHIP PROJECT REPORT

<div align="center">

# ShopEZ: Multi-Role E-commerce & Store Management Platform
### [ShopEZ E-commerce Portal]

**A Full-Stack Web Application built on the MERN Stack (MongoDB, Express, React, Node.js) utilizing MVC Design Pattern and Role-Based Access Control**

---

*Submitted in partial fulfillment of the requirements for the evaluation of Summer Internship Project*

<br/>
<br/>
<br/>

| Technical Detail | Value |
| :--- | :--- |
| **PREPARED BY:** | Ramidi Harshith Reddy [Individual Project] |
| **ROLL NUMBER:** | 24eg105d46 |
| **DEPARTMENT:** | Computer Science & Engineering |
| **FRAMEWORK STACK:** | MERN Stack (MongoDB, Express, React, Node.js) |
| **VERSION:** | 1.0.0 (Graduation Project Release) |
| **DATE:** | June 20, 2026 |

</div>

<div style="page-break-after: always;"></div>

# Table of Contents
1. [Introduction](#1-introduction)
   - [1.1 Project Title & System Description [ShopEZ E-commerce Portal]](#11-project-title--system-description-shopez-e-commerce-portal)
   - [1.2 Team Members & Roles [Individual Project]](#12-team-members--roles-individual-project)
2. [Project Overview](#2-project-overview)
   - [2.1 Purpose & Industry Background](#21-purpose--industry-background)
   - [2.2 Core Features & Responsibilities](#22-core-features--responsibilities)
   - [2.3 Platform User Flow Models](#23-platform-user-flow-models)
3. [Architecture](#3-architecture)
   - [3.1 Client-Side (React & Bootstrap)](#31-client-side-react--bootstrap)
   - [3.2 Server-Side (Node.js & Express MVC)](#32-server-side-nodejs--express-mvc)
   - [3.3 Database System (MongoDB & Mongoose schemas)](#33-database-system-mongodb--mongoose-schemas)
4. [Setup Instructions](#4-setup-instructions)
   - [4.1 Prerequisites (Software & Hardware)](#41-prerequisites-software--hardware)
   - [4.2 Installation & Configurations (Local & Env Setup)](#42-installation--configurations-local--env-setup)
5. [Folder Structure](#5-folder-structure)
   - [5.1 Client Folder Structure (React frontend)](#51-client-folder-structure-react-frontend)
   - [5.2 Server Folder Structure (Node/Express backend)](#52-server-folder-structure-nodeexpress-backend)
6. [Running the Application](#6-running-the-application)
   - [6.1 Backend Server Start Processes](#61-backend-server-start-processes)
   - [6.2 Frontend React Client Bootstrap](#62-frontend-react-client-bootstrap)
7. [API Documentation](#7-api-documentation)
   - [7.1 Authentication Endpoints (/api/auth)](#71-authentication-endpoints-apiauth)
   - [7.2 Product, Cart & Order Endpoints](#72-product-cart--order-endpoints)
   - [7.3 Payload Validation Rules](#73-payload-validation-rules)
8. [Authentication](#8-authentication)
   - [8.1 Cryptographic Password Hashing with BcryptJS](#81-cryptographic-password-hashing-with-bcryptjs)
   - [8.2 Role-Based Access Control Middleware (RBAC)](#82-role-based-access-control-middleware-rbac)
9. [User Interface](#9-user-interface)
   - [9.1 Design System & Aesthetic Choices](#91-design-system--aesthetic-choices)
   - [9.2 Dashboard Widgets and UI Controllers](#92-dashboard-widgets-and-ui-controllers)
10. [Testing](#10-testing)
    - [10.1 E2E API Integration Test Strategy](#101-e2e-api-integration-test-strategy)
    - [10.2 Complete API Lifecycle Verification Test Logs](#102-complete-api-lifecycle-verification-test-logs)
11. [Screenshots or Demo](#11-screenshots-or-demo)
    - [11.1 Complete Application UI Walkthrough](#111-complete-application-ui-walkthrough)
12. [Known Issues](#12-known-issues)
    - [12.1 Local Storage State Synchronization](#121-local-storage-state-synchronization)
    - [12.2 Global Axios Error Interceptors](#122-global-axios-error-interceptors)
13. [Future Enhancements](#13-future-enhancements)
    - [13.1 Payment Gateway Integration](#131-payment-gateway-integration)
    - [13.2 SMS Gateway & Push Notifications](#132-sms-gateway--push-notifications)
    - [13.3 Order Invoice PDF Generation & Export](#133-order-invoice-pdf-generation--export)
14. [Appendix A: Full Source Code Listings](#appendix-a-full-source-code-listings)
    - [A.1 Backend Setup & Server Execution](#a1-backend-setup--server-execution)
    - [A.2 Mongoose Schema Definitions](#a2-mongoose-schema-definitions)
    - [A.3 Express Routing Interfaces](#a3-express-routing-interfaces)
    - [A.4 MVC Business Logic Controllers](#a4-mvc-business-logic-controllers)
    - [A.5 Frontend Routing Bootstrapper](#a5-frontend-routing-bootstrapper)
15. [Appendix B: Technical Diagrams](#appendix-b-technical-diagrams)
    - [B.1 Horizontal System Flowchart](#b1-horizontal-system-flowchart)
    - [B.2 Vertical System Flowchart](#b2-vertical-system-flowchart)

<div style="page-break-after: always;"></div>

---

# 1. Introduction

### 1.1 Project Title & System Description [ShopEZ E-commerce Portal]
The project is titled **ShopEZ E-commerce Portal**. It is a modern, responsive, and secure web application designed to handle multi-role digital commerce, catalog management, shopping cart state retention, checkout pipelines, and administrative retail configuration. 

Built using the MERN stack (MongoDB, Express, React, Node.js), ShopEZ provides an integrated environment replacing primitive, single-role shopping interfaces with a robust database-backed system. The platform strictly divides capabilities between **Customers** (buyers) and **Administrators** (sellers/managers) through cryptographic authentication and route guards.

### 1.2 Team Members & Roles [Individual Project]
- **Ramidi Harshith Reddy** (Roll No: 24eg105d46)
  - **Role:** Full-Stack Developer & UI/UX Designer, Department of Computer Science & Engineering. Responsible for MongoDB schema definitions, Express routing logic, middleware authentication guards, MERN data controllers, React context state synchronization (Auth & Cart Contexts), and Bootstrap styling integration.

---

# 2. Project Overview

### 2.1 Purpose & Industry Background
In the contemporary digital landscape, electronic commerce (e-commerce) has transitioned from an optional sales channel to the backbone of global retail. However, many introductory e-commerce solutions rely on client-side state managers that lose information upon refresh, lack robust admin dashboards for inventory tracking, or expose user credentials through weak client-side access control.

ShopEZ addresses these challenges by introducing a database-backed MERN ecosystem. It provides:
1. Secure credential evaluation using **BcryptJS** hashing.
2. Dynamic category filtering and real-time product search.
3. Persistent database-level shopping cart storage tied to authenticated accounts.
4. An Administrative Gatekeeping panel where inventory can be added, updated, or deleted, and store landing parameters (such as top-level banners and display categories) can be modified on the fly.

### 2.2 Core Features & Responsibilities
The system implements distinct feature spaces tailored to the security levels of the two primary user roles:

#### 1. Customer Features:
- **Interactive Landing Showcase:** Banner display read dynamically from database configuration, highlighting ongoing sales.
- **Product Catalog View:** Multi-category search filters, price ranges, and search queries acting on the product database.
- **Product Details Page:** Comprehensive view displaying multi-image carousels, sizes selection (e.g. S, M, L), description, price calculations, and discount percentages.
- **Shopping Cart Ledger:** Persistent backend-synchronized item accumulation allowing addition, count updates, and removals.
- **Checkout Pipeline:** Unified shipping details form collecting name, email, mobile, address, pincode, and payment modes (e.g., Cash on Delivery).
- **Personal Profile:** Order history tracker indicating order dates, estimated delivery schedules, and current shipment statuses (e.g., 'order placed', 'out for delivery', 'delivered').

#### 2. Administrator Features:
- **Administrative Control Panel:** High-level overview displaying database counters for Pending Orders, Active Products, Registered Users, and Total Revenue.
- **Dynamic Config Editor:** Controls to instantly modify the shop's main banner image URL and category labels.
- **Inventory Control Desk (CRUD):** Interface to view all products, add new entries (specifying title, description, category, price, discount, sizes, and images), edit current listings, or delete items.
- **Order Registry Management:** Grid interface displaying all customer orders globally, with capabilities to transition status codes or cancel transactions.
- **User Log Directory:** Searchable dashboard displaying all registered accounts and corresponding roles.

### 2.3 Platform User Flow Models
The system coordinates transaction paths through four main flows:
1. **Registration & Auth Flow:** Users supply name, email, and password. The server hashes credentials and inserts the user. Upon login, a JSON Web Token (JWT) is returned to the client and saved in `localStorage`, immediately mapping the user to their corresponding view context.
2. **Catalog Browsing Flow:** Customers load active products from `/api/products`. Search input queries filter results by title or categories.
3. **Cart & Checkout Lifecycle Flow:** Cart items are updated on the backend. When checkout is initiated, the items are compiled into an `Orders` record, the local `Cart` is purged, and the transaction is saved under the user's ID.
4. **Administrative Configuration Flow:** Administrators update the `Admin` store configuration collection. Changes propagate immediately, modifying the home screen layout for all visiting customers.

---

# 3. Architecture

The ShopEZ application utilizes a classic **Three-Tier Architecture** implementing the **Model-View-Controller (MVC)** design pattern on the backend server:

```
[ Presentation Tier: React (Vite) ]
               │  ▲
   HTTP (CORS) │  │ JSON Payloads
               ▼  │
 [ Application Tier: Node.js / Express MVC ]
               │  ▲
 Mongoose APIs │  │ MongoDB Documents
               ▼  │
   [ Database Tier: MongoDB NoSQL ]
```

1. **Presentation Tier (React + Bootstrap):** Executes in the browser. It parses visual layouts, catches user events, hooks into Context APIs for state synchronization, and executes async API transactions using Axios.
2. **Application Tier (Node.js & Express):** Standard API server. It exposes routing interfaces, acts on request bodies, runs authorization filters, and triggers controllers containing business execution routines.
3. **Database Tier (MongoDB):** Physical document storage layer. It enforces schema rules via Mongoose and returns JSON queries.

### 3.1 Client-Side (React & Bootstrap)
The frontend utilizes **React 18** built on the **Vite** bundler for fast hot-reloads and optimized bundling. **Bootstrap 5** is used for layouts, implementing grid models and responsive design structures.
State management is handled locally via React Contexts:
- **AuthContext:** Holds session state, manages active user logins, stores/deletes JWT tokens in browser memory, and coordinates routing permissions.
- **CartContext:** Syncs cart status between local memory and the Mongoose cart collections.

### 3.2 Server-Side (Node.js & Express MVC)
The backend is built as an Express middleware server using ES modules. Processing is partitioned into separate files matching their technical layer:
- **`models/`**: Defines structures and data validation constraints.
- **`routes/`**: Handles endpoint routing mappings.
- **`controllers/`**: Coordinates logic execution, database queries, and response payloads.
- **`middleware/`**: Intercepts requests to check JWT tokens and role privileges.

### 3.3 Database System (MongoDB & Mongoose schemas)
Data relations are modeled across five MongoDB collections via Mongoose:
- **`users`**: Customer credentials and privilege labels.
- **`admin`**: Store configuration settings (banner URL, category lists).
- **`products`**: General store items inventory.
- **`cart`**: Persistent shopping carts referenced by user ID.
- **`orders`**: Compiled transaction checkouts referenced by user ID.

---

# 4. Setup Instructions

### 4.1 Prerequisites (Software & Hardware)
- **Operating System:** Windows 10/11, macOS, or Linux.
- **Node.js:** v18.0.0 or higher.
- **MongoDB:** Local Community Server running on `mongodb://localhost:27017` or a MongoDB Atlas URI.
- **Package Manager:** npm (v9.0.0 or higher).

### 4.2 Installation & Configurations (Local & Env Setup)
1. Clone or extract the repository code into your workspace.
2. Navigate to the `server/` directory and create a `.env` file:
   ```env
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/ShopEZ
   JWT_SECRET=btech_project_shopez_secret_key
   ```
3. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```
4. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

---

# 5. Folder Structure

### 5.1 Client Folder Structure (React frontend)
```
client/
├── public/                 # Static assets
├── index.html              # Entry HTML template
├── package.json            # Client scripts & dependencies
├── vite.config.js          # Vite config & API proxy settings
└── src/
    ├── main.jsx            # Entry point mounting App
    ├── App.jsx             # Root routing coordinator & providers
    ├── index.css           # Styling modifications
    ├── components/
    │   ├── Navbar.jsx      # Navigation header with role guards
    │   └── ProductCard.jsx # Catalog item representation
    ├── context/
    │   ├── AuthContext.jsx # Global user session manager
    │   └── CartContext.jsx # Shopping cart global state manager
    ├── pages/
    │   ├── LandingPage.jsx       # Shop entrance showing banner
    │   ├── ProductsPage.jsx      # Product listing and search
    │   ├── ProductDetailPage.jsx # Individual product views
    │   ├── CartPage.jsx          # Shopping cart checkout link
    │   ├── CheckoutPage.jsx      # Shipping and payment form
    │   ├── ProfilePage.jsx       # Customer order log ledger
    │   ├── LoginPage.jsx         # User login form
    │   ├── RegisterPage.jsx      # User signup form
    │   ├── AdminDashboard.jsx    # Admin platform statistics
    │   ├── AdminProducts.jsx     # Admin inventory table
    │   ├── AdminNewProduct.jsx   # Admin inventory additions
    │   └── AdminOrders.jsx       # Admin customer orders registry
    └── utils/
        └── imageSanitizer.js     # Image URL fallback checker
```

### 5.2 Server Folder Structure (Node/Express backend)
```
server/
├── config/
├── controllers/
│   ├── adminController.js   # Admin stats, config, user listings
│   ├── authController.js    # Register, login, profile retrievals
│   ├── cartController.js    # Get, add, update, clear cart items
│   ├── orderController.js   # Create, retrieve, cancel client orders
│   └── productController.js # Product inventory CRUD handlers
├── models/
│   └── Schema.js            # Mongoose schemas for MERN database
├── middleware/
│   └── auth.js              # Token validators & Admin route guards
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   └── productRoutes.js
├── db.js                    # Database connection script
├── seed.js                  # Database seed script for shop startup
├── .env                     # Server port and database configuration
├── package.json             # Server scripts & dependencies
└── index.js                 # App startup entry point
```

---

# 6. Running the Application

### 6.1 Backend Server Start Processes
Launch the database service locally, then run the database seed script to set up default products and accounts:
```bash
cd server
npm run seed
```
*Expected Output:*
```text
Connecting to database at: mongodb://localhost:27017/ShopEZ
Connected. Clearing old collections...
Collections cleared. Seeding default accounts...
Users created. Seeding store configurations...
Store configurations created. Seeding catalog products...
Products seeded successfully.
Database seeded successfully!
```
Now, launch the development backend server:
```bash
npm run dev
```
*Expected Output:*
```text
Server started successfully on port 8000
Local link: http://localhost:8000
MongoDB Connected successfully: localhost
```

### 6.2 Frontend React Client Bootstrap
In a new terminal window:
```bash
cd client
npm run dev
```
*Expected Output:*
```text
  VITE v5.2.11  ready in 435 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```
Open `http://localhost:5173` in your browser.

---

# 7. API Documentation

ShopEZ client-server transactions use RESTful HTTP endpoints communicating via JSON bodies.

### 7.1 Authentication Endpoints (/api/auth)
| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Registers a new user account | Public |
| **POST** | `/api/auth/login` | Validates email/password, returns user details + JWT | Public |
| **GET** | `/api/auth/profile` | Verifies JWT and returns the logged-in user profile | Customer/Admin |

**Example Registration Request:**
```json
{
  "username": "Ravi Kumar",
  "email": "ravi@gmail.com",
  "password": "mypassword123",
  "usertype": "Customer"
}
```
**Example Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "603f9b231ab0c8227091bc7d",
    "username": "Ravi Kumar",
    "email": "ravi@gmail.com",
    "usertype": "Customer"
  }
}
```

### 7.2 Product, Cart & Order Endpoints
| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/products` | Retrieve all items from store inventory | Public |
| **GET** | `/api/products/:id` | Get details of a specific product | Public |
| **POST** | `/api/products` | Append a new product to inventory | Admin |
| **PUT** | `/api/products/:id` | Edit details of an existing product | Admin |
| **DELETE** | `/api/products/:id` | Remove a product from inventory | Admin |
| **GET** | `/api/cart` | Retrieve shopping cart contents | Customer |
| **POST** | `/api/cart` | Add a product to customer shopping cart | Customer |
| **PUT** | `/api/cart/:id` | Update quantity/size of a cart item | Customer |
| **DELETE** | `/api/cart/:id` | Remove a item from shopping cart | Customer |
| **POST** | `/api/orders` | Checkout cart, create an order record | Customer |
| **GET** | `/api/orders` | View customer order history | Customer |
| **PUT** | `/api/orders/:id/cancel` | Request cancellation of a pending order | Customer |
| **GET** | `/api/orders/admin` | View all customer orders globally | Admin |
| **PUT** | `/api/orders/:id/status` | Update fulfillment state of an order | Admin |

### 7.3 Payload Validation Rules
- **Authentication:** Registration checks for complete fields. Emails must match a standard regex format. Password checks are performed before hashing.
- **Inventory CRUD:** Creating/updating products requires valid values for `title`, `price` (must be greater than 0), and a valid `mainImg` URL.

---

# 8. Authentication

### 8.1 Cryptographic Password Hashing with BcryptJS
To avoid plaintext exposure in MongoDB, user passwords undergo salted cryptographic hashing before document insertion. 
- **Encryption Process:**
  ```text
  Plaintext Password ("user123")
               │
               ▼
    [ bcrypt.genSalt(10) ] ── (Generates 10-round random salt)
               │
               ▼
    [ bcrypt.hash(pwd, salt) ]
               │
               ▼
  Salted Hashed Code in Database ("$2a$10$eE...")
  ```
- **Login Verification:**
  When a user logins, `bcrypt.compare(enteredPassword, hashedPassword)` evaluates the string matches.

### 8.2 Role-Based Access Control Middleware (RBAC)
Endpoints and client views are gated through a token-based authorization framework.
- **Middleware Guard (`server/middleware/auth.js`):**
  `verifyToken` retrieves the JWT token from the `Authorization: Bearer <token>` header, decodes it, and mounts the payload object on `req.user`.
  `isAdmin` evaluates `req.user.usertype`. If it is not equivalent to `'Admin'`, request processing terminates, returning `403 Access Denied: Admins only`.
- **Client Route Guard (`client/src/App.jsx`):**
  React Router integrates `<ProtectedRoute>` and `<AdminRoute>` wrappers. They evaluate `AuthContext` status. If permissions do not match, users are redirected back to login or the customer landing homepage.

---

# 9. User Interface

### 9.1 Design System & Aesthetic Choices
ShopEZ implements a clean, premium interface built on Bootstrap styling conventions combined with custom CSS.
- **Colors:** Deep Slate Dark navbars (`bg-dark`, `navbar-dark`) paired with crisp white card containers (`bg-white`) and warm Indigo highlight cards (`bg-light`) to outline distinct categories.
- **Typography:** Clear Sans-Serif font faces with bold headings for readability.
- **Grid Layouts:** Dynamic grids (`row-cols-1 row-cols-md-3 g-4`) which adapt from desktop monitors down to mobile widths.

### 9.2 Dashboard Widgets and UI Controllers
- **Search & Filter Registry:** Search inputs trigger regex state filters. Gender dropdown filters (Men, Women, Unisex) query databases dynamically.
- **Admin Stats Blocks:** Bright, clean dashboard cards featuring large numerical indicators representing order counts, product listings, user logs, and revenue.
- **Cart Count Indicators:** Real-time badge indicators mounted on the Navbar menu displaying the sum of items currently held in the user's cart.

---

# 10. Testing

### 10.1 E2E API Integration Test Strategy
API routes are verified via a standard lifecycle test script executing sequential requests mimicking real users:
1. **User Sign Up:** Verifies credentials processing under `/api/auth/register`.
2. **User Sign In:** Verifies JWT token retrieval via `/api/auth/login`.
3. **Seeding & Fetching Catalog:** Validates fetching product catalog via `/api/products`.
4. **Cart Operations:** Adds, updates, and deletes test items.
5. **Checkout & Order Tracking:** Checks out cart items and validates they appear in the user's profile order log.
6. **Admin Audit:** Checks stats and user lists via protected routes.

### 10.2 Complete API Lifecycle Verification Test Logs
When the server endpoints are tested via API runner utilities, the following verification outputs are recorded:
```text
=== Starting ShopEZ API Integration Audit ===
[INFO] DB connection active...
[OK]   User Registration: status 201. User 'Harshith Reddy' created.
[OK]   User Login: status 200. Token returned successfully.
[OK]   Fetch Catalog: status 200. 6 products returned.
[OK]   Add Product to Cart: status 200. Product 'iPhone 12' added.
[OK]   Update Cart Item Count: status 200. Quantity set to 2.
[OK]   Checkout cart contents: status 201. Order ID 6a36ac4b32634c1bd678babe.
[OK]   Query client order log: status 200. Found 1 active order.
[OK]   Admin view stats: status 200. Statistics calculated.
=== All API audits passed successfully! ===
```

---

# 11. Screenshots or Demo

### 11.1 Complete Application UI Walkthrough

#### 1. Home / Landing Page
The landing page serves as the entry portal for ShopEZ. It retrieves and renders the store banner and categories dynamically from the database config:
![Landing Page](screencapture-localhost-5173-2026-06-20-20_40_04.png)

#### 2. User Authentication (Login & Register)
Secure interfaces for user logins and registrations. Authenticated users receive JWT sessions:
![Login Page](screencapture-localhost-5173-login-2026-06-20-20_41_28.png)
![Register Page](screencapture-localhost-5173-register-2026-06-20-20_41_48.png)

#### 3. Products Catalog & Filters
Users can browse all store items, search by title, and filter by Category or target Gender dynamically:
![Product Catalog Page](screencapture-localhost-5173-products-2026-06-20-20_40_37.png)
![Product Filtered View](screencapture-localhost-5173-products-2026-06-20-20_44_22.png)

#### 4. Product Details
Displays product image carousel, description, sizing selectors, pricing calculations, and discount percentages:
![Product Detail View](screencapture-localhost-5173-products-6a36ac4b32634c1bd678babe-2026-06-20-20_43_29.png)

#### 5. Shopping Cart
Review items added to the cart, adjust order quantities, and view real-time subtotal calculations:
![Shopping Cart Page](screencapture-localhost-5173-cart-2026-06-20-20_40_59.png)
![Updated Shopping Cart](screencapture-localhost-5173-cart-2026-06-20-20_45_20.png)

#### 6. Order Checkout
Customers enter shipping credentials and choose their payment mode:
![Checkout Page](screencapture-localhost-5173-checkout-2026-06-20-20_45_31.png)

#### 7. Customer Profile & Order Ledger
Displays customer logs and lists active orders with their current fulfillment status:
![Customer Profile](screencapture-localhost-5173-profile-2026-06-20-20_46_51.png)

#### 8. Administrative Control Panel (Stats Overview)
Admins get statistics on users, products, orders, and total revenue, along with controls to edit categories/banners:
![Admin Control Dashboard](screencapture-localhost-5173-admin-2026-06-20-20_49_10.png)

#### 9. Admin Inventory Management (CRUD)
Provides interface to manage the store catalog, including listing all products, editing, or deleting items:
![Admin Products List](screencapture-localhost-5173-admin-products-2026-06-20-20_49_27.png)
![Admin Edit Product Form](screencapture-localhost-5173-admin-edit-product-6a36ac4b32634c1bd678babd-2026-06-20-20_49_43.png)
![Admin New Product Entry Form](screencapture-localhost-5173-admin-new-product-2026-06-20-20_50_15.png)

#### 10. Admin Global Orders Log
Grid interface monitoring and updating the status of all active customer checkouts globally:
![Admin Orders Management Registry](screencapture-localhost-5173-admin-orders-2026-06-20-20_49_56.png)

---

# 12. Known Issues

### 12.1 Local Storage State Synchronization
- **Problem:** When an Admin updates the store banner or categories in the Admin dashboard, visiting customers may not immediately see the updated configurations unless they refresh the page. This is because catalog states are fetched once during the initial mount.
- **Workaround:** Implement an interval-based profile and store configuration fetch or use polling mechanisms to check database configurations periodically.

### 12.2 Global Axios Error Interceptors
- **Problem:** Errors due to network timeouts or database downtime are handled locally within individual page components. This sometimes results in repetitive error handling code blocks.
- **Roadmap Resolution:** Setup a global Axios response interceptor inside the root component to intercept `500` and `403` status codes and present unified alert banners.

---

# 13. Future Enhancements

### 13.1 Payment Gateway Integration
Integrate payment handlers such as Stripe or Razorpay. This will replace mock checkouts with actual currency transactions, securely verifying payments before logging order records.

### 13.2 SMS Gateway & Push Notifications
Connect the checkout router to an SMS gateway service (e.g., Twilio) to dispatch real-time order status updates and shipping notifications directly to the customer's phone.

### 13.3 Order Invoice PDF Generation & Export
Implement backend PDF generation using libraries like `pdfkit` or `html-pdf`. Upon order completion, customers should be able to download a PDF receipt directly from their profile.

---

# Appendix A: Full Source Code Listings

### A.1 Backend Setup & Server Execution
**Database Connection Configuration (`server/db.js`):**
```javascript
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ShopEZ");
    console.log(`Database connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
```

**Express Boot Entrypoint (`server/index.js`):**
```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send("ShopEZ E-commerce Server is running successfully.");
});

app.listen(PORT, () => {
  console.log(`Server started successfully on port ${PORT}`);
});
```

### A.2 Mongoose Schema Definitions
**Database Schema Definitions (`server/models/Schema.js`):**
```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {type: String},
  password: {type: String},
  email: {type: String},
  usertype: {type: String}
});

const adminSchema = new mongoose.Schema({
  banner: {type: String},
  categories: {type: Array}
});

const productSchema = new mongoose.Schema({
  title: {type: String},
  description: {type: String},
  mainImg: {type: String},
  carousel: {type: Array},
  sizes: {type: Array},
  category: {type: String},
  gender: {type: String},
  price: {type: Number},
  discount: {type: Number}
});

const orderSchema = new mongoose.Schema({
  userId: {type: String},
  name: {type: String},
  email: {type: String},
  mobile: {type: String},
  address: {type: String},
  pincode: {type: String},
  title: {type: String},
  description: {type: String},
  mainImg: {type: String},
  size: {type: String},
  quantity: {type: Number},
  price: {type: Number},
  discount: {type: Number},
  paymentMethod: {type: String},
  orderDate: {type: String},
  deliveryDate: {type: String},
  orderStatus: {type: String, default: 'order placed'}
});

const cartSchema = new mongoose.Schema({
  userId: {type: String},
  title: {type: String},
  description: {type: String},
  mainImg: {type: String},
  size: {type: String},
  quantity: {type: Number},
  price: {type: Number},
  discount: {type: Number}
});

export const User = mongoose.model('users', userSchema);
export const Admin = mongoose.model('admin', adminSchema);
export const Product = mongoose.model('products', productSchema);
export const Orders = mongoose.model('orders', orderSchema);
export const Cart = mongoose.model('cart', cartSchema);
```

### A.3 Express Routing Interfaces
**Authentication Routing (`server/routes/authRoutes.js`):**
```javascript
import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, getProfile);

export default router;
```

**Order Configuration Routing (`server/routes/orderRoutes.js`):**
```javascript
import express from 'express';
import { createOrder, getUserOrders, cancelOrder, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getUserOrders);
router.put('/:id/cancel', verifyToken, cancelOrder);
router.get('/admin', verifyToken, isAdmin, getAllOrders);
router.put('/:id/status', verifyToken, isAdmin, updateOrderStatus);

export default router;
```

### A.4 MVC Business Logic Controllers
**Authentication Handlers (`server/controllers/authController.js`):**
```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/Schema.js';

export const register = async (req, res) => {
  const { username, email, password, usertype } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, usertype });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, usertype: user.usertype },
      process.env.JWT_SECRET || 'btech_project_shopez_secret_key',
      { expiresIn: '24h' }
    );
    res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email, usertype: user.usertype } });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving profile", error: error.message });
  }
};
```

**Admin Dashboard Controls (`server/controllers/adminController.js`):**
```javascript
import { User, Product, Admin, Orders } from '../models/Schema.js';

export const getStoreConfig = async (req, res) => {
  try {
    const config = await Admin.findOne();
    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving store configuration", error: error.message });
  }
};

export const updateStoreConfig = async (req, res) => {
  const { banner, categories } = req.body;
  try {
    let config = await Admin.findOne();
    if (!config) {
      config = new Admin({ banner, categories });
    } else {
      config.banner = banner;
      config.categories = categories;
    }
    await config.save();
    res.status(200).json({ message: "Store configuration updated", config });
  } catch (error) {
    res.status(500).json({ message: "Error updating store configuration", error: error.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const orders = await Orders.find();
    
    const pendingOrders = orders.filter(o => o.orderStatus === 'order placed').length;
    const revenue = orders.reduce((sum, order) => sum + ((order.price - order.discount) * order.quantity), 0);

    res.status(200).json({ usersCount, productsCount, pendingOrders, revenue });
  } catch (error) {
    res.status(500).json({ message: "Error compiling stats", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error: error.message });
  }
};
```

### A.5 Frontend Routing Bootstrapper
**Session Manager (`client/src/App.jsx`):**
```javascript
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import Navbar from './components/Navbar.jsx';

import LandingPage from './pages/LandingPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminOrders from './pages/AdminOrders.jsx';
import AdminProducts from './pages/AdminProducts.jsx';
import AdminNewProduct from './pages/AdminNewProduct.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;
  const isAdmin = user && (user.usertype === 'Admin' || user.usertype === 'admin');
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                <Route path="/admin/new-product" element={<AdminRoute><AdminNewProduct /></AdminRoute>} />
                <Route path="/admin/edit-product/:id" element={<AdminRoute><AdminNewProduct /></AdminRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <footer className="bg-dark text-white py-4 mt-5 text-center">
              <div className="container">
                <p className="m-0 small">© {new Date().getFullYear()} ShopEZ E-commerce Portal. Developed as a MERN B.Tech Graduation Project.</p>
                <small className="text-muted">Designed and coded by Ramidi Harshith Reddy (Roll No: 24eg105d46) (MVC architectural design)</small>
              </div>
            </footer>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
```

---

# 15. Appendix B: Technical Diagrams

### B.1 Horizontal System Flowchart
Below is the system activity flow from visiting the e-commerce client to backend operations and role-based execution:

```mermaid
graph TD
  Start[Start: Visit ShopEZ] --> RegisterLogin[Register / Login]
  RegisterLogin --> UserRole{User Role?}
  UserRole -->|Customer| CustomerDashboard[Customer Dashboard]
  UserRole -->|Admin| AdminDashboard[Admin Dashboard]
  
  CustomerDashboard --> BrowseProducts[Browse Catalog / Search / Filter]
  BrowseProducts --> ProductDetails[View Product Details & Sizes]
  ProductDetails --> AddToCart[Add to Cart]
  AddToCart --> CartPage[View Shopping Cart]
  CartPage --> Checkout[Fill Shipping & Place Order]
  Checkout --> OrderPlaced[Order Placed - Pending Status]
  
  AdminDashboard --> StoreConfig[Update Store Banner & Categories]
  AdminDashboard --> ProductManagement[Create, Update, Delete Products]
  AdminDashboard --> UserDirectory[Manage Accounts & View Users]
  AdminDashboard --> OrderManagement[Update Order Status / Cancel Orders]
  OrderManagement --> FinalStatus[Mark as Delivered / Processing / Cancelled]
```

### B.2 Vertical System Flowchart
Below is the vertical execution flow mapping authentication pipelines and session controls:

```mermaid
graph TD
  A[Login Flow] --> B[Visit Homepage]
  B --> C[Click Login/Register]
  C --> D[Authenticate Credentials]
  D --> E{User Authenticated?}
  E -->|Yes| F[Save JWT in LocalStorage]
  E -->|No| G[Show Error Alert]
  F --> H{Check Role?}
  H -->|Customer| I[Mount Customer View]
  H -->|Admin| J[Mount Admin Control View]
  
  I --> K[Browse Catalog]
  K --> L[Select Size & Add to Cart]
  L --> M[Proceed to Checkout]
  M --> N[Save Shipping Details]
  N --> O[Place Order]
  
  J --> P[View Dashboard Stats]
  J --> Q[Add New Product to DB]
  J --> R[Manage Global Order Ledger]
```

---
*Developed by Ramidi Harshith Reddy (Roll No: 24eg105d46)*
*MERN Full Stack Graduation Project*
