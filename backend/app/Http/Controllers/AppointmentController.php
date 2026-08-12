<?php

namespace App\Http\Controllers;

use App\Http\Requests\IndexAppointmentRequest;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Services\AppointmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class AppointmentController extends Controller
{
    public function __construct(private readonly AppointmentService $appointments) {}

    public function index(IndexAppointmentRequest $request): AnonymousResourceCollection
    {
        return AppointmentResource::collection(
            $this->appointments->historyFor($request->integer('patient_id'), $request->status())
        );
    }

    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        $appointment = $this->appointments->schedule($request->validated());

        return AppointmentResource::make($appointment->load(['patient', 'professional.specialty']))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Appointment $appointment): AppointmentResource
    {
        return AppointmentResource::make(
            $appointment->load(['patient', 'professional.specialty'])
        );
    }

    public function cancel(Appointment $appointment): AppointmentResource
    {
        return AppointmentResource::make($this->appointments->cancel($appointment));
    }
}
