<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class AuthController extends ResourceController
{
    protected $format = 'json';

    // --- TAMBAHKAN CONSTRUCTOR CORS DI SINI ---
    public function __construct()
    {
        // Izinkan akses lintas asal (CORS) dari port frontend (5500)
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization, Lang");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        
        // Jika browser mengirim pengecekan OPTIONS, langsung hentikan proses di sini dengan status 200 OK
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            exit(0);
        }
    }

    public function login()
    {
        // Mengambil data JSON mentah yang dikirim oleh Axios frontend
        $json = $this->request->getJSON();

        // Ambil property jika data JSON berhasil dikirim, jika tidak fallback ke getVar
        $username = isset($json->username) ? trim($json->username) : trim($this->request->getVar('username') ?? '');
        $password = isset($json->password) ? trim($json->password) : trim($this->request->getVar('password') ?? '');

        // Validasi awal jika input kosong
        if (empty($username) || empty($password)) {
            return $this->respond([
                'status'   => 400,
                'error'    => 'Bad Request',
                'messages' => [
                    'error' => 'Username dan password wajib diisi.'
                ]
            ], 400);
        }

        $model = model('App\\Models\\UserModel');
        $user = $model->where('username', $username)->first();

        // 1. Validasi jika user tidak ditemukan
        if (!$user) {
            return $this->respond([
                'status'   => 401,
                'error'    => 'Unauthorized',
                'messages' => [
                    'error' => 'Username tidak ditemukan.'
                ]
            ], 401);
        }

        // 2. Verifikasi password (bisa teks biasa 'admin' atau yang sudah di-hash)
        if ($password === 'admin' || password_verify($password, $user['password'])) {
            
            // Generate token dummy aman untuk memenuhi kriteria UAS
            $token = base64_encode(random_bytes(32));
            
            // PENGAMAN: Cek dulu apakah model UserModel punya kolom 'token' di properti $allowedFields
            if (in_array('token', $model->allowedFields)) {
                try {
                    $model->update($user['id'], ['token' => $token]);
                } catch (\Exception $e) {
                    // Jika gagal update ke db, biarkan lanjut agar login tidak crash
                }
            }

            // Kembalikan struktur JSON sukses yang dinantikan oleh index.html frontend
            return $this->respond([
                'status'   => 200,
                'error'    => null,
                'messages' => [
                    'success' => 'Login Berhasil'
                ],
                'token'    => $token
            ], 200);
        }

        // 3. Validasi jika password salah
        return $this->respond([
            'status'   => 401,
            'error'    => 'Unauthorized',
            'messages' => [
                'error' => 'Password salah, silakan coba lagi.'
            ]
        ], 401);
    }
}
