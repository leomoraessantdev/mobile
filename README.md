# Módulo de Agendamento de Consultas

Aplicação de demonstração para agendar consultas médicas, consultar o histórico
de atendimentos de um paciente, ver os detalhes de uma consulta e cancelar
aquelas que ainda podem ser canceladas.

O projeto tem duas partes independentes:

- **`backend/`** — API REST em Laravel, dona de todas as regras de negócio.
- **`mobile/`** — aplicativo React Native (Expo) que consome essa API.

Não há cadastro, login nem autenticação: o aplicativo trabalha o tempo todo com
um único paciente de demonstração criado pelo seeder.

## Tecnologias

**Backend**

- PHP 8.2
- Laravel 12
- SQLite
- PHPUnit

**Mobile**

- React Native 0.86 com Expo SDK 57
- JavaScript (sem TypeScript)
- React Navigation (native stack)
- Axios
- react-native-calendars

## Estrutura

```
.
├── backend/
│   ├── app/
│   │   ├── Enums/AppointmentStatus.php
│   │   ├── Exceptions/BusinessRuleException.php
│   │   ├── Http/Controllers/
│   │   ├── Http/Requests/
│   │   ├── Http/Resources/
│   │   ├── Models/
│   │   └── Services/AppointmentService.php
│   ├── database/{migrations,seeders,factories}/
│   ├── routes/api.php
│   ├── tests/Feature/
│   └── .env.example
├── mobile/
│   ├── src/
│   │   ├── api/          camada HTTP (Axios)
│   │   ├── components/   peças reutilizáveis de UI
│   │   ├── hooks/        ciclo carregando/erro/conteúdo
│   │   ├── navigation/   pilha de telas
│   │   ├── screens/      uma tela por passo do fluxo
│   │   ├── theme/        cores, espaçamentos e tipografia
│   │   └── utils/        configuração, datas e tradução de erros
│   ├── App.js
│   └── .env.example
└── README.md
```

## Pré-requisitos

- PHP 8.2 ou superior, com as extensões `pdo_sqlite`, `mbstring`, `openssl` e `zip`
- Composer 2
- Node.js 20 ou superior e npm
- Expo Go no celular, ou um emulador Android / simulador iOS

## Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed --force
php artisan serve --host=0.0.0.0 --port=8000
```

Duas observações sobre esses comandos:

- O `--force` no `migrate` evita a pergunta de confirmação e faz o Laravel criar
  o arquivo `database/database.sqlite` na primeira execução. Sem ele o comando
  funciona igual, só pede confirmação antes de criar o banco.
- O `--host=0.0.0.0` no `serve` é importante: sem ele o servidor só aceita
  conexões da própria máquina e o celular não consegue alcançar a API.

Para rodar os testes:

```bash
php artisan test
```

## Banco

SQLite, escolhido para que a avaliação não dependa de nenhum serviço externo.
O arquivo fica em `backend/database/database.sqlite` e é criado pelo próprio
`php artisan migrate` na primeira execução — não é preciso criar nada à mão.

Para recomeçar do zero a qualquer momento:

```bash
php artisan migrate:fresh --seed --force
```

Os seeders são idempotentes — rodar `php artisan db:seed` de novo não duplica
nada.

## Paciente de demonstração

| Campo | Valor           |
| ----- | --------------- |
| ID    | `1`             |
| Nome  | `João da Silva` |

O aplicativo envia esse ID em todas as requisições. Como não existe
autenticação, o `patient_id` é apenas mais um parâmetro validado pela API.

Além dele, os seeders criam 3 especialidades, 6 profissionais e 4 consultas de
exemplo — uma para cada status. As datas são relativas ao dia em que o seed
roda, então o exemplo "realizado" fica sempre no passado e os exemplos
"agendado" e "confirmado" sempre no futuro.

## Mobile

```bash
cd mobile
npm install
npx expo start
```

Depois basta ler o QR Code com o Expo Go, ou apertar `a` (Android), `i` (iOS)
ou `w` (navegador).

### Configuração da URL da API

A URL vive em um lugar só: `src/utils/config.js`.

Por padrão o app descobre o endereço sozinho. O Metro informa em qual host o
bundle foi servido, e esse host costuma ser exatamente a máquina onde a API
está rodando:

| Ambiente                     | Endereço usado                  |
| ---------------------------- | ------------------------------- |
| Dispositivo físico (Expo Go) | `http://IP_DA_MAQUINA:8000/api` |
| Emulador Android             | `http://10.0.2.2:8000/api`      |
| Simulador iOS / navegador    | `http://localhost:8000/api`     |

