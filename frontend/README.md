# StairsLife — Platform Freelance Mahasiswa

Vanilla JS frontend + NestJS backend.  
Terakhir diperbarui: Phase 4 — Bug Fixes, Backend Completion, Token Refresh, Skeleton UI, Vite Build.

---

## Quick Start

```bash
# Install dependencies
npm install

# Dev server (localhost:5173, hot reload CSS)
npm run dev

# Production build → dist/
npm run build

# Preview hasil build
npm run preview

# Lint (syntax check + duplikat + prompt() check)
npm run lint
```

---

## Build Output (`dist/`)

| File | Keterangan |
|---|---|
| `index.html` | HTML dioptimasi |
| `assets/bundle.[hash].js` | Semua 30 JS diminify jadi 1 file (~170KB, -31%) |
| `assets/style.[hash].css` | CSS diminify (~54KB, -23%) |

Hash di nama file untuk **cache busting** otomatis.

---

---

## Struktur Project

```
stairslife-improved/
├── index.html              1.840+ baris — semua screen HTML
├── scripts/
│   ├── app.js              ~270 baris — state global + bootstrap (entry point)
│   ├── api.js              ~470 baris — semua API endpoint per domain
│   ├── core/
│   │   ├── api-core.js     HTTP fetch wrapper (timeout, 401, retry, env URL)
│   │   ├── auth.js         Login, register multi-step, OTP, KTM upload
│   │   ├── router.js       goTo, goBack, _showScreen, popstate
│   │   └── theme.js        applyTheme, toggleTheme
│   ├── utils/
│   │   ├── helpers.js      fmtRelative, fmtCurrency, fmtRange, tierBadge, statusBadge
│   │   ├── toast.js        showToast, animateProgressBar
│   │   └── storage.js      Storage wrapper (get/set/remove/getJSON/setJSON)
│   └── features/           21 file per-domain
│       ├── notifications/notifications.js
│       ├── reviews/reviews.js
│       ├── settings/settings.js
│       ├── verification/verification.js
│       ├── disputes/disputes.js
│       ├── payments/payments.js
│       ├── contracts/contracts.js
│       ├── chat/chat.js
│       ├── student/
│       │   ├── student.js
│       │   ├── projects.js
│       │   └── applications.js
│       ├── business/
│       │   ├── business.js
│       │   └── projects.js
│       └── admin/
│           ├── admin.js
│           ├── users.js
│           ├── verif.js
│           ├── disputes.js
│           ├── support.js
│           ├── announcements.js
│           └── projects.js
├── styles/
│   └── main.css            ~70 KB
└── CHANGELOG.md
```

---

## Load Order (`index.html`)

Urutan `<script>` wajib dipertahankan (no bundler — dependency via load order):

```
1.  chart.js (CDN)
2.  scripts/core/api-core.js    ← HTTP layer
3.  scripts/api.js              ← semua API services
4.  scripts/utils/helpers.js
5.  scripts/utils/toast.js
6.  scripts/utils/storage.js
7.  scripts/core/theme.js
8.  scripts/core/router.js
9.  scripts/core/auth.js
10–28. scripts/features/**/*.js  ← feature modules
29. scripts/app.js              ← entry point, SELALU TERAKHIR
```

---

## Environment Variables

Set `API_BASE_URL` via meta tag di `index.html`, atau biarkan kosong untuk default `http://localhost:3000`:

```html
<meta name="api-base-url" content="https://api.stairslife.id">
```

---

## Status Integrasi Backend (Phase 4)

| Fitur | Status |
|---|---|
| Login / Register / OTP | ✅ Connected |
| KTM Upload & Verifikasi | ✅ Connected |
| Browse & Post Project | ✅ Connected |
| Apply & Manage Lamaran | ✅ Connected |
| Escrow (upload bukti + hold) | ✅ Connected |
| Upload Deliverable | ✅ Connected |
| Approve & Release Escrow | ✅ Connected |
| Submit Review | ✅ Connected |
| Chat Contract (polling) | ✅ Connected |
| Chat Support | ✅ Connected (+ fallback lokal) |
| Chat Mediasi Dispute | ✅ Connected (+ fallback lokal) |
| Admin Verif / Dispute / Stats | ✅ Connected |
| Admin Platform Settings | ✅ Connected (persist ke backend) |
| Notifikasi | ✅ Connected |
