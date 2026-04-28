# USER PROJECT PLAN

# 🛒 ECOMMERCE PLATFORM — MASTER BUILD PROMPT

**Document Type:** LLM-Ready System Prompt + Phased Build Plan  
**Version:** 2.0 (amended — edge cases, payment flows, password policy, framework note, dummy payment mode)  
**Author:** Aman T Shekar (via Claude)  
**Purpose:** Complete specification for building a production-grade, modular, secure e-commerce platform inspired by Flipkart and Amazon — minimal, modern, professional UI.

---

## ═══════════════════════════════════════

## SECTION 0 — HOW TO READ THIS DOCUMENT

## ═══════════════════════════════════════

This document is structured as a **master prompt** — meaning it is meant to be fed to an LLM (or a developer team) as a complete, unambiguous build specification. Each section is self-contained and labeled. Follow phases in order. Do not skip phases. Security guidelines embedded in each phase must be implemented **at the time of that phase**, not deferred.

**Terminology used throughout:**

- `[REQUIRED]` = Must be implemented before moving to next phase
- `[RECOMMENDED]` = Should be implemented; skip only with documented reason
- `[FUTURE]` = Defer to post-MVP but keep architecture compatible
- `[SECURITY]` = A security control — treat as REQUIRED unless explicitly marked otherwise

---

## ═══════════════════════════════════════

## SECTION 1 — PROJECT IDENTITY

## ═══════════════════════════════════════

**Project Name:** `NEXMART`  
**Tagline:** Shop faster. Shop smarter.  
**Type:** Full-stack E-commerce Web Application  
**Inspiration:** Flipkart (UI density, mobile-first, product discovery), Amazon (trust signals, review depth, seller ecosystem)  
**Design Philosophy:** Minimalist-Modern. Clean grid. High information density without clutter. White + accent blue/orange palette. Purposeful animations only.

**Target Users:**

1. **Shoppers (Buyers)** — Browse, search, buy, track, review
2. **Sellers** — List products, manage inventory, view analytics
3. **Admins** — Moderate listings, manage users, view platform metrics

---

## ═══════════════════════════════════════

## SECTION 2 — TECH STACK DECISION

## ═══════════════════════════════════════

### 2.1 Frontend Framework Selection

**Context:** As of 2025–2026, the frontend ecosystem has shifted. Here is an honest comparison:

| Framework          | Status         | Notes                                                                                                                  |
| ------------------ | -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Next.js**        | ⚠️ Turbulent   | React Server Components instability, App Router breaking changes, Vercel lock-in concerns raised by community          |
| **Vite + React**   | ✅ Very Strong | Fast DX, excellent ecosystem, SSR via React Router v7 or manual SSR adapter — very valid choice for e-commerce in 2026 |
| **Remix**          | ✅ Rising      | Full-stack, SSR-first, built on Web standards, React-based, acquired by Shopify — strong choice                        |
| **Astro**          | ✅ SSG/SSR     | Best for content sites; less suited for highly dynamic e-commerce interactions                                         |
| **TanStack Start** | 🔵 Emerging    | Router-first, RSC-compatible, type-safe — very promising but young                                                     |
| **SvelteKit**      | ✅ Excellent   | Fastest runtime, smaller bundle, SSR native — non-React, steeper curve if React-only team                              |

**DECISION: Use `vite + react` for Frontend**

- SSR out of the box → SEO-ready product pages
- Web-standard forms → progressive enhancement
- No RSC complexity
- Nested routing fits e-commerce (category → subcategory → product)
- TypeScript-first

> **LLM NOTE:** Both `vite + react` and `Vite + React + React Router v7` are equally valid for this project. React Router v7 IS vite + react under the hood — same APIs, same SSR capability. Vite's build performance and ecosystem maturity (2026) make it a strong alternative. If the developer is more comfortable with Vite, use it — there is no meaningful architectural difference for this use case. The document uses "vite + react" as shorthand for both from here forward.

### 2.2 Backend Framework Selection

**Decision: `FastAPI` (Python)**

- Async-first, OpenAPI auto-docs
- Easy integration with ML features (recommendations, search ranking)
- Pydantic v2 for strict input validation
- Production-proven, fast

### 2.3 Full Stack Overview

```
NEXMART/
├── frontend/          # vite react (TypeScript)
├── backend/           # FastAPI (Python 3.12+)
├── shared/            # Shared types (if using monorepo)
├── infrastructure/    # Docker, nginx, env configs
└── docs/              # This document and ADRs
```

### 2.4 Supporting Infrastructure

| Layer              | Technology                                    |
| ------------------ | --------------------------------------------- |
| Database (primary) | PostgreSQL 16                                 |
| Cache              | Redis 7                                       |
| Search             | Meilisearch (self-hosted) or Typesense        |
| File Storage       | S3-compatible (MinIO locally, AWS S3 in prod) |
| Auth               | JWT (access + refresh tokens) + bcrypt        |
| Email              | Resend or AWS SES                             |
| Payment            | Razorpay (India) / Stripe (International)     |
| Container          | Docker + Docker Compose                       |
| Reverse Proxy      | Nginx                                         |
| Process Manager    | Gunicorn + Uvicorn workers                    |

---

## ═══════════════════════════════════════

## SECTION 3 — FEATURE SPECIFICATION

## ═══════════════════════════════════════

### 3.1 Buyer Features

| Feature                                 | Priority | Notes                       |
| --------------------------------------- | -------- | --------------------------- |
| Home page with hero banner + deals      | P0       |                             |
| Product search with autocomplete        | P0       | Meilisearch-powered         |
| Filters: price, rating, brand, category | P0       |                             |
| Sort: relevance, price, newest, rating  | P0       |                             |
| Product detail page (PDP)               | P0       | Images, specs, reviews, Q&A |
| Cart (persistent, syncs on login)       | P0       |                             |
| Checkout: address → payment → confirm   | P0       |                             |
| Order tracking                          | P0       |                             |
| User account: profile, addresses        | P0       |                             |
| Wishlist                                | P1       |                             |
| Product reviews + ratings (with images) | P1       |                             |
| Q&A on product page                     | P1       |                             |
| Recently viewed products                | P1       |                             |
| Recommended products (basic algo)       | P1       |                             |
| Order history + invoice download        | P1       |                             |
| Return / refund request                 | P1       |                             |
| Coupon / promo code                     | P2       |                             |
| Wallet / store credit                   | P2       |                             |
| Notifications (email + in-app)          | P2       |                             |
| Product comparison                      | P2       |                             |

### 3.2 Seller Features

| Feature                               | Priority |
| ------------------------------------- | -------- |
| Seller registration + KYC             | P0       |
| Product listing (add/edit/delete)     | P0       |
| Inventory management                  | P0       |
| Order management (accept/reject/ship) | P0       |
| Earnings dashboard                    | P1       |
| Bulk product upload (CSV)             | P1       |
| Promotions / discount setup           | P2       |

