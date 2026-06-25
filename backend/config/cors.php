<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',
        'http://localhost:3000',
        // Production — replace with your exact Vercel URL once deployed
        'https://forge2-qualifier-chaman.vercel.app',
    ],

    'allowed_origins_patterns' => [
        // Allow all Vercel preview deployments (branch/PR previews)
        '#^https://forge2-qualifier-chaman.*\.vercel\.app$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
