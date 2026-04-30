# 🌑 NEXMART: Studio Obsidian
### High-Fidelity Hardware Marketplace for the Modern Artisan

NEXMART is a premium, performance-optimized e-commerce platform built for the next generation of hardware enthusiasts. Featuring the **Studio Obsidian** design language, it combines glassmorphism, aggressive typography, and ultra-low latency edge computing to deliver a world-class shopping experience.

---

## 🏗️ Architecture: The Monorepo
NEXMART is structured as a modern monorepo to ensure seamless synchronization between the UI and the API.

-   **/frontend**: A high-performance React + Vite application styled with vanilla CSS for maximum aesthetic control.
-   **/backend**: A serverless Hono API designed specifically for the Cloudflare Workers & D1 ecosystem.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
-   **Node.js** (v18 or higher)
-   **npm** or **pnpm**
-   **Cloudflare Wrangler CLI** (`npm install -g wrangler`)

### 2. Installation
Clone the repository and install dependencies from the root:
```bash
npm install
```

### 3. Running the Dev Environment
NEXMART uses a unified development command to start both the frontend and backend simultaneously:
```bash
npm run dev
```
-   **Frontend**: `http://localhost:5173`
-   **Backend**: `http://127.0.0.1:8788`

---

## ☁️ Deployment to Cloudflare

### Backend (Workers + D1)
1. Initialize your D1 database:
   ```bash
   npx wrangler d1 create nexmart-db
   ```
2. Update `backend/wrangler.toml` with your new `database_id`.
3. Apply migrations and seed data:
   ```bash
   cd backend
   npx wrangler d1 migrations apply nexmart-db --remote
   npx wrangler d1 execute nexmart-db --remote --file=./seed.sql
   ```
4. Deploy the API:
   ```bash
   npx wrangler deploy
   ```

### Frontend (Pages)
1. Connect this repository to **Cloudflare Pages**.
2. Set the **Root Directory** to `/frontend`.
3. Set the **Build Command** to `npm run build`.
4. Set the **Output Directory** to `dist`.
5. Add the environment variable `VITE_API_URL` pointing to your deployed Worker API.

---

## 🎨 Design System: Studio Obsidian
NEXMART utilizes a custom-built design system characterized by:
-   **Aggressive Contrast**: Deep obsidian backgrounds (#0A0A0A) paired with crisp white accents.
-   **Glassmorphism**: Subtle backdrop filters and border gradients for depth.
-   **Z-Index Hierarchy**: A strictly enforced layering system for complex mobile navigation.
-   **Performance First**: Zero bloat, leveraging native browser capabilities for animations.

---

## 🛡️ Security Protocols
-   **JWT Stateless Auth**: Secure, edge-compatible authentication.
-   **Global Write-Lock**: A "System Freeze" mechanism for emergency maintenance.
-   **CORS Hardening**: Strict origin validation for production environments.

---

### 🖋️ Artisan Credits
Developed by the **Studio Obsidian** team for the modern hardware artisan.
