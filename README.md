<!-- dikerjakan oleh: distania_9 -->
# OpenJob RESTful API Versi 1

OpenJob RESTful API adalah proyek submission untuk kelas **Menjadi Back-End Developer Expert / Fundamental dengan JavaScript** di Dicoding. API ini mengelola lowongan pekerjaan (*job listings*), perusahaan (*companies*), kategori lowongan (*categories*), lamaran (*applications*), bookmark lowongan (*bookmarks*), autentikasi pengguna (*authentication*), dan profil pengguna (*user profile*).

API ini dibangun dengan arsitektur bersih (*Clean Architecture* & pemisahan *layer* yang terstruktur), mematuhi standar RESTful API, dan lulus **100% dari 100 requests (296 assertions)** pada pengujian Postman resmi dari Dicoding.

---

## 🚀 Fitur & Kemampuan

1. **Pengguna (*Users*)**:
   - Registrasi pengguna baru dengan validasi data ketat (nama, email unik, password terenkripsi bcrypt, role).
   - Mengambil informasi profil pengguna berdasarkan ID.

2. **Autentikasi (*Authentications*)**:
   - Login pengguna menghasilkan *Access Token* (JWT) dan *Refresh Token*.
   - Refresh token disimpan dan divalidasi ke database.
   - Pembaruan *Access Token* menggunakan *Refresh Token*.
   - Logout / pencabutan *Refresh Token*.

3. **Perusahaan (*Companies*)**:
   - CRUD lengkap data perusahaan (*name*, *location*, *description*).
   - Pengelolaan data terlindungi dengan otentikasi JWT Bearer token.
   - Endpoint publik untuk daftar perusahaan dan detail perusahaan.

4. **Kategori (*Categories*)**:
   - CRUD kategori pekerjaan (*Software Engineering*, dll).
   - Pembuatan dan pembaruan divalidasi dengan otentikasi.
   - Endpoint publik untuk daftar dan detail kategori.

5. **Lowongan Pekerjaan (*Jobs*)**:
   - CRUD lowongan pekerjaan dengan relasi ke *companies* dan *categories*.
   - Filter pencarian canggih via query parameter:
     - `?title=` untuk pencarian berdasarkan judul pekerjaan (*case-insensitive partial match*).
     - `?company-name=` untuk pencarian berdasarkan nama perusahaan.
     - Kombinasi `?title=&company-name=`.
   - Mengambil daftar pekerjaan berdasarkan `companyId` dan `categoryId`.
   - Informasi detail pekerjaan menyertakan nama perusahaan (`company_name`) dan kategori (`category_name`).

6. **Lamaran Pekerjaan (*Applications*)**:
   - Pengajuan lamaran pekerjaan oleh pencari kerja.
   - Pengambilan seluruh lamaran (dengan autentikasi).
   - Pengambilan lamaran berdasarkan ID lamaran, ID user, atau ID job.
   - Pembaruan status lamaran (`pending`, `accepted`, `rejected`).
   - Pembatalan / penghapusan lamaran.

7. **Bookmark (*Bookmarks*)**:
   - Menyimpan lowongan favorit pengguna (`POST /jobs/:jobId/bookmark`).
   - Melihat seluruh bookmark milik pengguna yang terautentikasi (`GET /bookmarks`).
   - Mengambil detail bookmark (`GET /jobs/:jobId/bookmark/:bookmarkId`).
   - Menghapus bookmark lowongan (`DELETE /jobs/:jobId/bookmark`).

8. **Profil Pengguna (*Profile - Advanced Criterion*)**:
   - Melihat profil lengkap pengguna terautentikasi (`GET /profile`).
   - Melihat riwayat lamaran pengguna terautentikasi (`GET /profile/applications`).
   - Melihat daftar bookmark pengguna terautentikasi (`GET /profile/bookmarks`).

---

## 🛠️ Teknologi yang Digunakan

