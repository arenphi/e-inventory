<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

// Grup Rute untuk API
$routes->group('api', ['namespace' => 'App\Controllers\Api'], function($routes) {
    
    // 1. CEGAT REQUEST OPTIONS (PREFLIGHT) AGAR TIDAK 404 ATAU MEMBLOKIR AXIOS
    $routes->options('(:any)', function() {
        $response = response();
        $response->setHeader('Access-Control-Allow-Origin', '*');
        $response->setHeader('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization, Lang');
        $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        $response->setStatusCode(200);
        return $response->send();
    });

    // 2. ENDPOINT OTENTIKASI (POST)
    $routes->post('login', 'AuthController::login');       // Menuju AuthController::login
    $routes->post('register', 'Register::index');          // Menuju Register::index

    // 3. ENDPOINT RESOURCE DATA (PROTECTED - memerlukan token via AuthFilter)
    $routes->get('barang', 'BarangController::index', ['filter' => 'auth']);
    $routes->get('barang/(:num)', 'BarangController::show/$1', ['filter' => 'auth']);
    $routes->post('barang', 'BarangController::create', ['filter' => 'auth']);
    $routes->put('barang/(:num)', 'BarangController::update/$1', ['filter' => 'auth']);
    $routes->delete('barang/(:num)', 'BarangController::delete/$1', ['filter' => 'auth']);
});