`localhost` nunca é usado em dispositivo físico: dentro do celular ele apontaria
para o próprio aparelho. No emulador Android o `10.0.2.2` é o apelido do host,
já que ali o loopback também é do próprio emulador.

Se a API estiver em outro endereço, copie `.env.example` para `.env` e preencha:

```
EXPO_PUBLIC_API_BASE_URL=http://192.168.0.10:8000/api
```

Reinicie o Expo depois de alterar o `.env`.

## API

Todas as respostas são JSON e o conteúdo vem embrulhado em `data`.

### `GET /api/specialties`

Lista as especialidades em ordem alfabética.

```json
{ "data": [{ "id": 1, "name": "Cardiologia" }] }
```

### `GET /api/professionals?specialty_id={id}`

Lista os profissionais. O filtro é opcional; quando informado, precisa
corresponder a uma especialidade existente (senão retorna `422`).

```json
{
  "data": [
    {
      "id": 1,
      "name": "Dra. Ana Oliveira",
      "specialty": { "id": 1, "name": "Cardiologia" }
    }
  ]
}
```

### `GET /api/appointments?patient_id={id}&status={status}`

Histórico do paciente, ordenado por data e horário. `patient_id` é obrigatório
e precisa existir; `status`, quando informado, precisa ser um dos quatro status
válidos.

```
GET /api/appointments?patient_id=1
GET /api/appointments?patient_id=1&status=agendado
```

### `POST /api/appointments`

Cria a consulta. O status **não** é aceito no corpo da requisição: quem define
é o backend.

```json
{
  "patient_id": 1,
  "professional_id": 1,
  "appointment_date": "2026-08-20",
  "appointment_time": "10:00",
  "notes": "Consulta de rotina"
}
```

Respostas possíveis:

| Código | Situação                                                            |
| ------ | ------------------------------------------------------------------- |
| `201`  | Consulta criada com status `agendado`                               |
| `400`  | Regra de negócio violada (horário ocupado)                          |
| `422`  | Erro de validação (data no passado, campo faltando, status enviado) |

```json
{ "message": "Este profissional já possui uma consulta neste horário." }
```

### `GET /api/appointments/{id}`

Detalhes completos, com paciente, profissional e especialidade já embutidos —
o aplicativo monta a tela inteira com uma única requisição.

```json
{
  "data": {
    "id": 1,
    "appointment_date": "2026-08-20",
    "appointment_time": "10:00",
    "status": "agendado",
    "status_label": "Agendado",
    "can_cancel": true,
    "notes": "Consulta de rotina",
    "patient": { "id": 1, "name": "João da Silva" },
    "professional": {
      "id": 1,
      "name": "Dra. Ana Oliveira",
      "specialty": { "id": 1, "name": "Cardiologia" }
    },
    "created_at": "2026-08-11T09:00:00-03:00"
  }
}
```

### `PATCH /api/appointments/{id}/cancel`

Muda o status para `cancelado` e devolve a consulta atualizada. O registro nunca
é apagado. Retorna `400` quando a consulta já está realizada ou cancelada, e
`404` quando o ID não existe.

## Regras de negócio

Todas moram no backend. O aplicativo repete algumas delas apenas para dar um
retorno mais rápido ao usuário.

