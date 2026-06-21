<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\BarangModel;

class BarangController extends ResourceController
{
    protected $format = 'json';

    // Helper method to retrieve the currently logged in user based on Bearer Token
    private function getCurrentUser()
    {
        $authHeader = $this->request->getServer('HTTP_AUTHORIZATION');
        if ($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            $db = \Config\Database::connect();
            return $db->table('users')->getWhere(['token' => $token])->getRow();
        }
        return null;
    }

    // 1. GET ALL: http://localhost:8080/api/barang
    public function index()
    {
        $user = $this->getCurrentUser();
        if (!$user) {
            return $this->failUnauthorized('Akses ditolak. Token Authorization Bearer tidak ditemukan atau tidak valid.');
        }

        $model = new BarangModel();
        $data  = $model->getBarangLengkap((int)$user->id);
        return $this->respond($data, 200);
    }

    // 2. GET BY ID: http://localhost:8080/api/barang/(id)
    public function show($id = null)
    {
        $user = $this->getCurrentUser();
        if (!$user) {
            return $this->failUnauthorized('Akses ditolak.');
        }

        $model = new BarangModel();
        $data  = $model->where('user_id', $user->id)->find($id);
        if ($data) {
            return $this->respond($data, 200);
        }
        return $this->failNotFound('Data barang tidak ditemukan.');
    }

    // 3. POST / CREATE: Tambah barang baru via Frontend
    public function create()
    {
        $user = $this->getCurrentUser();
        if (!$user) {
            return $this->failUnauthorized('Akses ditolak.');
        }

        $model = new BarangModel();
        $data = $this->request->getJSON(true);
        $data['user_id'] = (int)$user->id;

        if ($model->insert($data)) {
            return $this->respondCreated(['status' => 'success', 'message' => 'Data barang berhasil ditambahkan.']);
        }
        return $this->fail($model->errors());
    }

    // 4. PUT / UPDATE: Edit barang berdasarkan ID
    public function update($id = null)
    {
        $user = $this->getCurrentUser();
        if (!$user) {
            return $this->failUnauthorized('Akses ditolak.');
        }

        $model = new BarangModel();
        $data = $this->request->getJSON(true);

        $existing = $model->where('user_id', $user->id)->find($id);
        if (!$existing) {
            return $this->failNotFound('Data barang tidak ditemukan.');
        }

        // Force the user_id to belong to the logged-in user
        $data['user_id'] = (int)$user->id;

        if ($model->update($id, $data)) {
            return $this->respond(['status' => 'success', 'message' => 'Data barang berhasil diubah.']);
        }
        return $this->fail($model->errors());
    }

    // 5. DELETE: Hapus barang berdasarkan ID
    public function delete($id = null)
    {
        $user = $this->getCurrentUser();
        if (!$user) {
            return $this->failUnauthorized('Akses ditolak.');
        }

        $model = new BarangModel();
        $existing = $model->where('user_id', $user->id)->find($id);
        if (!$existing) {
            return $this->failNotFound('Data barang tidak ditemukan.');
        }

        if ($model->delete($id)) {
            return $this->respondDeleted(['status' => 'success', 'message' => 'Data barang berhasil dihapus.']);
        }
        return $this->fail('Gagal menghapus data.');
    }
}