### 3.3 Admin Features

| Feature                           | Priority |
| --------------------------------- | -------- |
| User management (ban/unban/roles) | P0       |
| Seller approval workflow          | P0       |
| Product moderation                | P0       |
| Platform analytics dashboard      | P1       |
| Category management               | P0       |
| Coupon management                 | P2       |
| Refund approval                   | P1       |

---

## ═══════════════════════════════════════

## SECTION 4 — UI DESIGN SPECIFICATION

## ═══════════════════════════════════════

### 4.1 Design Principles

1. **Minimalist-Modern** — No decoration for decoration's sake
2. **Information-Dense** — Like Flipkart: more visible content per scroll
3. **Consistent Spacing** — 4px base grid, multiples of 4
4. **Trust Signals** — Ratings, delivery date, seller name always visible
5. **Mobile-First** — All layouts designed for 375px, enhanced for desktop

### 4.2 Color Palette (CSS Variables)

```css
:root {
  /* Brand - Studio Obsidian */
  --color-primary: #000000;
  --color-accent: #3b82f6; /* Electric Blue */
  --color-bg: #f5f5f5; /* Light Grey Background */
  --color-surface: #ffffff;
  --color-border: #e5e5e5;
  
  /* Text */
  --color-text-primary: #000000;
  --color-text-secondary: #555555;
  --color-text-muted: #999999;
  
  /* Obsidian Theme (Dark Elements) */
  --color-obsidian: #000000;
  --color-obsidian-light: #1a1a1a;

  /* Typography */
  --font-sans: "Inter", sans-serif;
  --font-display: "Outfit", sans-serif;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-4: 16px;
  --space-8: 32px;
  --space-12: 48px;
  --space-24: 96px;
  --space-32: 128px;

  /* Shadows */
  --shadow-card: 0 1px 4px rgba(0, 0, 0, 0.12);
  --shadow-dropdown: 0 4px 16px rgba(0, 0, 0, 0.14);
}
```

### 4.3 Component Library Structure (Frontend)

```
frontend/
└── app/
    ├── components/
    │   ├── ui/              # Atoms: Button, Input, Badge, Spinner, Modal
    │   ├── product/         # ProductCard, ProductGallery, RatingStars, PriceDisplay
    │   ├── cart/            # CartItem, CartSummary, CartDrawer
    │   ├── search/          # SearchBar, SearchSuggestions, FilterPanel
    │   ├── layout/          # Navbar, Footer, Sidebar, MegaMenu
    │   ├── checkout/        # AddressForm, PaymentForm, OrderSummary
    │   └── shared/          # Breadcrumb, Pagination, EmptyState, ErrorBoundary
    ├── routes/              # vite + react file-based routing
    ├── lib/                 # API client, auth helpers, utils
    ├── hooks/               # useCart, useWishlist, useAuth, useSearch
    ├── store/               # Zustand global state (cart, user, ui)
    └── styles/              # global.css, tokens.css
```

**Rules for Components:**

- Each component lives in exactly ONE file
- No component duplicated across folders
- Props fully typed with TypeScript interfaces
- No hardcoded colors — only CSS variables
- No dead props, no unused imports

### 4.4 Key Pages

| Route               | Page            | Notes                                   |
| ------------------- | --------------- | --------------------------------------- |
| `/`                 | Home            | Hero, deals, categories, trending       |
| `/search?q=`        | Search Results  | Filter sidebar + product grid           |
| `/product/:id`      | Product Detail  | Gallery, specs, seller info, reviews    |
| `/cart`             | Cart            | Line items + order summary              |
| `/checkout`         | Checkout        | Multi-step: Address → Payment → Confirm |
| `/orders`           | My Orders       | List with status badges                 |
| `/orders/:id`       | Order Detail    | Tracking + invoice                      |
| `/account`          | Account         | Profile, addresses, preferences         |
| `/wishlist`         | Wishlist        | Saved products                          |
| `/seller/dashboard` | Seller Home     | Stats, recent orders                    |
| `/seller/products`  | Manage Products | CRUD listing                            |
| `/admin`            | Admin Dashboard | Platform overview                       |

---

## ═══════════════════════════════════════

## SECTION 5 — BACKEND ARCHITECTURE

## ═══════════════════════════════════════

### 5.1 Directory Structure

```
backend/
├── main.py                 # FastAPI app entry point
├── core/
│   ├── config.py           # Settings from env (pydantic-settings)
│   ├── security.py         # JWT, hashing, token utils
│   ├── database.py         # SQLAlchemy engine + session
│   └── dependencies.py     # get_db, get_current_user, require_role
├── models/                 # SQLAlchemy ORM models (one file per domain)
│   ├── user.py
│   ├── product.py
│   ├── order.py
│   ├── cart.py
│   ├── review.py
│   └── seller.py
├── schemas/                # Pydantic schemas (request/response)
│   ├── user.py
│   ├── product.py
│   ├── order.py
│   └── ...
├── routers/                # API route handlers
│   ├── auth.py
│   ├── users.py
│   ├── products.py
│   ├── cart.py
│   ├── orders.py
│   ├── reviews.py
│   ├── sellers.py
│   └── admin.py
├── services/               # Business logic (no DB calls directly in routers)
│   ├── auth_service.py
│   ├── product_service.py
│   ├── order_service.py
│   ├── payment_service.py
│   └── search_service.py
├── utils/
│   ├── email.py
│   ├── storage.py          # S3 upload helpers
│   └── pagination.py
└── tests/
    ├── unit/
    └── integration/
```

**Rules:**

- Routers call Services. Services call Models. Never skip layers.
- No business logic in routers. No DB queries in routers.
- Every endpoint has a typed Pydantic response schema.
- No unused imports in any file.

### 5.2 Database Schema (Key Tables)

```sql
-- Users
users: id, email, hashed_password, full_name, phone, role (buyer/seller/admin),
       is_active, is_verified, created_at, updated_at

-- Addresses
addresses: id, user_id, label, street, city, state, pincode, country, is_default

-- Products
products: id, seller_id, title, description, price, mrp, stock, category_id,
          brand, status (active/inactive/pending), created_at

-- Product Images
product_images: id, product_id, url, is_primary, display_order

-- Categories
categories: id, name, slug, parent_id, icon_url

-- Cart
carts: id, user_id (unique)
cart_items: id, cart_id, product_id, quantity, added_at

-- Orders
orders: id, user_id, address_id, total, status, payment_status,
        payment_id, created_at
order_items: id, order_id, product_id, seller_id, quantity, unit_price, status

-- Reviews
reviews: id, user_id, product_id, order_id, rating, title, body,
         image_urls, is_verified_purchase, created_at

-- Wishlists
wishlist_items: id, user_id, product_id, added_at
```

