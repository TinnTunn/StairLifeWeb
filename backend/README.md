# StairsLife Backend

Backend API untuk aplikasi StairsLife, dibangun dengan NestJS, Prisma, Supabase, dan WebSocket. Dokumentasi ini khusus menjelaskan arsitektur, pola desain, dan struktur modul yang diterapkan dalam sistem backend.

## Ringkasan Proyek

StairsLife Backend adalah sistem backend modular untuk layanan freelance dan project management. Sistem ini menangani:
- otentikasi dan otorisasi pengguna
- manajemen user profile dan verifikasi
- manajemen projects dan applications
- kontrak, deliverables, dan pembayaran
- admin review, dispute, dan pengumuman
- chat realtime menggunakan WebSocket

## Arsitektur Layered

Proyek menerapkan arsitektur berlapis (layered architecture) secara jelas:

1. Presentation Layer
   - `controllers/` pada setiap module
   - menangani request HTTP, memanggil service, dan mengembalikan response

2. Application / Domain Layer
   - `services/` bertugas mengimplementasikan aturan bisnis
   - memisahkan logika aplikasi dari detail infrastruktur

3. Persistence / Infrastructure Layer
   - `repositories/` bertanggung jawab untuk operasi database
   - menggunakan `PrismaService` sebagai gateway ke PostgreSQL

4. Cross-Cutting Concerns
   - `guards/`, `interceptors/`, `filters/`, `decorators/`
   - dipakai untuk otentikasi, validasi, response wrapper, error handling, dan kontrol akses

## Modul dan Pemisahan Tanggung Jawab

Proyek dibagi menjadi domain-domain modular:
- `AuthModule` - otentikasi JWT, Passport, strategi `JwtStrategy`
- `UsersModule` - profil, verifikasi pengguna, endpoint `users/me`
- `ProjectsModule` - mencari, membuat, mengubah, dan menghapus proyek
- `ApplicationsModule` - kelola pengajuan project
- `ContractsModule` - bangun kontrak dan upload deliverables
- `PaymentsModule` - menangani create payment dan status pembayaran
- `AdminModule` - review verifikasi, resolve dispute, kirim announcement
- `ChatModule` - gateway realtime Socket.IO untuk chat

Setiap module mengikuti prinsip Single Responsibility: controller menangani routing, service mengelola logika bisnis, repository fokus ke database.

## Design Pattern yang Digunakan

- Dependency Injection
  - NestJS dependency injection dipakai di seluruh aplikasi
  - `ProjectsService`, `UsersService`, `PrismaService`, `JwtStrategy`, dll disuntikkan saat runtime

- Repository Pattern
  - repository memisahkan query Prisma dari service
  - contoh: `ProjectsRepository` memiliki method `findAll`, `findById`, `create`, `update`, `delete`

- Strategy Pattern
  - `JwtStrategy` untuk otentikasi JWT via Passport

- Decorator Pattern
  - custom decorator `@CurrentUser()` untuk mendapatkan user dari request
  - custom decorator `@Roles()` dipakai bersama `roles.guard.ts` untuk kontrol akses

- Pipeline Pattern
  - `ValidationPipe` global untuk memastikan DTO valid, `whitelist`, dan `forbidNonWhitelisted`

- Interceptor Pattern
  - `ResponseInterceptor` membungkus semua response sukses ke format konsisten

- Exception Filter
  - `HttpExceptionFilter` menangani transformasi error global

## Infrastruktur dan Konfigurasi

- `ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })`
  - konfigurasi environment global di seluruh module

- `DatabaseModule` global
  - menyediakan `PrismaService` dan `SupabaseService`
  - `PrismaService` menggunakan lifecycle hooks `OnModuleInit` / `OnModuleDestroy`

- `PrismaService`
  - adaptor `@prisma/adapter-pg` untuk koneksi PostgreSQL
  - koneksi otomatis saat aplikasi bootstrap

- WebSocket
  - `ChatModule` terhubung dengan `@nestjs/platform-socket.io`
  - menyediakan endpoint realtime di `ws://localhost:3000/chat`

## Kualitas Kode dan Validasi

- DTO (`src/modules/*/dto/*.dto.ts`) digunakan untuk validasi input
- `class-validator` dan `class-transformer` memastikan data bersih dan ter-transform
- `ValidationPipe` global mencegah masuknya properti yang tidak terdaftar
- `@UseGuards(JwtAuthGuard)` melindungi endpoint yang butuh autentikasi

## Routing dan API

- Base path global: `api/v1`
- Endpoint penting:
  - `POST /auth/login`
  - `POST /auth/register`
  - `GET /users/me`
  - `PATCH /users/me`
  - `GET /projects`
  - `POST /projects`
  - `POST /contracts/upload-deliverable`

## Teknologi Utama

- Node.js + TypeScript
- NestJS
- Prisma ORM
- PostgreSQL (`@prisma/adapter-pg`)
- Supabase JS
- Passport + JWT
- Socket.IO untuk realtime chat
- Jest untuk testing
- ESLint + Prettier untuk formatting

## Setup dan Run

```bash
npm install
npm run start:dev
```

## Testing

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## Struktur Folder Utama

- `src/app.module.ts` � root module aplikasi
- `src/main.ts` � bootstrap aplikasi
- `src/config/` � konfigurasi database, Supabase, global module
- `src/common/` � decorators, guards, filters, interceptors, DTO global
- `src/modules/` � domain-specific modules

## Catatan Arsitektur

Sistem ini dibangun untuk mudah dikembangkan:
- menambahkan module baru cukup buat controller/service/repository baru
- reusable service dan repository dapat di-export antar module
- cross-cutting concerns terpisah sehingga kode lebih bersih dan mudah diuji
- validasi dan response standard dipusatkan agar API seragam di seluruh endpoint

---

StairsLife
