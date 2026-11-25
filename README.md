# SOFTYX & SIP — Business Management Platform

Complete Laravel 12 + React + TypeScript + Inertia.js + Tailwind CSS platform managing:
1. **SOFTYX & SIP — Food and Drinks**: Live QR menu, categories, search, optional 3D viewer, customer ordering, kitchen order queue, inventory tracking, promotions, and PDF invoice confirmation emails.
2. **SOFTYX — Clothing and Fashion**: Clothing showcase cards with direct, server-side validated external product redirects to `https://softyx.shop` (no duplicate clothing checkout).

---

## Setup & Installation

### 1. Environment Variables
Configure `.env` for your MySQL 8 database and mail server:

```env
APP_NAME="SOFTYX & SIP"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=softyx_sip
DB_USERNAME=root
DB_PASSWORD=

QUEUE_CONNECTION=database
MAIL_MAILER=smtp
MAIL_FROM_ADDRESS="orders@softyxsip.local"
MAIL_FROM_NAME="SOFTYX & SIP"
```

### 2. Install & Migrate

```bash
composer install
npm install --legacy-peer-deps
npm run build
php artisan storage:link
php artisan migrate --seed
```

---

## Clothing Store Redirect Architecture

- Every clothing product stores `external_store_url`, `external_store_name` (`SOFTYX`), `redirect_enabled`, and `fallback_redirect_enabled`.
- Clicking **Shop on SOFTYX** hits `GET /clothing/{slug}/redirect`.
- `ClothingRedirectService` validates server-side that the target host is `softyx.shop` (or `www.softyx.shop`) before redirecting, preventing open redirects.
- If `external_store_url` is empty, it falls back to `https://softyx.shop` only when `fallback_redirect_enabled` is enabled.

---

## QR Code Studio

- Navigate to `/admin/qr-codes` to generate the permanent **Main Menu QR**, **Table QRs**, or **Individual Food QRs** (from `/admin/foods`).
- QR codes encode `/qr/{uuid}`, which dynamically redirects to live database routes—editing prices or dishes never requires reprinting QR codes.
- Printable SVG QR codes can be downloaded directly from the studio.

---

## Verification

Run the TypeScript + Vite build and PHPUnit test suite:

```bash
npm run build
php artisan test
```
