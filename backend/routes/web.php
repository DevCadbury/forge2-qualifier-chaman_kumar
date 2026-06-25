<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Kanban API',
        'version' => '1.0.0',
        'api_docs' => '/api/v1',
    ]);
});
