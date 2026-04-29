<div align="center">

# 🥬 GreenHouse Market — Backend API

**A production-grade REST API powering a single-vendor grocery e-commerce platform.**

Built with intent. Designed for real commerce.

![Node.js](https://img.shields.io/badge/Node.js-v20-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-v5-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Cashfree](https://img.shields.io/badge/Payments-Cashfree-6C3CE1?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![ESM](https://img.shields.io/badge/Modules-ESM-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

</div>

---

## 🧭 What Is This?

GreenHouse Market is a **single-vendor, multi-unit grocery e-commerce backend** — purpose-built for a local grocery store that needs a modern digital storefront. Think of it as the engine behind a platform where a vendor manages their catalogue (with per-unit variants like _1kg_, _500g_, _piece_), processes orders, and accepts payments — while customers browse, build carts, wishlist products, and check out seamlessly.

This isn't a boilerplate. It's a system designed around **real grocery commerce patterns**: variant-aware stock management, SKU tracking, hierarchical category trees, OTP-verified authentication, webhook-driven payment confirmation, and smart email notifications when wishlisted products go in or out of stock.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Vite + React)              │
└──────────────────────────┬──────────────────────────────┘
                           │  HTTPS / REST
┌──────────────────────────▼──────────────────────────────┐
│                    Express v5 Server                     │
│  ┌──────────┐  ┌────────────┐  ┌─────────────────────┐  │
│  │   Auth   │  │ Middleware │  │   Global Error       │  │
│  │  (JWT)   │  │  (RBAC)    │  │   Handler            │  │
│  └────┬─────┘  └─────┬──────┘  └─────────────────────┘  │
│       │              │                                   │
│  ┌────▼──────────────▼──────────────────────────────┐   │
│  │              Route Layer (13 modules)             │   │
│  └────────────────────┬─────────────────────────────┘   │
│                       │                                  │
│  ┌────────────────────▼─────────────────────────────┐   │
│  │           Controller Layer (13 modules)           │   │
│  └────────────────────┬─────────────────────────────┘   │
│                       │                                  │
│  ┌────────────────────▼─────────────────────────────┐   │
│  │             Service Layer (4 services)            │   │
│  │  Payment · Cashfree · Notification · Order        │   │
│  └────────────────────┬─────────────────────────────┘   │
│                       │                                  │
│  ┌────────────────────▼─────────────────────────────┐   │
│  │          Data Layer (11 Mongoose Models)          │   │
│  │  User · Product · Order · Cart · Category         │   │
│  │  Address · Payment · Notification · Wishlist      │   │
│  │  OTP · Counter                                    │   │
│  └────────────────────┬─────────────────────────────┘   │
└───────────────────────┼─────────────────────────────────┘
                        │
         ┌──────────────▼──────────────┐
         │      MongoDB Atlas          │
         │  + Cloudinary CDN           │
         │  + Cashfree Payment Gateway │
         │  + Nodemailer (SMTP)        │
         └─────────────────────────────┘
