<div align="center">

<br />

# 🌿 GreenHouse Market

### A Grocery Shopping Experience — Reimagined.

Fresh produce. Seamless checkout. Beautiful UI.

<br />

![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-base--nova-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Cashfree](https://img.shields.io/badge/Payments-Cashfree-6C3CE1?style=for-the-badge)

<br />

</div>

---

<br />

## ✨ The Feel

GreenHouse Market isn't just a storefront — it's a **mobile-first grocery experience** that feels like a native app. The kind of interface where a customer pulls out their phone, browses by category, adds a 1 kg bag of organic rice to cart, picks a delivery address, and checks out with UPI — all within a minute.

The vendor? They log in to a completely different world — a **full-featured dashboard** with order management, inventory tracking, analytics charts, and real-time notification panels. Same codebase. Two entirely separate experiences.

<br />

---

<br />

## 🎨 Design Philosophy

Every pixel in this project is intentional.

**The color system** is built on `oklch` — the modern perceptual color space — producing greens that feel organic and warm instead of harsh neon. The entire palette cascades from a single `--primary` token through the shadcn/ui design system, and ships with a complete **dark mode** variant.

**Typography** uses [Nunito](https://fonts.google.com/specimen/Nunito) — a rounded, friendly sans-serif that's warm enough for a grocery brand yet crisp at every size. [Geist Variable](https://vercel.com/font) serves as the system fallback.

**Responsive behavior** is not an afterthought — it's the primary design target. The navbar renders completely different layouts for desktop and mobile. The sidebar slides in on touch devices. Product grids adapt from 2-column on phones to fluid auto-fill on wider screens. All powered by a custom `useDeviceType` hook that listens to `matchMedia` events for zero-layout-shift transitions.

<br />

---

<br />

## 🏛️ Architecture at a Glance

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   AuthContext (login · signup · token · profile)          │
│       ↓                                                  │
│   Redux Store ─────────────────────────────────────────  │
│   ┌──────────┬──────────┬──────────┬──────────┬────────┐ │
│   │ Product  │   Cart   │ Address  │  Order   │Wishlist│ │
│   │  Slice   │  Slice   │  Slice   │  Slice   │ Slice  │ │
│   └────┬─────┴────┬─────┴────┬─────┴────┬─────┴────┬───┘ │
│        │          │          │          │          │      │
│        └──────────┴──────────┴──────────┴──────────┘      │
│                         ↕                                │
│              Axios Instance (JWT interceptor)             │
│                         ↕                                │
│                   Express API @ :3000                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

The state architecture is deliberately **hybrid**:

- **Auth** lives in `React.Context` — because it's a cross-cutting concern that needs to exist outside the store lifecycle (token hydration on page load, logout without dispatch)
- **Everything else** — products, cart, addresses, orders, payments, wishlist — lives in **Redux Toolkit** with `createAsyncThunk` for clean async flows
- The Axios instance auto-injects the JWT from localStorage on every request via an interceptor — no manual token passing

<br />

---

<br />

## 🛍️ The Customer Experience

The customer-facing app is designed like the best Indian grocery apps you've used — think BigBasket, Blinkit, or Zepto — but built from scratch.

### Home

A hero banner carousel (powered by **Swiper.js** with pagination and navigation) sits above a product grid. Products are organized by category with a sticky sidebar filter on desktop that lets users drill into the category tree without leaving the page.

### Product Cards

Each card is a dense, information-rich tile: thumbnail, category tag, brand, rating (custom skewed-bar stars), discount badge, variant label, and an inline "Add" button. The **wishlist heart** is a one-tap toggle that dispatches optimistic Redux updates.

### Product Detail

A full detail page with image gallery, all available variants with independent pricing, add-to-cart with variant selection, stock-aware quantity controls, and product metadata (packaging, ingredients, warnings).

### Cart & Checkout

The cart page is a self-contained checkout flow:

| Step            | What Happens                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Items**       | Each cart item shows variant, price-at-time, quantity controls                                                                 |
| **Address**     | Default delivery address pulled from Redux, with change option                                                                 |
| **Bill**        | Real-time subtotal, delivery fee, platform fee breakdown                                                                       |
| **Payment**     | Toggle between COD and Online (UPI/Card via Cashfree)                                                                          |
| **Place Order** | Single action — COD creates the order directly, UPI opens Cashfree's hosted checkout and redirects back to a verification page |

The entire checkout logic is extracted into a single `useCheckout` hook — a custom hook that composes cart state, address state, order dispatch, payment session creation, and Cashfree SDK loading into one clean API.

### Payment Flow

For online payments, the Cashfree SDK is **lazy-loaded** — the script tag is injected into the DOM only when the user clicks "Pay Online", and cached for subsequent calls. After checkout, the user lands on `/payment-status` where the app polls the backend for payment confirmation.

<br />

---

<br />

## 📊 The Vendor Dashboard

When a user with `role: "vendor"` logs in, they're redirected to an entirely separate application shell — a **collapsible sidebar layout** with a topbar, notification panel, and 9 feature-rich pages:

| Page             | Capabilities                                                                 |
| ---------------- | ---------------------------------------------------------------------------- |
| **Dashboard**    | Revenue charts (Recharts), order trends, stat cards with trend indicators    |
| **Orders**       | Full order list with status badges, filtering, detail modals, status updates |
| **Products**     | Product table with search, bulk actions, add/edit with multi-image upload    |
| **Inventory**    | Variant-level stock view, low-stock alerts                                   |
| **Categories**   | Hierarchical CRUD with parent-child relationships, emoji fallback            |
| **Transactions** | Payment history with gateway details                                         |
| **Settings**     | Store profile, notification preferences, GST info, delivery radius config    |

The sidebar is responsive — it collapses to icons on desktop when toggled, and slides out as an overlay on mobile with a backdrop blur. Active routes get a `green-600` highlight with a shadow accent, giving it that native app feel.

The vendor topbar includes a **notification bell** with unread count badge and a slide-out notification panel with detail modals for each alert (new orders, low stock, payment confirmations).

<br />

---

<br />

## 🧩 Component Design

The component tree follows a **domain-driven** structure, not a flat dump of files:

```
components/
├── auth/          → AuthLayout, OTPInput, OTPVerificationModal
├── common/        → ImageSlider, CategoryCard, BackHeader, Tags
├── customer/
│   ├── Account/   → Overview, Settings, Address, MyOrders
│   ├── Address/   → Multi-address manager with default selection
│   ├── cart/      → CartItemCard, BillDetails, PaymentMethod
│   ├── order/     → OrderDetailsPage with status timeline
│   ├── payment/   → PaymentStatusPage (Cashfree verification)
│   ├── Category/  → BrowseCategory, CategoryAside (sidebar filter)
│   └── ProductDetails/ → Image, Info, Variants, AddToCart (decomposed)
├── home/sections/ → PopularProduct, DealsOfDay, ShopByCategory, CTA
├── layout/        → Navbar, Footer, Sidebar, Topbar, Navigation
├── product/       → ProductCard, ProductCardHorizontal, SearchProduct
├── Vendor/dashboard/ → Layout, Sidebar, Topbar, StatCard, StatusBadge
└── ui/            → shadcn/ui primitives (Button, Input, Card, Dialog...)
```

**Key pattern:** The product detail page is **decomposed** into 8 sibling components (`ProductImage`, `ProductInfo`, `ProductVariants`, `AddToCart`, etc.) that compose into a layout — rather than one monolithic 500-line file. This makes each piece testable and swappable.

<br />

---

<br />

## ⚡ Optimistic Updates

The cart uses an **optimistic update + rollback** pattern:

1. User taps "Add to Cart"
2. Redux immediately applies `optimisticAdd` — the UI updates instantly
3. An async thunk fires the API call in the background
4. On success → the real server data replaces the optimistic state
5. On failure → `rollback` restores `prevState` (a deep-cloned snapshot)

This gives the app a **zero-latency feel** for cart operations — even on slow networks. The pattern is implemented through Redux Toolkit's `addMatcher` — a single matcher catches all `cart/*/rejected` actions and rolls back automatically.

<br />

---

<br />

## 🔐 Auth & Route Protection

Three route guard components enforce access control at the router level:

| Guard            | Who it blocks           | Where it redirects |
| ---------------- | ----------------------- | ------------------ |
| `ProtectedRoute` | Unauthenticated users   | → `/login`         |
| `PublicRoute`    | Authenticated users     | → `/home`          |
| `VendorRoute`    | Non-vendors (customers) | → `/home`          |

The root `/` route uses a `RootRedirect` component that inspects `user.role` and sends vendors to `/vendor` and customers to `/home` — so the app automatically adapts its landing page based on who's logged in.

Auth itself uses an **OTP-first registration flow** — a 6-digit OTP input component with auto-focus, paste support, and backspace navigation, triggered via a verification modal before the signup form is submitted.

<br />

---

<br />

## 🛠 Tech Stack

| Layer         | Choice                                  | Rationale                                        |
| ------------- | --------------------------------------- | ------------------------------------------------ |
| **Framework** | React 19 + Vite 8                       | Fastest HMR, native ESM, future-ready            |
| **Styling**   | Tailwind CSS v4 + shadcn/ui (base-nova) | Utility-first with a polished component library  |
| **State**     | Redux Toolkit + React Context           | RTK for domain state, Context for auth lifecycle |
| **Routing**   | React Router v7                         | File-path based navigation, nested vendor routes |
| **HTTP**      | Axios + interceptors                    | Centralized auth header injection                |
| **Charts**    | Recharts                                | Lightweight, composable dashboard visualizations |
| **Carousel**  | Swiper.js                               | Touch-native, performant image sliders           |
| **Payments**  | Cashfree JS SDK (lazy-loaded)           | UPI, cards, netbanking — Indian payment stack    |
| **Icons**     | Lucide React                            | Consistent, tree-shakeable icon set              |
| **Toasts**    | React Hot Toast                         | Minimal, non-intrusive notifications             |
| **Fonts**     | Nunito + Geist Variable                 | Warm brand typography + system fallback          |

<br />

---

<br />

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/ritishDas/Tars-ecommerce.git
cd Tars-ecommerce/frontend

# Install
npm install

# Run
npm run dev
```

The dev server starts at `http://localhost:5173` and binds to `0.0.0.0` for LAN access — handy for testing on a phone while developing.

> **Note:** The backend must be running at `http://localhost:3000` for API calls to work. See the [backend README](../backend/README.md) for setup instructions.

<br />

---

<br />

## 📁 Project Structure

```
frontend/
├── public/                  → Static assets (favicon, icons)
├── src/
│   ├── api/                 → Axios instance + API modules (OTP, payment, wishlist)
│   ├── assets/              → Banners, hero images
│   ├── components/          → Domain-organized component tree (see above)
│   ├── context/             → AuthContext (login, signup, logout, profile)
│   ├── hooks/               → useAuth, useCheckout
│   ├── lib/                 → useDeviceType, shadcn utils
│   ├── pages/               → Route-level page components
│   ├── redux/slices/        → 6 feature slices (product, cart, address, order, payment, wishlist)
│   ├── routes/              → ProtectedRoute, PublicRoute, VendorRoute
│   ├── utils/               → Token helpers, Cashfree SDK loader
│   ├── App.jsx              → Route definitions
│   ├── main.jsx             → Provider composition (Redux + Router + Auth + Toast)
│   └── index.css            → oklch design tokens, Swiper overrides, scrollbar utilities
├── components.json          → shadcn/ui configuration
├── vite.config.js           → Tailwind plugin, path aliases, LAN server
└── package.json
```

<br />

---

<br />

<div align="center">

**Built for real users. Designed like a product. Engineered like a system.**

<sub>Part of the TARS ecosystem · GreenHouse Market</sub>

</div>
