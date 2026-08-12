<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn () => response()->json([
    'name' => config('app.name'),
    'docs' => 'Consulte o README.md para a lista de endpoints em /api.',
]));
