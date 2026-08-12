<?php

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

/**
 * Regra de negócio violada. O Laravel chama render() automaticamente, então a
 * resposta JSON sai padronizada sem precisar de try/catch nos controllers.
 */
class BusinessRuleException extends RuntimeException
{
    public function render(Request $request): JsonResponse
    {
        return response()->json(['message' => $this->getMessage()], 400);
    }
}