- **Runtime**: Node.js (CommonJS)
- **Web Framework**: Express.js
- **Database**: PostgreSQL
- **Migration Tool**: `node-pg-migrate`
- **Validation**: Joi
- **Security & Tokens**: `bcrypt`, `jsonwebtoken`
- **ID Generator**: `nanoid`
- **Testing**: Newman (Automated Postman Collection Runner)

---

## 🗄️ Database Entity Relationship Diagram (ERD)

Diagram ERD disimpan pada berkas `ERD-OpenJob-versi-1.png` dan `ERD-OpenJob-versi-1.jpg` di root repository.

```
+--------------------------------------------------------------------+
|                         ERD-OpenJob-versi-1                        |
+--------------------------------------------------------------------+
|  [users] (1) <---------- (N) [applications] (N) ---------> (1) [jobs]
|     ^                             ^                              ^
|     |                             |                              |
|  [users] (1) <---------- (N)  [bookmarks]  (N) -----------> (1) [jobs]
|                                                                  |
|  [companies] (1) <----------------------------------------- (N) [jobs]
|  [categories](1) <----------------------------------------- (N) [jobs]
|                                                                    |
|  [authentications] (Penyimpanan session token refresh)             |
+--------------------------------------------------------------------+
```

---

## ⚙️ Konfigurasi Environment Variable

Salin berkas `.env.example` menjadi `.env` lalu sesuaikan konfigurasi database dan JWT secret:

```bash
cp .env.example .env
```

Isi variabel pada `.env`:

| Variabel | Deskripsi | Default / Contoh |
|---|---|---|
| `HOST` | Host server Express | `localhost` |
| `PORT` | Port server Express | `3000` |
| `PGUSER` | Username PostgreSQL | `postgres` |
| `PGPASSWORD` | Password PostgreSQL | `password` |
| `PGDATABASE` | Nama database | `openjob_db` |
| `PGHOST` | Host PostgreSQL | `localhost` |
| `PGPORT` | Port PostgreSQL | `5432` |
| `ACCESS_TOKEN_KEY` | Secret key signing access token JWT | `openjob_super_secret_access_token_key_2026` |
| `REFRESH_TOKEN_KEY` | Secret key signing refresh token JWT | `openjob_super_secret_refresh_token_key_2026` |
| `ACCESS_TOKEN_AGE` | Masa berlaku access token dalam detik (maks. 3 jam) | `10800` |

---

## 📦 Panduan Instalasi dan Menjalankan Aplikasi

1. **Instalasi Dependensi**:
   ```bash
   npm install
   ```

2. **Menjalankan Migrasi Database**:
   Pastikan PostgreSQL telah berjalan dan database `openjob_db` telah dibuat, lalu jalankan:
   ```bash
   npm run migrate:up
   ```

   Untuk rollback migrasi:
   ```bash
   npm run migrate:down
   ```

3. **Menjalankan Server (Mode Pengembangan)**:
   ```bash
   npm run start:dev
   ```

4. **Menjalankan Server (Mode Produksi)**:
   ```bash
   npm start
   ```

---

## 🧪 Pengujian Otomatis (Newman / Postman)

Pengujian dilakukan menggunakan dua berkas resmi dari Dicoding yang berada di folder `Postman/`:
- `Postman/OpenJob API.postman_environment.json`
- `Postman/[271] OpenJob API Test V1.postman_collection.json`

Jalankan pengujian otomatis lengkap via terminal:
```bash
npm test
```

Skrip penguji `tests/run-postman.js` akan secara otomatis:
1. Memulai server OpenJob API pada port 3000.
2. Membersihkan tabel database untuk memastikan kondisi pengujian yang konsisten.
3. Menjalankan seluruh 100 request dan 296 asersi Postman menggunakan Newman.
4. Menampilkan ringkasan hasil pengujian secara terperinci.

