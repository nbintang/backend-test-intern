<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# **CRUD Toko Online**

[View API Documentation on Postman](https://documenter.getpostman.com/view/36188038/2sB3Wnw21t)

## Deskripsi singkat

Aplikasi backend toko online berbasis NestJS yang mendukung manajemen produk, pesanan (order), dan merchant.
Sistem ini menggunakan Prisma ORM untuk koneksi ke PostgreSQL, dilengkapi autentikasi JWT, serta E2E testing dengan Jest dan Supertest.

## Project setup

## 1. Install Dependencies

Pastikan semua dependency sudah terinstal:

```bash
npm install
```

## 2. Database Setup

Project ini menggunakan Prisma ORM dengan PostgreSQL. Buka file `.env` dan pastikan environment variable sudah berisi:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/NAMA_DATABASE?schema=public"
```

## 3. Generate Prisma Client & Migrate Database

Jalankan perintah berikut untuk membuat skema database dan generate Prisma client:

```bash
npx prisma migrate dev --name init
```

Untuk memastikan client Prisma siap digunakan:

```bash
npx prisma generate
```

## 4. Seed Data Awal

Project ini sudah menyediakan file seed untuk menambahkan data awal (seperti akun merchant contoh). Jalankan:

```bash
npx prisma db seed
```

**Data merchant default yang ditambahkan:**

- Email: `merchant@example.com`
- Password: `password123`

## 5. Menjalankan Server

### Mode development:

```bash
npm run start:dev
```

### Mode production (setelah build):

```bash
npm run build
npm run start:prod
```

Server akan berjalan di:

```
http://localhost:3000/api
```

## 6. Login & Token Authentication

Gunakan endpoint login untuk mendapatkan access token:

```http
POST /api/auth/login
```

**Body:**

```json
{
  "email": "merchant@example.com",
  "password": "password123"
}
```

**Response sukses:**

```json
{
  "data": {
    "accessToken": "jwt-token-anda",
    "refreshToken": "jwt-refresh-token"
  }
}
```

Gunakan `accessToken` ini untuk mengakses route yang dilindungi:

```http
Authorization: Bearer <accessToken>
```

## 7. Menjalankan Test

### E2E Test

```bash
npm run test:e2e
```

### Test E2E Modules atau aplikasi

```bash
npm run test:modules
```

### Test Token Saja

```bash
npm run test:token
```

## 📂 Struktur Folder Utama

```
.
└── src/
    ├── common/
    │   ├── app/
    │   │   ├── dto
    │   │   ├── exceptions
    │   │   ├── interceptors
    │   │   ├── interfaces
    │   │   ├── pipes
    │   │   ├── validators
    │   │   └── ...others
    │   ├── logger
    │   ├── prisma
    │   └── ...others
    ├── config/
    │   ├── app/
    │   │   ├── app.config.module.ts
    │   │   ├── app.config.schema.ts
    │   │   ├── app.config.service.ts
    │   │   └── app.config.ts
    │   ├── auth/
    │   │   ├── auth.config.module.ts
    │   │   ├── auth.config.schema.ts
    │   │   ├── auth.config.service.ts
    │   │   └── auth.config.ts
    │   └── ...others
    ├── modules/
    │   ├── auth/
    │   │   ├── controllers/
    │   │   │   ├── auth.controller.ts
    │   │   │   └── ...others
    │   │   ├── dto/
    │   │   │   ├── login.dto.ts
    │   │   │   ├── register.dto.ts
    │   │   │   └── ...others
    │   │   ├── guards/
    │   │   │   ├── access-token.guard.ts
    │   │   │   ├── refresh-token.guard.ts
    │   │   │   └── ...others
    │   │   ├── interfaces/
    │   │   │   ├── user-jwt-payload.interface.ts
    │   │   │   └── ...others
    │   │   ├── services/
    │   │   │   ├── auth.service.ts
    │   │   │   └── ...others
    │   │   ├── strategies/
    │   │   │   ├── access-token.strategy.ts
    │   │   │   ├── refresh-token.strategy.ts
    │   │   │   └── ...others
    │   │   └── auth.module.ts
    │   ├── categories/
    │   │   ├── controllers
    │   │   ├── dto/
    │   │   │   ├── requests
    │   │   │   └── responses
    │   │   ├── services
    │   │   ├── ...others
    │   │   └── categories.module.ts
    │   ├── merchant/
    │   │   ├── controllers
    │   │   ├── dto/
    │   │   │   ├── requests
    │   │   │   └── responses
    │   │   ├── interfaces
    │   │   ├── services
    │   │   ├── ...others
    │   │   └── merchant.module.ts
    │   ├── order/
    │   │   ├── controllers
    │   │   ├── dto/
    │   │   │   ├── requests
    │   │   │   └── responses
    │   │   ├── services
    │   │   ├── ...others
    │   │   └── order.module.ts
    │   └── product/
    │       ├── controllers
    │       ├── dto/
    │       │   ├── requests
    │       │   └── responses
    │       ├── services
    │       ├── ...others
    │       └── product.module.ts
    ├── app.controller.spec.ts
    ├── app.controller.ts
    ├── app.module.ts
    ├── app.service.ts
    └── main.ts
```

## **Alasan Pemilihan pattern tersebut**

NestJS merupakan salah satu framework JS yang un-opinionated, great typescript support, dan sangat mature untuk pembuatan aplikasi menengah ke atas, serta mendukung modular structure. Berikut alasan pemilihan saya terhadap pattern tersebut:

### 1. Modular Architecture Pattern

Setiap modul bisnis (auth, product, order, merchant, categories) dipisahkan menjadi module independen dengan komponen-komponennya sendiri (controllers, services, dto, guards, dll). Pattern ini memungkinkan:

- **Isolasi fitur**: Perubahan pada satu modul tidak mempengaruhi modul lain
- **Parallel development**: Tim dapat bekerja pada modul berbeda secara bersamaan
- **Reusability**: Modul dapat di-reuse atau di-extract menjadi microservice jika diperlukan

### 2. Layered Architecture Pattern

Pemisahan layer berdasarkan responsibility:

- **`common/`**: Shared utilities, helpers, dan komponen yang digunakan lintas modul (interceptors, pipes, validators, exception handlers)
- **`config/`**: Centralized configuration management untuk environment variables
- **`modules/`**: Business logic layer yang berisi domain-specific logic

Pattern ini menjaga **Single Responsibility Principle** dan memudahkan testing karena setiap layer memiliki tanggung jawab yang jelas.

### 3. Request-Response Pattern dengan DTO Separation

Pemisahan DTO menjadi `requests/` dan `responses/` memberikan kejelasan:

- **Input validation**: DTO request fokus pada validasi data masuk
- **Output formatting**: DTO response fokus pada struktur data yang dikirim ke client
- **API contract clarity**: Developer langsung memahami struktur request dan response setiap endpoint

### 4. Configuration as Code Pattern

Setiap konfigurasi (app, auth, database) dikelola dengan struktur yang konsisten:

- **Schema validation**: Memastikan environment variables valid saat startup
- **Type-safe config**: Konfigurasi dapat diakses dengan type safety
- **Centralized management**: Mudah untuk update atau menambah konfigurasi baru

### 5. Maintainability & Scalability

Pattern ini dipilih dengan mempertimbangkan:

- **Onboarding**: Developer baru dapat cepat memahami struktur project karena konsisten dan predictable
- **Debugging**: Mudah menemukan bug karena setiap komponen memiliki lokasi yang jelas
- **Testing**: Setiap layer dapat ditest secara independen (unit test, integration test, e2e test)
- **Growth**: Mudah menambah fitur baru atau melakukan refactoring tanpa risiko breaking changes

### 6. Industry Best Practices

Pattern ini mengadopsi standar industri yang digunakan oleh perusahaan-perusahaan teknologi besar, sehingga memastikan kode yang dihasilkan professional dan mudah di-maintain dalam jangka panjang.
 