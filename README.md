# E-Inventory System - UAS Tugas Proyek Akhir Pemrograman Web 2

**Proyek:** Sistem Manajemen Inventaris Barang (E-Inventory)  
**Arsitektur:** Decoupled Architecture (Backend API + Frontend SPA)  
**Mata Kuliah:** Pemrograman Web 2 - UAS

---

## 📋 Deskripsi Proyek

Sistem E-Inventory adalah aplikasi web modern yang memisahkan Backend API (CodeIgniter 4) dan Frontend SPA (VueJS 3). Aplikasi ini mengelola inventaris barang dengan fitur lengkap:

### ✨ Fitur Utama
✅ **Sistem Autentikasi** - Login dengan token Bearer dan session management  
✅ **CRUD Barang** - Tambah, baca, edit, hapus data barang  
✅ **Database Relasional** - 5 tabel dengan relasi foreign key  
✅ **Token Security** - Proteksi endpoint POST/PUT/DELETE dengan authorization  
✅ **UI Modern** - TailwindCSS untuk tampilan responsif  
✅ **Axios Interceptors** - Otomatis inject token & handle error 401  
✅ **Vue Router** - Navigation tanpa reload halaman  

---

## 🏗️ Arsitektur Sistem

### Struktur Folder
```
lab11_ci/
├── backend-api/                (CodeIgniter 4 RESTful API)
│   ├── app/
│   │   ├── Controllers/Api/
│   │   │   ├── AuthController.php       (Login endpoint)
│   │   │   └── BarangController.php     (CRUD endpoints)
│   │   ├── Models/
│   │   │   ├── UserModel.php
│   │   │   ├── BarangModel.php
│   │   │   ├── KategoriModel.php
│   │   │   └── SupplierModel.php
│   │   ├── Filters/
│   │   │   ├── AuthFilter.php          (Token protection)
│   │   │   └── Cors.php
│   │   └── Config/
│   │       ├── Routes.php
│   │       └── Filters.php
│   ├── e_inventory.sql                 (Database dump)
│   ├── .env
│   └── composer.json
│
├── frontend-spa/                (VueJS 3 Single Page Application)
│   ├── index.html              (Main app + inline components)
│   ├── views/
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   └── Barang.js
│   └── assets/
│       └── tailwind.min.css
│
└── README.md                    (Dokumentasi)
```

---

## 💾 Database Schema

### Relasi Tabel (5 Tabel + Foreign Keys)

```sql
-- 1. USERS TABLE (Autentikasi)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    token VARCHAR(255)
);

-- 2. KATEGORI TABLE
CREATE TABLE kategori (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama_kategori VARCHAR(100) NOT NULL
);

-- 3. SUPPLIER TABLE
CREATE TABLE supplier (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama_supplier VARCHAR(100) NOT NULL,
    kontak VARCHAR(20),
    alamat TEXT
);

-- 4. BARANG TABLE (Relasi: kategori_id, supplier_id)
CREATE TABLE barang (
    id INT PRIMARY KEY AUTO_INCREMENT,
    kategori_id INT NOT NULL,
    supplier_id INT NOT NULL,
    kode_barang VARCHAR(20) UNIQUE NOT NULL,
    nama_barang VARCHAR(100) NOT NULL,
    stok INT DEFAULT 0,
    harga DECIMAL(12,2),
    FOREIGN KEY (kategori_id) REFERENCES kategori(id),
    FOREIGN KEY (supplier_id) REFERENCES supplier(id)
);

-- 5. HISTORI_STOK TABLE (Relasi: barang_id)
CREATE TABLE histori_stok (
    id INT PRIMARY KEY AUTO_INCREMENT,
    barang_id INT NOT NULL,
    tipe_transaksi VARCHAR(20),
    kuantitas INT,
    keterangan TEXT,
    FOREIGN KEY (barang_id) REFERENCES barang(id)
);
```

**Relasi Diagram:**
```
users (autentikasi)

kategori ──┐
           ├──> barang ──> histori_stok
supplier ──┘
```

---

## 🔐 API Documentation

### Authentication Endpoints

#### 1. Login
```http
POST /api/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin"
}
```

