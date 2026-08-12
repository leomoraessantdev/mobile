<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ProfessionalController;
use App\Http\Controllers\SpecialtyController;
use Illuminate\Support\Facades\Route;

Route::get('specialties', [SpecialtyController::class, 'index']);
Route::get('professionals', [ProfessionalController::class, 'index']);

Route::get('appointments', [AppointmentController::class, 'index']);
Route::post('appointments', [AppointmentController::class, 'store']);
Route::get('appointments/{appointment}', [AppointmentController::class, 'show']);
Route::patch('appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