---

## ═══════════════════════════════════════

## SECTION 6 — PHASE 1: FRONTEND BUILD

## ═══════════════════════════════════════

**Goal:** Deliver a complete, production-grade UI with all buyer-facing pages. No backend yet — use mock data / JSON stubs.

**Duration Estimate:** 2–3 weeks (solo developer)

### Phase 1 Deliverables

- [x] Project scaffold: `npx create-vite + react@latest` (COMPLETE)
- [x] Global styles, CSS variables, DM Sans + Syne fonts via Google Fonts (COMPLETE)
- [x] Component library: all `ui/` atoms built and documented (COMPLETE)
- [x] Navbar with search, cart icon, user menu (COMPLETE)
- [x] Home page: banner carousel, category grid, deal cards (COMPLETE)
- [x] Search results page: filter sidebar, sort, product grid, pagination (COMPLETE)
- [x] Product detail page: image gallery, tabs, reviews section (COMPLETE)
- [x] Cart page + cart drawer (slide-in from right) (COMPLETE)
- [x] Checkout flow: 3-step form (COMPLETE)
- [x] Account pages: profile, orders, wishlist (COMPLETE)
- [x] Seller dashboard (static layout) (COMPLETE)
- [x] Mobile responsiveness: all pages at 375px, 768px, 1280px (COMPLETE)
- [x] Phase 1 Finale: Mobile Menu Drawer & Empty States (COMPLETE)
- [x] Modern Intrinsic Design Overhaul: Fluid typography, Container Queries, Liquid Layouts (COMPLETE)
- [x] Security: All Phase 1 Security Guidelines implemented (COMPLETE)

### Phase 1 — Security Guidelines `[SECURITY]`

These are frontend security controls to implement **during** Phase 1, not after:

| Control                        | Implementation                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| **XSS Prevention**             | Never use `dangerouslySetInnerHTML`. Sanitize all user-generated content with `DOMPurify` before render |
| **Content Security Policy**    | Set CSP headers in Nginx: disallow inline scripts, restrict script-src to self + CDN                    |
| **No secrets in client**       | API keys, env secrets NEVER in `VITE_*` or client-accessible env vars                                   |
| **Secure external links**      | All `<a target="_blank">` must have `rel="noopener noreferrer"`                                         |
| **Input validation**           | All forms validated client-side with `zod` before submission                                            |
| **HTTPS only**                 | Enforce HTTPS redirect at Nginx level. No mixed content                                                 |
| **No localStorage for tokens** | Auth tokens stored in `httpOnly` cookies only — never localStorage or sessionStorage                    |
| **Dependency audit**           | Run `npm audit` before finalizing package.json. No known critical CVEs                                  |
| **Error messages**             | Never expose stack traces or internal paths in UI error messages                                        |
| **Clickjacking**               | Set `X-Frame-Options: DENY` in Nginx headers                                                            |

---

## ═══════════════════════════════════════

## SECTION 7 — PHASE 2: BACKEND BUILD

## ═══════════════════════════════════════

**Goal:** Deliver a complete, secure REST API. Connect frontend to real data.

**Duration Estimate:** 3–4 weeks (solo developer)

### Phase 2 Deliverables

- [ ] FastAPI project scaffold with folder structure from Section 5
- [ ] PostgreSQL setup + SQLAlchemy models + Alembic migrations
- [ ] Auth system: register, login, refresh token, logout
- [ ] User profile API
- [ ] Product CRUD (seller-owned)
- [ ] Category API
- [ ] Search integration (Meilisearch)
- [ ] Cart API (guest + logged-in merge on login)
- [ ] Order creation + status management
- [ ] Payment integration (Razorpay webhook)
- [ ] Review API (verified purchase check)
- [ ] Wishlist API
- [ ] Seller dashboard data API
- [ ] Admin APIs (user management, product moderation)
- [ ] Email notifications (order confirm, shipping update)
- [ ] File upload (product images → S3)
- [ ] Redis caching for: product detail, category tree, home page data

### Phase 2 — Security Guidelines `[SECURITY]`

#### 7.1 Authentication & Session Security

```
[REQUIRED] JWT Access Token: short-lived (15 minutes)
[REQUIRED] JWT Refresh Token: long-lived (7 days), stored in httpOnly cookie
[REQUIRED] Refresh token rotation: issue new refresh token on each refresh
[REQUIRED] Token blacklist on logout: store invalidated JTIs in Redis
[REQUIRED] bcrypt for password hashing: cost factor minimum 12
[REQUIRED] Email verification required before first purchase
[REQUIRED] Password reset via time-limited token (15 min), single-use
[RECOMMENDED] Rate limit login endpoint: 5 attempts per IP per 15 minutes → lockout
[RECOMMENDED] Account lockout after 10 failed attempts → email alert to user
[SECURITY] Never log passwords, tokens, or payment data anywhere
```

#### 7.2 Authorization (Role-Based Access Control)

```
Roles: buyer | seller | admin
[REQUIRED] Every protected endpoint has a role dependency check
[REQUIRED] Sellers can only modify THEIR OWN products and orders
[REQUIRED] Buyers can only access THEIR OWN orders, addresses, cart
[REQUIRED] Admin endpoints require role=admin + separate admin JWT claim
[REQUIRED] Object-level authorization check on every GET/PATCH/DELETE
           e.g. GET /orders/:id must verify order.user_id == current_user.id
```

#### 7.3 Input Validation & Injection Prevention

```
[REQUIRED] All request bodies validated through Pydantic v2 schemas
[REQUIRED] Use SQLAlchemy ORM parameterized queries — NEVER raw SQL strings with f-strings
[REQUIRED] Strip and validate file uploads: check MIME type server-side (not just extension)
           Allowed: image/jpeg, image/png, image/webp — reject all else
[REQUIRED] Limit file size: max 5MB per image
[REQUIRED] Sanitize product description (rich text) server-side with bleach library
[REQUIRED] Validate and normalize all URL inputs (redirect URLs, image URLs)
[REQUIRED] Reject any input containing null bytes (\x00)
```

#### 7.4 API Rate Limiting

```
[REQUIRED] Implement rate limiting with slowapi (FastAPI) or at Nginx level
Rate limit rules:
  - /auth/login          → 5 req/15min per IP
  - /auth/register       → 3 req/hour per IP
  - /auth/forgot-password → 3 req/hour per email
  - /api/* (general)     → 100 req/min per authenticated user
  - /api/* (unauthenticated) → 30 req/min per IP
[REQUIRED] Return 429 with Retry-After header on limit hit
[RECOMMENDED] Honeypot endpoints to detect scanners
```