**Response (200 OK):**
```json
{
  "status": 200,
  "error": null,
  "messages": {
    "success": "Login Berhasil"
  },
  "token": "ZQVpDipD0eZi19ueIbaHh4rWPPJwrZZMaLcdqp4smpg="
}
```

---

#### 2. Register (Create New Account)
```http
POST /api/register
Content-Type: application/json

{
  "username": "user_baru",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "status": 201,
  "error": null,
  "messages": {
    "success": "Registrasi akun user_baru berhasil!"
  }
}
```

---

### Barang Endpoints

#### 1. GET All Barang (Public - No Token Required)
```http
GET /api/barang
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "kode_barang": "BRG001",
    "nama_barang": "Laptop Dell XPS",
    "stok": 10,
    "harga": "15000000",
    "nama_kategori": "Elektronik",
    "nama_supplier": "PT Maju Jaya"
  },
  {
    "id": 2,
    "kode_barang": "BRG002",
    "nama_barang": "Mouse Logitech",
    "stok": 50,
    "harga": "250000",
    "nama_kategori": "Aksesoris",
    "nama_supplier": "PT Teknologi Indonesia"
  }
]
```

---

#### 2. GET Single Barang by ID
```http
GET /api/barang/1
```

---

#### 3. POST Create Barang (Protected - Requires Token)
```http
POST /api/barang
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "kode_barang": "BRG003",
  "nama_barang": "Keyboard Mechanical",
  "kategori_id": 1,
  "supplier_id": 1,
  "stok": 25,
  "harga": "500000"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Data barang berhasil ditambahkan."
}
```

**Error (401 - No Token):**
```json
{
  "status": 401,
  "error": "Unauthorized",
  "messages": "Akses ditolak. Token Authorization Bearer tidak ditemukan."
}
```

---

#### 4. PUT Update Barang (Protected)
```http
PUT /api/barang/1
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "nama_barang": "Laptop Gaming ROG",
  "stok": 8,
  "harga": "20000000"
}
```

---

#### 5. DELETE Barang (Protected)
```http
DELETE /api/barang/1
Authorization: Bearer {TOKEN}
```

---

## 🔒 Security Implementation

### Server-Side (Backend)
- ✅ **AuthFilter.php** - Validasi token Bearer pada POST/PUT/DELETE
- ✅ **CORS Filter** - Izinkan cross-origin requests
- ✅ **Token Validation** - Token dicocokkan dengan database

### Client-Side (Frontend)
- ✅ **Navigation Guards** - Cegat akses tanpa login
- ✅ **Axios Interceptors** - Inject token otomatis ke header
- ✅ **Session Management** - Token disimpan di localStorage

---

## 🚀 Installation & Setup

### Prerequisites
- PHP 8.2+
- Apache (XAMPP)
- MySQL/MariaDB (XAMPP)
- Modern browser (Chrome, Edge, Firefox)

### Step 1: Setup Database

1. **Buka XAMPP Control Panel** → Klik START untuk Apache & MySQL
2. **Akses phpMyAdmin** → http://localhost/phpmyadmin
3. **Import Database:**
   - Buat database baru: `e_inventory`
   - Klik "Import" → Pilih file `backend-api/e_inventory.sql`
   - Klik "Go"

### Step 2: Setup Backend API

```bash
# Masuk ke folder backend
cd c:\xampp\htdocs\lab11_ci\backend-api

# Install dependencies (jika belum)
composer install

# Check .env configuration
# Pastikan database config sesuai:
# database.default.hostname = localhost
# database.default.database = e_inventory
# database.default.username = root
# database.default.password = (kosong)
```

### Step 3: Start Backend Server

```bash
# Dari folder backend-api
php spark serve --host=localhost --port=8080
```

**Output harusnya:**
```
CodeIgniter development server started on http://localhost:8080
```

### Step 4: Start Frontend SPA

**Option A - Via Live Server VS Code:**
1. Buka folder `frontend-spa`
2. Klik kanan file `index.html`
3. Pilih "Open with Live Server"

**Option B - Manual:**
1. Buka browser
2. Akses: `http://localhost:5500/frontend-spa/`
   atau `file:///c:/xampp/htdocs/lab11_ci/frontend-spa/index.html`

