<?php

namespace App\Models;

use CodeIgniter\Model;

class BarangModel extends Model
{
    // 1. SESUAIKAN: Ubah dari 'barangs' menjadi 'barang' sesuai file SQL Anda
    protected $table            = 'barang'; 
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['user_id', 'kategori_id', 'supplier_id', 'kode_barang', 'nama_barang', 'stok', 'harga'];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    // Dates (Set false karena di struktur tabel barang tidak ada kolom created_at/updated_at)
    protected $useTimestamps = false;

    /**
     * Method Custom untuk mengambil data barang lengkap dengan nama kategori dan supplier.
     * Ini sangat berguna untuk mempermudah visualisasi tabel data di Frontend SPA VueJS nanti.
     */
    public function getBarangLengkap(int $userId)
    {
        return $this->select('barang.*, kategori.nama_kategori, supplier.nama_supplier')
                    ->join('kategori', 'kategori.id = barang.kategori_id', 'left')
                    ->join('supplier', 'supplier.id = barang.supplier_id', 'left')
                    ->where('barang.user_id', $userId)
                    ->findAll();
    }
}