#### 7.5 Anti-Phishing & Fraud Controls

```
[REQUIRED] Email sender domain authentication: SPF, DKIM, DMARC configured
[REQUIRED] All outgoing emails link only to your verified domain
[REQUIRED] Order confirmation emails include partial payment info only (last 4 digits)
[REQUIRED] Login from new device/location triggers email alert to user
[RECOMMENDED] Store login IP history per user (last 5 IPs)
[RECOMMENDED] Flag orders where billing address ≠ shipping address + payment country
[RECOMMENDED] Implement CAPTCHA (hCaptcha) on register + login after failed attempts
```

#### 7.6 Payment Security

```
[REQUIRED] NEVER store raw card numbers — use Razorpay/Stripe hosted fields
[REQUIRED] Verify payment webhook signatures using HMAC (provider's secret key)
[REQUIRED] Payment status updated ONLY via verified webhook — never trust client-side confirmation
[REQUIRED] Idempotency keys on all payment API calls
[REQUIRED] Log all payment events to immutable audit log (append-only table)
[REQUIRED] PCI-DSS compliance: do not log any cardholder data
```

#### 7.7 Data Protection & Privacy

```
[REQUIRED] All PII (email, phone, address) encrypted at rest using PostgreSQL pgcrypto
           OR application-level AES-256 encryption
[REQUIRED] Passwords: bcrypt only. No MD5/SHA1/SHA256 for passwords.
[REQUIRED] Database connection: TLS-encrypted (require SSL in pg connection string)
[REQUIRED] Redis connection: TLS + AUTH password
[REQUIRED] S3 bucket: private ACL, pre-signed URLs for product images (expire in 1 hour)
[REQUIRED] No PII in log files. Mask email as u***@domain.com in logs.
[REQUIRED] GDPR/DPDP (India) compliance: user data export endpoint, account deletion endpoint
[REQUIRED] Soft-delete users (is_deleted flag) — do not hard delete for order history integrity
```

#### 7.8 Infrastructure Hardening

```
[REQUIRED] Nginx: disable server_tokens (hides version)
[REQUIRED] HTTP Security Headers (set in Nginx):
    Strict-Transport-Security: max-age=31536000; includeSubDomains
    X-Frame-Options: DENY
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: camera=(), microphone=(), geolocation=()
[REQUIRED] PostgreSQL: disable remote access except from app server IP
[REQUIRED] Redis: bind to localhost only, require AUTH
[REQUIRED] All services run as non-root users inside Docker
[REQUIRED] Docker: no --privileged containers, read-only filesystem where possible
[REQUIRED] Secrets: use Docker secrets or environment variable injection — NEVER commit .env files
[RECOMMENDED] Fail2Ban on SSH
[RECOMMENDED] UFW firewall: only ports 80, 443, 22 open
```

---

## ═══════════════════════════════════════

## SECTION 8 — PHASE 3 (FUTURE): VULNERABILITY & HARDENING

## ═══════════════════════════════════════

**This phase is deferred post-MVP but the architecture must not block it.**

### 8.1 Testing-Driven Security Audit

Run in order after production deployment:

1. **Static Analysis (SAST)**
   - Frontend: `eslint-plugin-security`, `npm audit`
   - Backend: `bandit` (Python), `safety` (dependency CVE check)

2. **Dynamic Analysis (DAST)**
   - OWASP ZAP scan against staging environment
   - Nuclei scanner for common CVEs

3. **Penetration Testing Checklist**
   - OWASP Top 10 (2021) — manually test each
   - Broken Object Level Authorization (BOLA/IDOR) — try accessing other users' orders
   - Mass Assignment — try sending extra fields in registration
   - SQL Injection — fuzz all text inputs
   - File Upload bypass — try uploading .php disguised as .jpg
   - JWT attacks — algorithm confusion (alg:none), expired token reuse
   - CSRF — verify SameSite cookie attribute blocks cross-origin POST
   - Open Redirect — check all redirect= query params

4. **Dependency Monitoring**
   - Set up `Dependabot` or `Renovate` for automated dependency PRs
   - Subscribe to CVE feeds for FastAPI, SQLAlchemy, vite + react

5. **Logging & Anomaly Detection**
   - Centralized logging: all auth events, payment events, admin actions
   - Alert on: >10 failed logins from same IP, unusual order volume from single account, rapid cart additions

---

## ═══════════════════════════════════════

## SECTION 9 — CODE QUALITY RULES

## ═══════════════════════════════════════

These rules apply to EVERY file generated in this project. No exceptions.

### Frontend (TypeScript/vite + react)

```
1. No unused imports — ESLint rule: no-unused-vars
2. No any type — use proper TypeScript interfaces
3. No component defined in more than one place — single source of truth
4. No hardcoded strings in UI (colors, font sizes, spacing) — CSS variables only
5. No dead code — if it's not used by any route or component, delete it
6. Every reusable UI element lives in components/ui/ — not inline in route files
7. Hooks in hooks/ — not defined inside components
8. API calls only through the lib/api.ts client — never raw fetch in components
9. All forms validated with zod schemas — no manual validation logic
10. Loading, error, and empty states implemented for every data-fetching route
```

### Backend (Python/FastAPI)

```
1. Black formatter enforced (line length 88)
2. isort for import ordering
3. No unused imports — flake8 or ruff enforced
4. No print() statements — use Python logging module
5. No business logic in router functions — delegate to services
6. Every endpoint has a response_model declared
7. All config from environment via pydantic-settings — no hardcoded values
8. No raw SQL strings — SQLAlchemy ORM only
9. Every service function has a docstring
10. Tests for every service function (pytest)
```

---

## ═══════════════════════════════════════

## SECTION 10 — LLM INSTRUCTIONS FOR GENERATION

## ═══════════════════════════════════════

> **READ THIS if you are an LLM generating code from this prompt.**

### Absolute Rules

1. **DO NOT generate dead code.** If a function, import, variable, or prop is not used somewhere in the same generation, do not include it.
2. **DO NOT duplicate.** If `Button` is defined in `components/ui/Button.tsx`, it must not be redefined or reimplemented anywhere else. Import it.
3. **DO NOT add placeholder comments like `// TODO: implement`** unless the section is explicitly marked `[FUTURE]` in this document.
4. **DO NOT use `any` in TypeScript.** Define the type or use `unknown` with a type guard.
5. **DO NOT hardcode colors, spacing, or font sizes** outside of `tokens.css` or the CSS variable definitions in Section 4.2.
6. **DO NOT put business logic in route handlers** (backend) or page components (frontend). Delegate to services / hooks.
7. **DO generate complete files**, not partial snippets, unless the instruction says "show only the changed section".
8. **DO follow the folder structure** in Section 4.3 (frontend) and Section 5.1 (backend) exactly.
9. **DO implement security controls marked `[REQUIRED]`** in the same phase they are listed — do not defer them.
10. **DO use the exact CSS variable names** from Section 4.2 — do not invent new ones.

