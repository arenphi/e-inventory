<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\UserModel;

class Register extends BaseController
{
    use ResponseTrait;

    public function __construct()
    {
        // Izinkan CORS secara paksa sebelum metode lain dieksekusi
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization, Lang");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        
        // Jika request berupa Preflight OPTIONS dari browser, langsung selesaikan di sini dengan status 200 OK
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            exit(0);
        }
    }

    public function index()
    {
        // 1. Ambil input JSON dari Vue.js / Axios
        $json = $this->request->getJSON();
        
        if ($json) {
            $username = $json->username ?? null;
            $password = $json->password ?? null;
        } else {
            $username = $this->request->getVar('username');
            $password = $this->request->getVar('password');
        }

        // 2. Validasi Input Sederhana
        if (empty($username) || empty($password)) {
            return $this->failValidationErrors([
                'error' => 'Username dan Password wajib diisi!'
            ]);
        }

        // 3. Cek apakah username sudah terdaftar
        $userModel = new UserModel();
        $userLama = $userModel->where('username', $username)->first();
        if ($userLama) {
            return $this->fail('Username sudah digunakan! Silakan pilih username lain.', 400);
        }

        // 4. Struktur data untuk disimpan dengan enkripsi Bcrypt
        $dataStore = [
            'username' => $username,
            'password' => password_hash($password, PASSWORD_BCRYPT),
            'token'    => null
        ];

        // 5. Simpan ke Database
        if ($userModel->insert($dataStore)) {
            return $this->respondCreated([
                'status'   => 201,
                'error'    => null,
                'messages' => [
                    'success' => 'Registrasi akun admin berhasil!'
                ]
            ]);
        } else {
            return $this->fail('Gagal menyimpan data ke database.', 500);
        }
    }
}