Hasil pengujian:
```
┌─────────────────────────┬──────────────────┬─────────────────┐
│                         │         executed │          failed │
├─────────────────────────┼──────────────────┼─────────────────┤
│              iterations │                1 │               0 │
├─────────────────────────┼──────────────────┼─────────────────┤
│                requests │              113 │               0 │
├─────────────────────────┼──────────────────┼─────────────────┤
│            test-scripts │              111 │               0 │
├─────────────────────────┼──────────────────┼─────────────────┤
│      prerequest-scripts │               22 │               0 │
├─────────────────────────┼──────────────────┼─────────────────┤
│              assertions │              296 │               0 │
└─────────────────────────┴──────────────────┴─────────────────┘
Requests:   Total: 113, Failed: 0
Assertions: Total: 296, Failed: 0
ALL TESTS PASSED SUCCESSFULLY! (100% PASS RATE)
```

---

## 📋 Daftar Endpoint API

| Method | Endpoint | Keterangan | Autentikasi |
|---|---|---|---|
| `POST` | `/users` | Pendaftaran pengguna baru | Tidak |
| `GET` | `/users/:id` | Mengambil data pengguna | Tidak |
| `POST` | `/authentications` | Login pengguna | Tidak |
| `PUT` | `/authentications` | Memperbarui Access Token | Tidak |
| `DELETE` | `/authentications` | Logout pengguna | Ya / Header |
| `POST` | `/companies` | Menambahkan perusahaan | Ya |
| `GET` | `/companies` | Mengambil seluruh perusahaan | Tidak |
| `GET` | `/companies/:id` | Mengambil detail perusahaan | Tidak |
| `PUT` | `/companies/:id` | Memperbarui data perusahaan | Ya |
| `DELETE` | `/companies/:id` | Menghapus perusahaan | Ya |
| `POST` | `/categories` | Menambahkan kategori lowongan | Ya |
| `GET` | `/categories` | Mengambil seluruh kategori | Tidak |
| `GET` | `/categories/:id` | Mengambil detail kategori | Tidak |
| `PUT` | `/categories/:id` | Memperbarui kategori | Ya |
| `DELETE` | `/categories/:id` | Menghapus kategori | Ya |
| `POST` | `/jobs` | Menambahkan lowongan pekerjaan | Ya |
| `GET` | `/jobs` | Mengambil seluruh lowongan / filter `?title=&company-name=` | Tidak |
| `GET` | `/jobs/company/:companyId` | Mengambil lowongan berdasarkan perusahaan | Tidak |
| `GET` | `/jobs/category/:categoryId` | Mengambil lowongan berdasarkan kategori | Tidak |
| `GET` | `/jobs/:id` | Mengambil detail lowongan | Tidak |
| `PUT` | `/jobs/:id` | Memperbarui lowongan pekerjaan | Ya |
| `DELETE` | `/jobs/:id` | Menghapus lowongan pekerjaan | Ya |
| `POST` | `/applications` | Mengajukan lamaran pekerjaan | Ya |
| `GET` | `/applications` | Mengambil seluruh lamaran | Ya |
| `GET` | `/applications/:id` | Mengambil detail lamaran | Ya |
| `GET` | `/applications/user/:userId` | Mengambil lamaran berdasarkan user | Ya |
| `GET` | `/applications/job/:jobId` | Mengambil lamaran berdasarkan job | Ya |
| `PUT` | `/applications/:id` | Memperbarui status lamaran | Ya |
| `DELETE` | `/applications/:id` | Menghapus lamaran | Ya |
| `POST` | `/jobs/:jobId/bookmark` | Menambahkan bookmark lowongan | Ya |
| `GET` | `/bookmarks` | Mengambil seluruh bookmark user | Ya |
| `GET` | `/jobs/:jobId/bookmark/:bookmarkId` | Mengambil detail bookmark | Ya |
| `DELETE` | `/jobs/:jobId/bookmark` | Menghapus bookmark lowongan | Ya |
| `GET` | `/profile` | Mengambil profil user terautentikasi | Ya |
| `GET` | `/profile/applications` | Mengambil lamaran user terautentikasi | Ya |
| `GET` | `/profile/bookmarks` | Mengambil bookmark user terautentikasi | Ya |
