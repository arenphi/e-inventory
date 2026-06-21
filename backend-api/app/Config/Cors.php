<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

/**
 * Cross-Origin Resource Sharing (CORS) Configuration
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
 */
class Cors extends BaseConfig
{
    /**
     * The default CORS configuration.
     */
    public array $default = [
        /**
         * Origins untuk header `Access-Control-Allow-Origin`.
         * Diubah menjadi ['*'] agar menerima request dari origin manapun (termasuk file lokal frontend).
         */
        'allowedOrigins' => ['*'],

        /**
         * Origin regex patterns untuk header `Access-Control-Allow-Origin`.
         */
        'allowedOriginsPatterns' => [],

        /**
         * Weather to send the `Access-Control-Allow-Credentials` header.
         */
        'supportsCredentials' => false,

        /**
         * Set headers to allow.
         * Diubah menjadi ['*'] agar mengizinkan semua jenis header request (Content-Type, Authorization, dll).
         */
        'allowedHeaders' => ['*'],

        /**
         * Set headers to expose.
         */
        'exposedHeaders' => [],

        /**
         * Set methods to allow.
         * Tentukan HTTP Method apa saja yang diperbolehkan untuk operasi RESTful API.
         */
        'allowedMethods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

        /**
         * Set how many seconds the results of a preflight request can be cached.
         */
        'maxAge' => 7200,
    ];
}