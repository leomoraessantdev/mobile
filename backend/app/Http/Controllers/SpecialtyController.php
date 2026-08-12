<?php

namespace App\Http\Controllers;

use App\Http\Resources\SpecialtyResource;
use App\Models\Specialty;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SpecialtyController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return SpecialtyResource::collection(
            Specialty::query()->orderBy('name')->get()
        );
    }
}