### Phase-by-Phase Generation Order

When generating Phase 1 (Frontend), generate in this order:

1. `styles/tokens.css` — CSS variables
2. `components/ui/` — all atoms
3. `components/layout/Navbar.tsx` and `Footer.tsx`
4. `hooks/` — useCart, useAuth, useSearch
5. `store/` — Zustand stores
6. `lib/api.ts` — API client stub
7. Routes: `/` → `/search` → `/product/:id` → `/cart` → `/checkout` → `/account` → `/orders`

When generating Phase 2 (Backend), generate in this order:

1. `core/config.py` → `core/database.py` → `core/security.py` → `core/dependencies.py`
2. `models/` — all ORM models
3. `schemas/` — all Pydantic schemas
4. `services/` — all service classes
5. `routers/` — all route handlers
6. `main.py` — app assembly
7. `tests/` — unit tests for services

---

## ═══════════════════════════════════════

## SECTION 11 — ENVIRONMENT VARIABLES REFERENCE

## ═══════════════════════════════════════

### Backend `.env` (never commit to git)

```env
# App
APP_ENV=development
SECRET_KEY=<cryptographically-random-64-char-string>
ALLOWED_ORIGINS=http://localhost:3000,https://nexmart.in

# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/nexmart
DB_POOL_SIZE=10

# Redis
REDIS_URL=redis://:password@localhost:6379/0

# JWT
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# S3 / MinIO
S3_ENDPOINT=https://s3.amazonaws.com
S3_BUCKET=nexmart-assets
S3_ACCESS_KEY=<key>
S3_SECRET_KEY=<secret>

# Payment
RAZORPAY_KEY_ID=<key>
RAZORPAY_KEY_SECRET=<secret>
RAZORPAY_WEBHOOK_SECRET=<secret>

# Email
EMAIL_PROVIDER=resend
RESEND_API_KEY=<key>
EMAIL_FROM=noreply@nexmart.in

# Search
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_MASTER_KEY=<key>
```

### Frontend `.env` (only non-secret, public values)

```env
# These are PUBLIC — no secrets here
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Nexmart
VITE_RAZORPAY_KEY_ID=<public-key-only>
```

---

## ═══════════════════════════════════════

## SECTION 12 — GLOSSARY

## ═══════════════════════════════════════

