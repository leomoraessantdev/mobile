<?php

/*
| O app mobile (Expo Web / dispositivo físico) consome a API a partir de outra
| origem, então o CORS precisa liberar as rotas /api/*. As origens permitidas
| vêm de CORS_ALLOWED_ORIGINS para que o valor "*" fique restrito ao ambiente
| de desenvolvimento. Como não usamos cookies/sessão, supports_credentials
| permanece desligado.
*/

$origins = array_filter(array_map(
    'trim',
    explode(',', (string) env('CORS_ALLOWED_ORIGINS', '*'))
));

return [

    'paths' => ['api/*'],

    'allowed_methods' => ['GET', 'POST', 'PATCH', 'OPTIONS'],

    'allowed_origins' => $origins ?: ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Accept', 'Content-Type', 'X-Requested-With'],

    'exposed_headers' => [],

    'max_age' => 3600,

    'supports_credentials' => false,

];