| Regra     | Descrição                                                              | Onde é aplicada                                                                 |
| --------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **RN-01** | Não é possível agendar em data ou horário que já passou                | `StoreAppointmentRequest::after()` — data e hora são avaliadas juntas           |
| **RN-02** | Um profissional não pode ter duas consultas no mesmo horário           | `AppointmentService::guardAgainstSlotConflict()` + índice único parcial no banco |
| **RN-03** | Toda consulta pertence a um paciente e a um profissional válidos       | `StoreAppointmentRequest` (`exists`) + chaves estrangeiras                       |
| **RN-04** | O status inicial é sempre `agendado`                                   | `AppointmentService::schedule()`; o campo `status` é `prohibited` na entrada     |
| **RN-05** | Os únicos status são `agendado`, `confirmado`, `realizado`, `cancelado` | `AppointmentStatus` (enum), usado no cast do model e na validação do filtro      |
| **RN-06** | Só consultas `agendado` ou `confirmado` podem ser canceladas           | `AppointmentService::cancel()`                                                   |

## Decisões técnicas

**Camadas do backend.** Controller recebe e devolve HTTP, Form Request valida a
entrada, Service concentra a regra de negócio e API Resource formata a saída.
Não há repositórios nem interfaces: para quatro tabelas isso só adicionaria
arquivos sem melhorar nada. O Eloquent já é a camada de acesso a dados.

**Conflito de horário (RN-02).** É a única regra com risco real de corrida, e
por isso tem duas defesas. Na aplicação, a verificação e a criação acontecem
dentro da mesma transação. No banco, existe um índice único parcial:

```sql
CREATE UNIQUE INDEX appointments_active_slot_unique
ON appointments (professional_id, appointment_date, appointment_time)
WHERE status <> 'cancelado'
```

O `WHERE` é o que faz consultas canceladas devolverem o horário para a agenda —
um índice único comum bloquearia o horário para sempre. Se duas requisições
simultâneas passarem pela verificação, o índice barra a segunda e o
`UniqueConstraintViolationException` é convertido na mesma mensagem de erro,
então o cliente vê sempre a mesma resposta. Índices parciais existem no SQLite
e no PostgreSQL; em outros bancos a migration cria só o índice composto e a
garantia fica com a camada de serviço.

**Formato de data e hora.** O cast `date` padrão do Eloquent gravaria
`2026-08-20 00:00:00` em uma coluna `date`, o que atrapalharia a comparação
direta no `WHERE` e, por consequência, o índice acima. Por isso o model converte
explicitamente para `YYYY-MM-DD` e `HH:MM:SS` na escrita, e devolve `HH:MM` na
leitura.

**Status.** Um enum `string` (`AppointmentStatus`) é a fonte única da verdade:
ele alimenta o cast do model, o `default` da migration, a validação do filtro, o
rótulo exibido no app e a decisão de "pode cancelar". Não existe status escrito
à mão em nenhum outro lugar.

**Códigos HTTP.** `422` para erro de validação de entrada e `400` para regra de
negócio, como pede a especificação. Um `409 Conflict` seria igualmente
defensável para o choque de horários; ficou `400` para manter um único código
para todas as violações de regra.

**Resposta única para lista e detalhe.** `AppointmentResource` já traz paciente,
profissional e especialidade. Assim a tela de detalhes não precisa de
requisições extras, e não há duas representações da mesma entidade para manter
em sincronia.

**Consumo da API no aplicativo.** Nenhuma tela chama o Axios diretamente. As
funções ficam em `src/api/`, sobre uma instância única do Axios cuja `baseURL`
vem de `src/utils/config.js`. O hook `useApiData` cuida do ciclo
carregando / erro / conteúdo e do pull-to-refresh, o que evita repetir o mesmo
`useState` de três estados em cada tela.

**Tratamento de erros.** `toFriendlyMessage()` é o único ponto que interpreta
falhas de requisição: prioriza o primeiro erro de validação, depois a mensagem
do backend, e só cai em um texto genérico se não houver nada melhor. Falha de
rede vira "não foi possível falar com o servidor"; erro `500` não mostra a
mensagem técnica do Laravel. O usuário nunca vê "AxiosError" ou "Request failed
with status code 422".

**Confirmação em Modal, não em Alert.** O `Alert` do React Native não existe no
Expo Web. O `ConfirmDialog` usa `Modal` e se comporta igual em Android, iOS e
navegador.