| Term    | Meaning                                                         |
| ------- | --------------------------------------------------------------- |
| PDP     | Product Detail Page                                             |
| PLP     | Product Listing Page (search/category results)                  |
| BOLA    | Broken Object-Level Authorization (accessing other users' data) |
| IDOR    | Insecure Direct Object Reference (same as BOLA)                 |
| JTI     | JWT ID — unique identifier per token used for blacklisting      |
| CSP     | Content Security Policy                                         |
| DAST    | Dynamic Application Security Testing                            |
| SAST    | Static Application Security Testing                             |
| PCI-DSS | Payment Card Industry Data Security Standard                    |
| DPDP    | Digital Personal Data Protection Act (India, 2023)              |
| MRP     | Maximum Retail Price (Indian e-commerce term)                   |
| ISR     | Incremental Static Regeneration                                 |
| RSC     | React Server Components                                         |

---

---

## ═══════════════════════════════════════

## SECTION 13 — PAYMENT FLOWS (COMPLETE)

## ═══════════════════════════════════════

This section defines every payment scenario the system must handle — including happy path, failure paths, edge cases, and the development dummy mode. Every scenario listed here must have a corresponding backend service handler and a frontend UI state.

### 13.1 Payment Providers

The system supports two providers, selectable per region or per admin config:

| Provider           | Region                       | Mode                                            |
| ------------------ | ---------------------------- | ----------------------------------------------- |
| **Razorpay**       | India (INR)                  | Live + Test mode (test key prefix: `rzp_test_`) |
| **Stripe**         | International (USD/EUR etc.) | Live + Test mode (test key prefix: `sk_test_`)  |
| **Dummy Provider** | Development only             | Simulated locally, no external call             |

Active provider is determined by `PAYMENT_PROVIDER` env var (`razorpay` / `stripe` / `dummy`). The frontend and backend must both respect this. UI shows a "Test Mode" banner when env is not production.

---

### 13.2 Dummy Payment Mode (Development)

**Purpose:** Allow full checkout flow testing without a Razorpay/Stripe account or real card.

**How it works:**

Backend `payment_service.py` checks `PAYMENT_PROVIDER=dummy`. If dummy:

- `create_order()` returns a fake `order_id` like `dummy_ord_<uuid4>`
- `verify_payment()` accepts a special test payload and always returns success
- No external HTTP call is made

Frontend shows a special "Dummy Payment UI" panel with:

- A dropdown: `Simulate: Success | Failure | Timeout | Partial`
- A "Pay Now (Simulated)" button
- After clicking, it calls the backend's `/payments/dummy-complete` endpoint with the chosen scenario

```
ENV: PAYMENT_PROVIDER=dummy
     DUMMY_PAYMENT_DELAY_MS=1500   # simulate network latency
```

**Dummy test card values displayed in UI (dev mode only):**

```
Success:  Card 4111 1111 1111 1111 | Any future expiry | CVV 123
Failure:  Card 4000 0000 0000 0002
Timeout:  Card 4000 0000 0000 9995
```

> Both Razorpay and Stripe provide official test card numbers in their dashboards — use those in test mode. Dummy mode is for zero-dependency local dev only.

---

### 13.3 Payment State Machine

Every order's payment goes through these states. This is the canonical state machine — no other states are valid:

```
PENDING → INITIATED → SUCCESS
                    ↘ FAILED → [retry allowed]
                    ↘ TIMEOUT → [retry allowed]
         ↘ CANCELLED (user aborted before initiation)

SUCCESS → REFUND_REQUESTED → REFUNDED
                           ↘ REFUND_FAILED
```

Store `payment_status` on the `orders` table. Transitions are only allowed in the direction shown. A `SUCCESS` order can never go back to `PENDING`.

---

### 13.4 Happy Path Flow

```
1. User clicks "Place Order"
2. Frontend calls POST /orders/initiate
   → Backend validates cart, stock, address
   → Backend creates order in DB with status=PENDING, payment_status=PENDING
   → Backend calls Razorpay/Stripe to create a payment intent
   → Returns: { order_id, payment_intent_id, amount, currency, provider_key }
3. Frontend opens Razorpay/Stripe payment modal with those values
4. User completes payment in modal
5. Provider calls our POST /payments/webhook (server-to-server)
   → Backend verifies webhook signature (HMAC)
   → Backend sets order payment_status=SUCCESS
   → Backend decrements product stock (only here, not at step 2)
   → Backend sends order confirmation email
   → Backend clears user's cart
6. Frontend polls GET /orders/:id or receives WebSocket push
7. Frontend shows Order Confirmed page
```

---

### 13.5 Payment Failure Scenarios & Handlers

#### Scenario A — User Cancels Payment Modal

```
Trigger: User closes Razorpay/Stripe modal without paying
Frontend: Shows "Payment Cancelled" toast. Keeps order in cart-like state.
Backend: Order stays PENDING. No stock change.
Stock: NOT decremented. Product remains available.
Retry: User can retry payment from Order History → "Retry Payment" button.
Timeout: If PENDING for >30 minutes with no webhook, a cron job marks it CANCELLED and releases any held stock (though stock was never held — see concurrent race section).
```

#### Scenario B — Payment Gateway Returns Failure

```
Trigger: Card declined, insufficient funds, bank rejection
Webhook: Provider sends failure event to /payments/webhook
Backend: Sets payment_status=FAILED. Order stays in DB for audit.
Frontend: Redirected to /checkout/failed?order_id=xxx
         Shows reason (masked): "Payment declined by your bank"
         CTA: "Try a Different Payment Method" → re-opens checkout modal with same order_id
Stock: NOT decremented. Still available.
Retry limit: Max 3 payment attempts per order_id. After 3, order is marked CANCELLED.
```

#### Scenario C — Payment Gateway Timeout / Network Error

```
Trigger: Provider API times out, user's internet drops during payment
Backend: POST /payments/webhook never arrives within 15 minutes
Cron job: Runs every 5 minutes. Queries provider API for status of INITIATED orders older than 10 min.
  → If provider says success: process as success
  → If provider says failed/cancelled: mark FAILED
  → If provider still pending: extend wait, alert after 30 min
Frontend: Shows "Payment Processing" spinner. Auto-refreshes every 10 seconds.
          If still unresolved after 5 minutes: shows "Contact Support" with order_id
```

#### Scenario D — Webhook Arrives But Order Not Found

```
Trigger: Race condition or duplicate webhook delivery
Backend: If payment_id already exists in DB with status SUCCESS → return 200 (idempotent, ignore)
         If order_id not found → log error, return 200 (never return 4xx to payment webhooks — provider retries on non-200)
         If order_id found but payment_id mismatch → alert admin, mark for manual review
```

#### Scenario E — Double Webhook Delivery

```
Trigger: Razorpay/Stripe retries webhook on network failure
Backend: Use payment_id as idempotency key
         Before processing: check Redis for key `processed_payment:{payment_id}`
         If key exists → return 200 immediately, skip processing
         If key not exists → process, then SET key with 24h TTL
```

#### Scenario F — Partial Payment (Razorpay-specific)

```
Trigger: User pays less than order amount (Razorpay allows partial)
Backend: On webhook, check amount_paid vs order.total
         If amount_paid < order.total → mark payment_status=PARTIAL, do NOT confirm order
         Alert operations team via admin notification
         Email user: "Your payment was incomplete. Please contact support."
Do NOT: fulfill the order, decrement stock, or send confirmation
```

#### Scenario G — Refund Flow

```
Trigger: User raises return request, admin approves
Backend: Calls Razorpay/Stripe refund API with original payment_id
         Sets payment_status=REFUND_REQUESTED
         On refund webhook success: sets payment_status=REFUNDED, sends email
         On refund webhook failure: sets payment_status=REFUND_FAILED, alerts admin
Timeline: Razorpay refunds in 5–7 business days. Show estimated date in UI.
Partial refund: Supported — store refunded_amount separately from total.
```

---

## ═══════════════════════════════════════

## SECTION 14 — INVENTORY & CONCURRENCY EDGE CASES

## ═══════════════════════════════════════

This section covers race conditions and inventory management edge cases that are extremely common in e-commerce and must be architecturally solved — not left to chance.

### 14.1 The "Last Item" Race Condition

**Problem:** Two users simultaneously view a product with `stock=1`. Both add to cart. Both click "Place Order" at the same time. Both succeed at the pre-order stock check. Now stock goes to -1.

**Solution: Pessimistic Locking on Stock Decrement**

Stock is ONLY decremented inside the payment webhook handler (after confirmed payment), using a PostgreSQL `SELECT FOR UPDATE` lock:

```sql
-- Inside a transaction, in payment_service.py
SELECT stock FROM products WHERE id = :product_id FOR UPDATE;
-- Now check: if stock < quantity → raise InsufficientStockError
-- Only decrement if stock is sufficient
UPDATE products SET stock = stock - :quantity WHERE id = :product_id;
```

This means:

- Stock is NOT decremented at cart add time
- Stock is NOT decremented at order creation time
- Stock is ONLY decremented atomically when webhook confirms payment
- If two payments arrive simultaneously for the last item, one transaction gets the lock, decrements to 0, commits. The second transaction gets the lock, sees stock=0, raises error → triggers an automatic refund for the second order.

**Frontend behavior for the losing order:**

```
Order status: PAYMENT_SUCCESS_STOCK_FAILED
Email: "We're sorry — the item sold out while your payment was processing.
        A full refund has been initiated and will reflect in 5–7 business days."
```

---

### 14.2 Cart-Level Stock Warning (Soft Reservation)

While we don't hard-reserve stock at cart time (that would require TTL-based release logic and is complex), we DO show live stock warnings:

```
[REQUIRED] On cart page load: check current stock for each cart item
  - If stock >= 10: show nothing special
  - If stock 2–9: show "Only {stock} left" badge (yellow)
  - If stock = 1: show "Last one left!" badge (orange, pulsing)
  - If stock = 0 (sold out since adding to cart): show "Out of Stock" + disable checkout for that item

[REQUIRED] On checkout page load: re-validate stock. If any item is out of stock, block "Place Order" button and show inline error.

[REQUIRED] At order initiation (POST /orders/initiate): server-side stock check again.
  If stock insufficient at this point: return 409 Conflict with error message. Do NOT create order or initiate payment.
```

---

### 14.3 Multiple Simultaneous Orders for the Same Product

**Problem:** Seller lists 50 units. Flash sale begins. 200 users place orders in 10 seconds.

**Solution layers:**

```
Layer 1 — Redis Atomic Counter (fast path, pre-DB)
  On POST /orders/initiate:
    result = redis.decrby(f"stock:{product_id}", quantity)
    if result < 0:
        redis.incrby(f"stock:{product_id}", quantity)  # rollback counter
        return 409 "Item out of stock"

  This is non-blocking and handles burst traffic cheaply.
  Redis counter is seeded from DB on product update and re-synced every minute.

Layer 2 — DB SELECT FOR UPDATE (confirmed on webhook)
  As described in 14.1 — final authoritative check with row lock.

Layer 3 — Stock Sync Job
  A background task runs every 60 seconds to sync Redis counter from DB actual stock.
  Handles drift caused by cancelled orders, restocked items, etc.
```

---

### 14.4 Order Placed But Email Never Sent

```
Problem: SMTP/email API fails after order is confirmed.
Solution: Email sending is NOT inline in the webhook handler.
          On payment success → push an email job to a Redis queue (or background task queue)
          A worker processes the queue and retries failed emails up to 5 times with exponential backoff.
          If all retries fail → mark email_status=FAILED on the order → admin dashboard shows it.
Do NOT: let email failure cause payment webhook to return non-200 (that triggers provider retry of the entire webhook)
```

---

### 14.5 Seller Deletes Product After Order is Placed

```
Rule: Products are NEVER hard-deleted if they have orders.
      Deletion sets status=ARCHIVED.
      Archived products are hidden from search and PDP but still readable via order history.
      Order detail page for buyers always shows the product name, image, and price snapshotted at order time.

[REQUIRED] Snapshot product data at order time:
  order_items table stores: product_id, seller_id, title_snapshot, image_url_snapshot, unit_price
  This prevents order history from showing "Product not found" if seller deletes listing.
```

---

### 14.6 Seller Changes Price After Item is in Buyer's Cart

```
Rule: Cart stores product_id and quantity. Price is looked up at render time.
      This means if seller raises price, buyer sees new price on cart page.

[REQUIRED] On cart page: show "Price updated" notice if price changed since item was added (compare against added_at price, stored in cart_items.price_at_add).

[REQUIRED] On checkout confirmation: show final price clearly. User must see and confirm.

[REQUIRED] POST /orders/initiate always re-fetches current price from DB — never trusts client-sent price.
```

---

### 14.7 User Places Order, Then Seller Goes Out of Stock Before Shipping

```
Scenario: Order confirmed, payment taken, but seller hasn't shipped yet.
          Seller marks product out of stock / cancels.

Flow:
  Seller cancels order item → triggers seller_cancel_order_item() in seller service
  Backend initiates refund automatically
  Buyer receives email: "Your order was cancelled by the seller. Refund initiated."
  Order item status → CANCELLED_BY_SELLER
  Platform records the seller cancellation for seller performance metrics
  Repeat offenders (>X cancellations/month) flagged in admin dashboard
```

---

### 14.8 Network Drop During Checkout Redirect

```
Scenario: Payment succeeds at provider, but browser closes before redirect back.
Result: Webhook still arrives at server → order confirmed correctly.
Frontend: On any page load, if there's a pending_order_id in session:
          GET /orders/:id → if status=confirmed → redirect to /orders/:id/confirmed
          This handles "did my payment go through?" confusion.
```

---

## ═══════════════════════════════════════

## SECTION 15 — PASSWORD & ACCOUNT SECURITY

## ═══════════════════════════════════════

### 15.1 Password Policy

**Requirements (enforced both frontend with zod and backend with pydantic):**

```
Minimum length:        8 characters
Maximum length:        128 characters (prevent bcrypt DoS — truncate after 72 chars in bcrypt)
Must contain:          At least 1 uppercase letter (A–Z)
                       At least 1 lowercase letter (a–z)
                       At least 1 digit (0–9)
                       At least 1 special character: !@#$%^&*()_+-=[]{}|;':,./<>?
Must NOT contain:      User's email prefix (e.g. if email is john@x.com, reject "john123")
                       User's full name as substring (case-insensitive)
                       Common passwords — check against top-10000 list (zxcvbn library)
                       Repeated characters: no more than 3 consecutive same chars (e.g. "aaaa" rejected)
```

**Frontend UI requirements:**

```
[REQUIRED] Real-time strength meter (4 levels: Weak / Fair / Strong / Very Strong) using zxcvbn
[REQUIRED] Inline checklist that checks off each rule as user types:
           ✓ 8+ characters
           ✓ Uppercase letter
           ✓ Lowercase letter
           ✓ Number
           ✓ Special character
[REQUIRED] Password confirm field — must match exactly
[REQUIRED] Show/hide password toggle (eye icon)
[REQUIRED] Do NOT disable paste in password fields — violates UX best practices and NCSC guidelines
```

**Backend enforcement:**

```python
# In schemas/user.py (Pydantic v2)
@field_validator("password")
def validate_password(cls, v, info):
    if len(v) < 8:
        raise ValueError("Password must be at least 8 characters")
    if not re.search(r"[A-Z]", v):
        raise ValueError("Password must contain an uppercase letter")
    if not re.search(r"[a-z]", v):
        raise ValueError("Password must contain a lowercase letter")
    if not re.search(r"\d", v):
        raise ValueError("Password must contain a number")
    if not re.search(r"[!@#$%^&*()_+\-=\[\]{}|;':,./<>?]", v):
        raise ValueError("Password must contain a special character")
    # Truncate to 72 chars before bcrypt to prevent DoS
    return v[:72]
```

---

### 15.2 Account Security Features

```
[REQUIRED] Email verification: OTP sent on registration, must verify before first purchase
[REQUIRED] Password reset: email link with HMAC-signed token, expires in 15 minutes, single-use
[REQUIRED] Login alert email: sent on sign-in from new device/IP (compare against last 5 known IPs)
[REQUIRED] Active sessions management: user can view and terminate individual sessions from account settings
[REQUIRED] "Log out all devices" option — invalidates all refresh tokens in Redis
[RECOMMENDED] Two-Factor Authentication (TOTP — Google Authenticator compatible):
              Backend: pyotp library
              Frontend: QR code display using qrcode library
              Backup codes: 8 one-time codes generated at setup
[RECOMMENDED] Account deletion: GDPR/DPDP compliant — soft delete + data export option
```

---

### 15.3 Brute Force & Credential Stuffing Protection

```
[REQUIRED] Rate limit /auth/login: 5 attempts per IP per 15 minutes → 429 response + Retry-After header
[REQUIRED] Progressive delay: after 3 failed attempts, add 2-second server-side delay before responding
[REQUIRED] Account lockout: after 10 failed attempts across any IP → lock account for 30 minutes → email alert to user
[REQUIRED] Lockout notification: email tells user the time of attempts and their IP (masked: 192.168.x.x)
[RECOMMENDED] CAPTCHA trigger: after 3 failed attempts on same session → show hCaptcha (not reCAPTCHA — GDPR concern)
[RECOMMENDED] Credential stuffing detection: if same IP tries >50 unique accounts in 1 hour → permanent IP block + admin alert
[SECURITY] Never tell attacker whether email exists: "Invalid email or password" always — never "Email not found"
```

---

## ═══════════════════════════════════════

## SECTION 16 — ADDITIONAL MISSING FEATURES (v2 ADDITIONS)

## ═══════════════════════════════════════

These features were omitted from v1.0 and are added here. Integrate into the relevant phase.

### 16.1 Guest Checkout

```
[REQUIRED] Users can checkout without creating an account.
           Collect: name, email, phone, delivery address at checkout.
           Create a guest order with no user_id (or ephemeral guest user).
           After order, prompt: "Save your details? Create an account to track your order."
           Cart stored in localStorage for guest. On login, merge with DB cart.
```

### 16.2 Address Management

```
[REQUIRED] Users can store multiple saved addresses (max 5).
[REQUIRED] One address is marked is_default.
[REQUIRED] Address fields: label (Home/Work/Other), full_name, phone, street_line1, street_line2 (optional), city, state, pincode, country.
[REQUIRED] Pincode-based city/state auto-fill (India Post pincode API or local lookup table).
[RECOMMENDED] Google Maps address autocomplete (Maps Places API).
```

### 16.3 Product Reviews — Anti-Abuse

```
[REQUIRED] Only verified purchasers (order_status=DELIVERED) can review a product.
[REQUIRED] One review per product per user per order (can edit within 30 days).
[REQUIRED] Review text sanitized server-side (bleach — strip all HTML).
[REQUIRED] Image uploads in reviews: max 5 images, each max 2MB, JPEG/PNG/WEBP only.
[RECOMMENDED] Profanity filter on review text (better-profanity Python library).
[RECOMMENDED] Review helpfulness voting: users can mark reviews as helpful/not helpful.
[FUTURE] AI-powered review summary at top of reviews section.
```

### 16.4 Notifications System

```
In-app notification bell in navbar:
  - Order confirmed
  - Order shipped (with tracking link)
  - Order delivered
  - Price drop on wishlist item
  - Review approved / rejected
  - Seller: new order received

Email notifications (all transactional, never marketing without consent):
  - Registration welcome + email verification
  - Order confirmation (with itemized receipt)
  - Shipping update (with tracking ID)
  - Delivery confirmation
  - Refund initiated / completed
  - Password changed alert
  - Login from new device alert
  - Account locked alert

[REQUIRED] Users can opt out of each email type individually from account settings.
[REQUIRED] All marketing emails have one-click unsubscribe (CAN-SPAM / DPDP compliant).
```

### 16.5 Search Edge Cases

```
[REQUIRED] Empty search query → redirect to home, do NOT show all products.
[REQUIRED] No results → show "No results for X" + suggested categories + trending products.
[REQUIRED] Typo tolerance → Meilisearch handles this natively (typoTolerance config).
[REQUIRED] Search with special characters → sanitize query before passing to Meilisearch.
[REQUIRED] Very long queries (>200 chars) → truncate at 200 chars server-side.
[RECOMMENDED] Search history: last 10 queries saved per user (localStorage for guests, DB for logged-in).
[RECOMMENDED] Trending searches: top 10 queries in last 24h (Redis sorted set).
```

### 16.6 Order Cancellation by Buyer

```
Cancellation window: Buyer can cancel ONLY if order_status=CONFIRMED (not yet shipped).
Once SHIPPED: cannot cancel — must use return flow after delivery.

Flow:
  Buyer clicks Cancel Order → selects reason → confirms
  Backend: sets order_status=CANCELLED, initiates refund if payment was made
  Stock: re-incremented (both Redis counter and DB, in one transaction)
  Email: cancellation confirmation + refund timeline

Seller can cancel too (see Section 14.7). Admin can cancel any order.
```

### 16.7 Delivery Date Estimation

```
[REQUIRED] On PDP: show estimated delivery date range.
           Logic: today + seller_processing_days (1–2) + shipping_days_by_pincode (lookup table).
           Show: "Delivery by Mon, 5 May – Wed, 7 May" (like Flipkart).
[REQUIRED] On checkout address selection: re-calculate delivery date for selected pincode.
[RECOMMENDED] Pincode serviceability check: some pincodes may not be serviceable by default.
```

### 16.8 Seller Payout System

```
[FUTURE] — architecture must not block this.
Payouts are calculated: order_total - platform_commission (configurable %, default 5%) = seller_earnings
Payout schedule: weekly, on Fridays, for all DELIVERED orders from the previous week.
Payout method: bank transfer (Razorpay Route / Stripe Connect).
Ledger: append-only payments_ledger table tracks every credit and debit.
```

---

## ═══════════════════════════════════════

## SECTION 17 — UPDATED GLOSSARY (v2 ADDITIONS)

## ═══════════════════════════════════════

| Term                | Meaning                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------- |
| PDP                 | Product Detail Page                                                                     |
| PLP                 | Product Listing Page (search/category results)                                          |
| BOLA                | Broken Object-Level Authorization                                                       |
| IDOR                | Insecure Direct Object Reference (same as BOLA)                                         |
| JTI                 | JWT ID — unique identifier per token for blacklisting                                   |
| CSP                 | Content Security Policy                                                                 |
| DAST                | Dynamic Application Security Testing                                                    |
| SAST                | Static Application Security Testing                                                     |
| PCI-DSS             | Payment Card Industry Data Security Standard                                            |
| DPDP                | Digital Personal Data Protection Act (India, 2023)                                      |
| MRP                 | Maximum Retail Price                                                                    |
| ISR                 | Incremental Static Regeneration                                                         |
| RSC                 | React Server Components                                                                 |
| TOTP                | Time-based One-Time Password (2FA standard)                                             |
| Idempotency Key     | Unique key ensuring an operation is only processed once even if called multiple times   |
| SELECT FOR UPDATE   | PostgreSQL row-level lock preventing concurrent modification                            |
| Pessimistic Locking | Lock the row before reading to prevent race conditions                                  |
| Soft Delete         | Mark a record as deleted (flag) without removing from DB                                |
| zxcvbn              | Open-source password strength estimator by Dropbox                                      |
| Webhook             | Server-to-server HTTP callback sent by payment provider on event (payment success/fail) |
| HMAC                | Hash-based Message Authentication Code — used to verify webhook authenticity            |
| Flash Sale          | Time-limited high-demand sale event with burst traffic                                  |
| Credential Stuffing | Attack using leaked username/password combos from other breached sites                  |

---

_End of NEXMART Master Build Prompt v2.0_  
_Feed this document to any LLM or development team to begin phased implementation._  
_v2.0 adds: complete payment flows, dummy mode, all payment failure scenarios, stock race conditions, concurrent order handling, last-item edge case, price change edge case, seller cancellation, password policy, brute force protection, 2FA, guest checkout, address management, review anti-abuse, notifications, search edge cases, order cancellation, delivery estimation._
