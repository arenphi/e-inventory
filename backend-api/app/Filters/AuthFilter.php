<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        // Ambil header Authorization dari HTTP Request
        $authHeader = $request->getServer('HTTP_AUTHORIZATION');
        
        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $response = service('response');
            $response->setStatusCode(401);
            return $response->setJSON([
                'status' => 401,
                'error' => 'Unauthorized',
                'messages' => 'Akses ditolak. Token Authorization Bearer tidak ditemukan.'
            ]);
        }

        $token = $matches[1];
        $db = \Config\Database::connect();
        $user = $db->table('users')->getWhere(['token' => $token])->getRow();

        // Jika token tidak cocok dengan database, lemparkan error 401
        if (!$user) {
            $response = service('response');
            $response->setStatusCode(401);
            return $response->setJSON([
                'status' => 401,
                'error' => 'Unauthorized',
                'messages' => 'Sesi Anda telah habis atau token tidak valid.'
            ]);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null) {}
}