**Calendário em JavaScript puro.** `react-native-calendars` no lugar do date
picker nativo: não depende de módulo nativo, o `minDate` bloqueia visualmente as
datas passadas e o comportamento é idêntico nas três plataformas.

## Funcionalidades concluídas

**Backend**

- [x] Migrations das quatro tabelas, com chaves estrangeiras e índices
- [x] Seeders com 3 especialidades, 6 profissionais, 1 paciente e 4 consultas
- [x] Seeders idempotentes
- [x] Regras RN-01 a RN-06
- [x] Proteção contra horário duplicado na aplicação e no banco
- [x] Consultas canceladas liberam o horário
- [x] Os seis endpoints da especificação
- [x] Validação por Form Request com mensagens em português
- [x] Respostas JSON padronizadas, inclusive nos erros 404 e 500
- [x] CORS configurado para `/api/*`
- [x] 27 testes automatizados cobrindo as regras de negócio

**Mobile**

- [x] Tela inicial com dados do paciente e acesso aos dois fluxos
- [x] Agendamento em 4 etapas: especialidade, profissional, data e horário, revisão
- [x] Especialidades e profissionais carregados da API
- [x] Datas passadas bloqueadas no calendário
- [x] Tela de confirmação com caminhos para a consulta, o histórico e o início
- [x] Histórico com filtro por status consultado na API
- [x] Atualização manual por botão no cabeçalho e por pull-to-refresh
- [x] Recarga automática ao voltar dos detalhes
- [x] Estados de carregando, erro (com "tentar novamente") e vazio em todas as telas
- [x] Detalhes completos com botão de cancelar apenas quando permitido
- [x] Cancelamento com confirmação e retorno visual
- [x] Mensagens de erro da API repassadas ao usuário
- [x] Botões bloqueados durante requisições, evitando envio duplicado

## Pendências

Nenhuma. O escopo descrito no desafio está implementado e testado.

## Como testar

Com o backend rodando (`php artisan serve --host=0.0.0.0 --port=8000`) e o app
aberto:

1. Abra o aplicativo — a tela inicial mostra João da Silva.
2. Toque em **Agendar consulta**.
3. Escolha **Cardiologia** e toque em Continuar.
4. Escolha **Dra. Ana Oliveira** e toque em Continuar.
5. Escolha uma data futura no calendário — repare que os dias anteriores a hoje
   não são clicáveis.
6. Escolha um horário e, se quiser, escreva uma observação.
7. Toque em **Revisar agendamento** e confira os dados.
8. Toque em **Confirmar agendamento**. A tela de sucesso mostra o status inicial
   `Agendado`.
9. Toque em **Ir para o histórico** — a nova consulta aparece na lista.
10. Toque nela para abrir os detalhes.
11. Toque em **Cancelar consulta** e confirme no diálogo. O status muda para
    `Cancelado`, o aviso de sucesso aparece e o botão some.
12. Volte ao histórico e filtre por **Cancelado** para ver a consulta lá. O
    botão ↻ no cabeçalho recarrega a lista a qualquer momento.

### Testando o conflito de horário (RN-02)

1. Agende uma consulta com a Dra. Ana Oliveira em uma data e horário livres.
2. Repita exatamente o mesmo agendamento: mesma profissional, mesma data, mesmo
   horário.
3. Na tela de revisão aparece: *"Não foi possível agendar: Este profissional já
   possui uma consulta neste horário."*
4. Abra essa consulta no histórico e cancele.
5. Agende de novo no mesmo horário — agora funciona, porque uma consulta
   cancelada não ocupa mais a agenda.

### Testando a data no passado (RN-01)

O calendário não deixa escolher um dia que já passou, mas a regra também vale
sem o aplicativo:

```bash
curl -X POST http://localhost:8000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"patient_id":1,"professional_id":1,"appointment_date":"2020-01-01","appointment_time":"10:00"}'
```

Resposta `422`:

```json
{
  "message": "Não é possível agendar uma consulta em data ou horário que já passou.",
  "errors": {
    "appointment_date": [
      "Não é possível agendar uma consulta em data ou horário que já passou."
    ]
  }
}
```