```

The backend follows a clean **Route → Controller → Service → Model** pattern. Business logic that spans multiple models (like creating an order with payment) is extracted into dedicated services — keeping controllers thin and composable.

---

## ⚙️ Tech Stack

| Layer                | Technology                  | Why                                                         |
| -------------------- | --------------------------- | ----------------------------------------------------------- |
| **Runtime**          | Node.js 20 (ESM)            | Native ES module support, modern async patterns             |
| **Framework**        | Express v5                  | Latest stable with improved routing and error handling      |
| **Database**         | MongoDB Atlas + Mongoose 9  | Flexible schema for grocery product variants                |
| **Authentication**   | JWT + bcrypt                | Stateless auth with 7-day token expiry                      |
| **Payments**         | Cashfree PG (Sandbox/Prod)  | UPI, cards, netbanking — Indian payment ecosystem           |
| **File Storage**     | Cloudinary via Multer       | CDN-backed image hosting with on-the-fly transforms         |
| **Email**            | Nodemailer + HTML templates | Templated transactional emails (OTP, welcome, stock alerts) |
| **Containerization** | Docker (Alpine)             | Lean production image, `node:20-alpine` base                |

---

## 🔐 Authentication & Authorization

The auth system is **OTP-first** — users must verify their email before registration completes. This isn't a gimmick; it eliminates ghost accounts and ensures deliverability for transactional emails from day one.

**How it works:**

1. Client requests OTP → server generates 6-digit code, stores with 5-minute TTL (auto-expiring via MongoDB TTL index)
2. Client verifies OTP → record is marked `isVerified: true`
3. Client submits signup → server checks verified OTP before creating the user
4. Password is hashed with `bcrypt` (cost factor 10) and a JWT is issued with `{ id, role }` payload

**Two-tier RBAC** protects all sensitive operations:

- `protect` middleware — validates JWT, hydrates `req.user`
- `authorizeRoles("vendor")` — gates vendor-only endpoints (product CRUD, order management, store settings)

Password recovery follows the same OTP flow — verify first, then reset.

---

## 🛒 Domain Model

This is where the system gets interesting. The data model is designed specifically for grocery commerce — not generic e-commerce.

### Products & Variants

Every product has **multiple variants** — not as separate SKUs, but as embedded documents with independent pricing and stock. A single product entry for _Organic Basmati Rice_ might contain:

```
variants: [
  { label: "1 kg",  price: 220, discountPrice: 199, stock: 50 },
  { label: "5 kg",  price: 999, discountPrice: 899, stock: 12 },
  { label: "10 kg", price: 1899,                     stock: 5  }
]
```

This design eliminates duplicate products and gives vendors granular stock control per unit size. The `unit` field (`kg`, `litre`, `piece`) provides semantic context for the storefront.

### Category Tree

Categories support **unlimited nesting** via self-referencing `parent` fields. The `getCategoryTree` endpoint builds a full tree in-memory and enriches each node with a `totalSubcategories` count. Slugs are auto-generated from names on save.

Products reference both a `category` and an optional `subCategory` — allowing the `getProductByCategory` endpoint to recursively collect all descendant category IDs and return every product under a given branch.

### Orders & Stock

When an order is placed:

- Stock is **decremented atomically** per variant
- A custom order ID is generated via an atomic counter (`ORD-000001`, `ORD-000002`, ...)
- Low stock triggers an **automatic vendor notification** (threshold: 5 units)
- Cart is cleared post-checkout

The order lifecycle: `payment_pending → confirmed → processing → shipped → delivered` (or `cancelled`).

---

## 💳 Payment Architecture

Payments are handled through **Cashfree Payment Gateway** with a proper two-phase flow:

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐
│  Client  │────▶│ Create Order │────▶│ Cashfree PG  │────▶│ Webhook  │
│          │     │ + Payment    │     │ (hosted page) │     │ Callback │
│          │     │ Session      │     │               │     │          │
└──────────┘     └──────────────┘     └──────────────┘     └────┬─────┘
                                                                │
                                                     ┌──────────▼──────────┐
                                                     │ Verify Signature    │
                                                     │ Update Order Status │
                                                     │ Deduct Stock        │
                                                     │ Clear Cart          │
                                                     │ Notify Vendor       │
                                                     └─────────────────────┘
```

**Key design decisions:**

- **Webhook-first confirmation** — the webhook route is mounted _before_ `express.json()` middleware so it receives the raw body needed for HMAC signature verification
- **Idempotent processing** — duplicate webhook calls are safely handled (checks if payment is already marked `success`)
- **Stock reservation** — for online payments, stock is validated _again_ at webhook time to prevent overselling during the payment window
- **Dual verification** — a client-side `/verify/:orderId` endpoint also checks Cashfree's API directly as a fallback
- **COD support** — orders can bypass the payment flow entirely with `paymentMethod: "COD"`

The `Payment` model stores the full gateway response, transaction IDs, and failure reasons for audit trails.

---

## 📧 Notification System

The notification layer operates on two channels:

### In-App Notifications

Stored in MongoDB with typed categories (`order`, `stock`, `payment`, `delivery`, `system`). Each notification links back to its source via `referenceId` + `referenceType` — enabling deep-linking from the notification center to the relevant order or product.

### Transactional Emails

A template engine reads HTML files from `templates/emails/`, replaces `{{ placeholder }}` tokens, and dispatches via Nodemailer. Four production-ready templates ship out of the box:

| Template                   | Trigger                             |
| -------------------------- | ----------------------------------- |
| `otp-email.html`           | Email verification & password reset |
| `welcome-email.html`       | Post-registration onboarding        |
| `back-in-stock-email.html` | Wishlisted product restocked        |
| `out-of-stock-email.html`  | Wishlisted product goes to zero     |

**The wishlist-stock integration is particularly elegant:** when a vendor updates product variants, the system compares old vs. new total stock. If it crosses the zero boundary in either direction, it finds every user who has wishlisted that product and fires the appropriate email — all via `Promise.allSettled` for fault tolerance.

---

## 📁 Project Structure

