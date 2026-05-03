# Zentro — Dynamic BFF Execution Engine

Motor de execução declarativo para composição Backend-for-Frontend. O Zentro orquestra chamadas a múltiplos serviços backend através de uma DSL de fluxos (flows), resolve dependências entre steps, executa steps independentes em paralelo e compõe uma resposta unificada.

## Arquitetura

```
┌──────────────────────────────────────────────────────┐
│  HTTP Layer — NestJS  (src/app/)                     │
│                                                      │
│  ┌──────────────────┐    ┌──────────────────────┐    │
│  │ FlowController   │    │ ExecutionController  │    │
│  │ /v1/flows        │    │ /v1/executions       │    │
│  └────────┬─────────┘    └──────────┬───────────┘    │
│           │                         │                │
│  ┌────────▼─────────┐    ┌──────────▼───────────┐    │
│  │ FlowService      │    │ ExecutionService     │    │
│  └────────┬─────────┘    └──────────┬───────────┘    │
│           │                         │                │
│  ┌────────▼─────────────────────────▼───────────┐    │
│  │         TypeORM — MongoRepository            │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
├──────────────────────────────────────────────────────┤
│  Core Engine — Pure TypeScript  (src/core/)          │
│                                                      │
│  ┌──────────────┐  ┌────────────────┐                │
│  │ FlowEngine   │  │ ResponseEngine │                │
│  └──────────────┘  └────────────────┘                │
│  ┌──────────────┐                                    │
│  │ HttpExecutor │                                    │
│  └──────────────┘                                    │
│                                                      │
│  Zero NestJS dependencies. Testável de forma isolada │
└──────────────────────────────────────────────────────┘
```

## Princípio Central

O NestJS é usado **apenas** como camada HTTP fina. O core engine (`src/core/`) não tem nenhum import ou decorator do NestJS — pode ser usado standalone.

## Quick Start

```bash
# Instalar dependências
npm install

# Subir em modo dev (watch)
npm run start:dev

# Build de produção
npm run build
npm run start:prod
```

## Variáveis de Ambiente

| Variável    | Descrição                  | Default                          |
|-------------|----------------------------|----------------------------------|
| `PORT`      | Porta do servidor HTTP     | `3000`                           |
| `MONGO_URI` | Connection string MongoDB  | `mongodb://localhost:27017`      |
| `MONGO_DB`  | Nome do banco              | `ZENTRO`                         |

## Estrutura do Projeto

```
src/
├── core/                          # DOMÍNIO PURO — sem NestJS
│   ├── engines/
│   │   ├── flow.engine.ts         # Motor de execução de fluxos
│   │   └── response.engine.ts     # Composição de resposta
│   ├── executors/
│   │   └── http.executor.ts       # Executor de chamadas HTTP
│   └── index.ts                   # Barrel export do core
│
├── app/                           # Camada HTTP — NestJS
│   ├── flow/
│   │   ├── flow.controller.ts     # CRUD /v1/flows
│   │   ├── flow.service.ts        # Lógica de persistência
│   │   ├── flow.entity.ts         # Entidade TypeORM (MongoDB)
│   │   ├── flow.mapper.ts         # Entity → Response DTO
│   │   ├── flow.module.ts
│   │   └── dto/
│   │       ├── create-flow.dto.ts
│   │       ├── update-flow.dto.ts
│   │       └── flow-response.dto.ts
│   │
│   ├── execution/
│   │   ├── execution.controller.ts  # GET /v1/executions
│   │   ├── execution.service.ts
│   │   ├── execution.entity.ts
│   │   ├── execution.mapper.ts
│   │   ├── execution.module.ts
│   │   └── dto/
│   │       └── execution-response.dto.ts
│   │
│   └── modules/
│       └── app.module.ts          # Módulo raiz (TypeORM + módulos)
│
└── main.ts                        # Bootstrap NestJS
```

## API

### Flows — `/v1/flows`

| Método   | Rota            | Descrição              |
|----------|-----------------|------------------------|
| `POST`   | `/v1/flows`     | Criar um flow          |
| `GET`    | `/v1/flows`     | Listar todos os flows  |
| `GET`    | `/v1/flows/:id` | Buscar flow por ID     |
| `PATCH`  | `/v1/flows/:id` | Atualizar flow parcial |
| `DELETE` | `/v1/flows/:id` | Remover flow           |

#### Exemplo — Criar Flow

```bash
curl -X POST http://localhost:3000/v1/flows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "get-user-dashboard",
    "type": "QUERY",
    "steps": [
      {
        "stepId": "user",
        "method": "GET",
        "url": "http://users-service/users/{input.userId}",
        "nextSteps": ["orders"]
      },
      {
        "stepId": "orders",
        "method": "GET",
        "url": "http://orders-service/orders?userId={steps.user.id}"
      }
    ],
    "responseConfig": {
      "mapping": {
        "name": "steps.user.name",
        "orders": "steps.orders"
      }
    }
  }'
```

### Executions — `/v1/executions`

| Método | Rota                  | Descrição                  |
|--------|-----------------------|----------------------------|
| `GET`  | `/v1/executions`      | Listar todas as execuções  |
| `GET`  | `/v1/executions/:id`  | Buscar execução por ID     |

## DSL — Modelo de Flow

```jsonc
{
  "name": "get-user-dashboard",
  "type": "QUERY",              // QUERY | COMMAND
  "steps": [
    {
      "stepId": "user",
      "method": "GET",          // GET | POST | PUT | PATCH | DELETE
      "url": "http://users-service/users/{input.userId}",
      "headers": {},            // opcional
      "body": {},               // opcional
      "params": {},             // opcional
      "nextSteps": ["orders"]   // opcional — dependências
    }
  ],
  "responseConfig": {           // opcional
    "mapping": {
      "name": "steps.user.name",
      "orders": "steps.orders"
    }
  }
}
```

## Modelo de Execução (planejado)

1. Receber input e montar contexto `{ input, steps: {} }`
2. Ordenar steps topologicamente em camadas paralelas
3. Executar cada camada (`Promise.all` para steps independentes)
4. Armazenar resultado de cada step no contexto
5. Mapear a resposta final usando `responseConfig.mapping`

## Tech Stack

| Camada       | Tecnologia                          |
|--------------|-------------------------------------|
| Runtime      | Node.js + TypeScript (strict)       |
| HTTP         | NestJS 10                           |
| Persistência | MongoDB via TypeORM                 |
| Validação    | class-validator + class-transformer |
| HTTP Client  | undici (connection pooling)         |

## Scripts

| Comando            | Descrição                           |
|--------------------|-------------------------------------|
| `npm run build`    | Compila o projeto                   |
| `npm run start`    | Inicia em modo produção             |
| `npm run start:dev`| Inicia em modo dev com watch        |
| `npm run start:prod`| Inicia a partir do build (`dist/`) |
