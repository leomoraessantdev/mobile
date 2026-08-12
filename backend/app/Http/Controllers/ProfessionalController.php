<?php

namespace App\Http\Controllers;

use App\Http\Requests\IndexProfessionalRequest;
use App\Http\Resources\ProfessionalResource;
use App\Models\Professional;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProfessionalController extends Controller
{
    public function index(IndexProfessionalRequest $request): AnonymousResourceCollection
    {
        $professionals = Professional::query()
            ->with('specialty')
            ->when(
                $request->validated('specialty_id'),
                fn (Builder $query, int $specialtyId) => $query->where('specialty_id', $specialtyId)
            )
            ->orderBy('name')
            ->get();

        return ProfessionalResource::collection($professionals);
    }
}