```
backend/
├── config/
│   ├── db.js                    # MongoDB Atlas connection
│   └── cloudinary.js            # Cloudinary SDK configuration
├── controllers/
│   ├── authControllers.js       # Signup, login, OTP, password reset
│   ├── product.controller.js    # Full product lifecycle + category grouping
│   ├── order.controller.js      # Order creation, status management
│   ├── payment.controller.js    # Cashfree session + verification
│   ├── webhook.controller.js    # Payment webhook with HMAC validation
│   ├── cart.controller.js       # Cart CRUD with price-at-time snapshots
│   ├── category.controller.js   # Hierarchical category management
│   ├── address.controller.js    # Multi-address with default management
│   ├── vendor.controller.js     # Store profile & settings
│   ├── notification.controller.js
│   ├── wishlist.controller.js
│   ├── userController.js
│   └── upload.controller.js
├── middleware/
│   ├── auth.middleware.js       # JWT verification + role-based access
│   └── upload.middleware.js     # Multer → Cloudinary pipeline
├── models/                      # 11 Mongoose schemas
├── routes/                      # 13 route modules
├── services/
│   ├── cashfree.service.js      # Cashfree API integration
│   ├── payment.service.js       # Order + payment orchestration
│   ├── notification.service.js  # Email template engine + wishlist alerts
│   └── order.service.js         # (reserved for future extraction)
├── templates/
│   └── emails/                  # 4 production HTML email templates
├── utils/
│   ├── generateOTP.js           # 6-digit OTP generator
│   └── sendEmail.js             # Nodemailer transport
├── server.js                    # App entry point
├── Dockerfile                   # Production container
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.x
- **MongoDB Atlas** cluster (or local MongoDB)
- **Cloudinary** account (free tier works)
- **Cashfree** merchant account (sandbox for development)

### Installation

```bash
# Clone the repository
git clone https://github.com/ritishDas/Tars-ecommerce.git
cd Tars-ecommerce/backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials (see below)

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_key

CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Email (Gmail App Password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret

# Cashfree Payment Gateway
CASHFREE_CLIENT_ID=your_client_id
CASHFREE_CLIENT_SECRET=your_client_secret
CASHFREE_API_VERSION=2025-01-01
CASHFREE_BASE_URL=https://sandbox.cashfree.com/pg
```

### Docker

```bash
# Build the image
docker build -t greenhouse-market-api .

# Run the container
docker run -p 3000:3000 --env-file .env greenhouse-market-api
```

---

## 🧪 API Surface

The API exposes **13 route modules** under the `/api` prefix. Here's a high-level map:

| Module           | Base Path           | Auth               | Description                              |
| ---------------- | ------------------- | ------------------ | ---------------------------------------- |
| **Auth**         | `/api/auth`         | Public / Protected | OTP flow, signup, login, password reset  |
| **User**         | `/api/user`         | Protected          | Profile & address management             |
| **Product**      | `/api/product`      | Public / Vendor    | CRUD, category-based listing             |
| **Category**     | `/api/category`     | Vendor / Public    | Hierarchical tree, slug-based lookup     |
| **Cart**         | `/api/cart`         | Protected          | Add, update, remove, clear               |
| **Wishlist**     | `/api/wishlist`     | Protected          | Toggle products, stock alerts            |
| **Order**        | `/api/order`        | Protected / Vendor | Place, track, manage lifecycle           |
| **Payment**      | `/api/payments`     | Protected          | Cashfree session creation & verification |
| **Webhook**      | `/api/webhooks`     | Public (signed)    | Cashfree payment confirmation            |
| **Address**      | `/api/address`      | Protected          | Multi-address with default selection     |
| **Vendor**       | `/api/vendor`       | Vendor             | Store profile & settings                 |
| **Notification** | `/api/notification` | Protected          | In-app alerts, read/unread management    |
| **Upload**       | `/api/upload`       | Vendor             | Direct image upload to Cloudinary        |

---

## 🧠 Design Decisions Worth Noting

- **Webhook before JSON parser** — The webhook route is deliberately registered _before_ `express.json()` so the raw body is preserved for HMAC signature verification. This is a common pitfall in payment integrations.

- **Price snapshots in cart** — The cart stores `priceAtTime` instead of referencing the current product price. This prevents price changes from silently altering a user's cart total.

- **Counter-based order IDs** — Instead of UUIDs, orders get human-readable sequential IDs (`ORD-000042`) via an atomic MongoDB counter. Better for customer support and vendor dashboards.

- **GeoJSON-ready addresses** — The address model includes a `2dsphere`-indexed `location` field with `[lng, lat]` coordinates — ready for proximity-based features like delivery radius filtering.

- **Soft-delete pattern for categories** — Categories linked to products cannot be deleted (integrity check). Categories can be deactivated via `isActive: false` instead.

- **Emoji fallback for categories** — If no image is uploaded for a category, the frontend can fall back to a stored emoji — a pragmatic UX decision for quick vendor onboarding.

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">
  <br />
  <strong>Built with 🧃 and relentless iteration.</strong>
  <br />
  <sub>Part of the TARS ecosystem.</sub>
</div>