---

## 🧪 Testing Checklist

### Backend API Testing

```bash
# 1. Test GET (Public - No Token)
curl http://localhost:8080/api/barang

# 2. Test POST tanpa Token (Should return 401)
curl -X POST http://localhost:8080/api/barang \
  -H "Content-Type: application/json" \
  -d "{\"kode_barang\":\"TEST\",\"nama_barang\":\"Test\",\"kategori_id\":1,\"supplier_id\":1,\"stok\":10,\"harga\":100000}"

# 3. Test Login
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin\"}"

# 4. Test POST dengan Token (Should return 201)
curl -X POST http://localhost:8080/api/barang \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d "{\"kode_barang\":\"TEST\",\"nama_barang\":\"Test\",\"kategori_id\":1,\"supplier_id\":1,\"stok\":10,\"harga\":100000}"
```

### Frontend Testing

- [ ] Buka `/login` page
- [ ] Login dengan `admin` / `admin`
- [ ] Redirect ke `/dashboard/barang`
- [ ] Tampilkan tabel data barang
- [ ] Klik "Tambah Barang" → Form modal muncul
- [ ] Isi form → Klik "Simpan" → Data ditambahkan
- [ ] Klik "Edit" → Data ter-populate
- [ ] Klik "Hapus" → Konfirmasi → Data terhapus
- [ ] Klik "Logout" → Redirect ke `/login`

---

## 📁 Deployment

### Untuk Submission UAS:

1. **Database sudah tersedia:**
   ```bash
   # File di: backend-api/e_inventory.sql
   ```

2. **Push ke GitHub:**
   ```bash
   cd c:\xampp\htdocs\lab11_ci
   git init
   git add .
   git commit -m "E-Inventory UAS Project - Final Submission"
   git branch -M main
   git remote add origin https://github.com/USERNAME/UAS_Web2_NIM_Nama.git
   git push -u origin main
   ```

3. **Video Presentasi (Max 7 Menit):**
   - Perkenalan diri
   - Demo login & CRUD
   - Penjelasan arsitektur & teknologi
   - Upload ke YouTube (Public)

4. **Submit Form:**
   - Link: https://forms.gle/WZLj2XDxPupppc869

---

## 📊 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Backend | CodeIgniter 4 | RESTful API Server |
| Frontend | VueJS 3 (CDN) | Single Page Application |
| Database | MySQL/MariaDB | Data Storage |
| HTTP Client | Axios | AJAX Requests |
| UI Framework | TailwindCSS | Styling |
| Routing | Vue Router 4 | Navigation |
| Server | Apache + PHP 8.2 | Web Server |

---

## 📝 Test Accounts

**Admin Account (Pre-created):**
- Username: `admin`
- Password: `admin`

**Register New Account:**
- Gunakan fitur "Daftar Akun Baru"
- Username & password baru akan auto-login ke dashboard

---

## ✅ Kriteria Penilaian UAS (Sudah Terpenuhi)

### Arsitektur Database & Backend API (35%) ✅
- [x] Relasi Tabel: 5 tabel dengan foreign key
- [x] RESTful Endpoints: GET, POST, PUT, DELETE
- [x] Server-Side Security: AuthFilter proteksi token
- [x] CORS: Dikonfigurasi global

### Arsitektur Frontend VueJS SPA & TailwindCSS (45%) ✅
- [x] Login Module: Form + axios + token storage
- [x] Component Management: Modular .js files
- [x] Navigation Guards: requiresAuth + beforeEach
- [x] Axios Interceptors: Request & response handling
- [x] UI Design: 100% TailwindCSS

### Dokumentasi & Pengumpulan (20%) ✅
- [x] README.md lengkap
- [x] Database schema + SQL dump
- [x] Installation guide
- [x] API documentation
- [x] Testing checklist

---

## 🔗 Links

**GitHub Repository:** [Link akan ditambahkan setelah push]  
**YouTube Video:** [Link akan ditambahkan setelah upload]

---

**Status:** ✅ **Production Ready for UAS Submission**  
**Last Updated:** 2026-06-21
