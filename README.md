# Zentro

Zentro is a declarative BFF execution engine built with NestJS and MongoDB. It lets you define flows made of HTTP steps, execute them with input data, and shape the final response with a simple mapping object.

## Overview

- NestJS provides the HTTP API and persistence layer.
- The core execution engine lives in `src/core/`.
- Flow definitions are stored in MongoDB through TypeORM.
- Mongo `_id` values are UUIDs.
- Failed executions are persisted in `execution_errors` for inspection.

## Project Structure

```text
src/
├── app/
│   ├── common/
│   ├── execution-error/
│   ├── flow/
│   └── modules/
├── core/
│   ├── engines/
│   ├── enums/
│   └── executors/
└── main.ts
```

## Requirements

- Node.js 18+
- MongoDB

## Getting Started

```bash
npm install
npm run start:dev
```

Build for production:

```bash
npm run build
npm run start:prod
```

## Environment Variables

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | HTTP server port | `3000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `MONGO_DB` | Database name | `ZENTRO` |

## API

### Flows

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/v1/flows` | Create a flow |
| `GET` | `/v1/flows` | List all flows |
| `GET` | `/v1/flows/:id` | Get a flow by UUID `_id` |
| `PATCH` | `/v1/flows/:id` | Partially update a flow by UUID `_id` |
| `DELETE` | `/v1/flows/:id` | Delete a flow by UUID `_id` |
| `POST` | `/v1/flows/:id/execute` | Execute a flow by UUID `_id` |

### Execution Errors

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/v1/execution-errors` | List failed executions |
| `GET` | `/v1/execution-errors/:id` | Get a failed execution by UUID `_id` |

## Flow Definition

Flows are stored with steps keyed by `stepId`.

```json
{
  "name": "get-user-dashboard",
  "type": "QUERY",
  "steps": {
    "user": {
      "method": "GET",
      "url": "http://users-service/users/{input.userId}"
    },
    "orders": {
      "method": "GET",
      "url": "http://orders-service/orders",
      "params": {
        "userId": "{steps.user.id}"
      }
    }
  },
  "responseConfig": {
    "mapping": {
      "user": "steps.user",
      "orders": "steps.orders"
    }
  }
}
```

### Step Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `method` | `GET \| POST \| PUT \| PATCH \| DELETE` | Yes | HTTP method |
| `url` | `string` | Yes | Target URL |
| `headers` | `Record<string, string>` | No | Request headers |
| `body` | `Record<string, any>` | No | Request body |
| `params` | `Record<string, any>` | No | Query string parameters |
| `nextSteps` | `string[]` | No | Reserved metadata for future dependency scheduling |

## Templates

Zentro resolves placeholders against an execution context with this shape:

```json
{
  "input": {},
  "steps": {}
}
```

Recommended placeholder syntax:

- `{input.userId}`
- `{steps.user.id}`

Legacy `{{path.to.value}}` placeholders are also accepted for backward compatibility.

## Execution Semantics

- Steps are currently executed in declaration order.
- Each successful step stores its response body under `steps.<stepId>`.
- If any upstream request returns a non-2xx response, the step is marked as failed and the execution is stored in `execution_errors`.
- If `responseConfig.mapping` is present, the execute endpoint returns the mapped output.
- If `responseConfig.mapping` is omitted, the execute endpoint returns all step payloads keyed by step id.

## Example Requests

Create a flow:

```bash
curl -X POST http://localhost:3000/v1/flows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "get-user-dashboard",
    "type": "QUERY",
    "steps": {
      "user": {
        "method": "GET",
        "url": "http://users-service/users/{input.userId}"
      },
      "orders": {
        "method": "GET",
        "url": "http://orders-service/orders",
        "params": {
          "userId": "{steps.user.id}"
        }
      }
    },
    "responseConfig": {
      "mapping": {
        "user": "steps.user",
        "orders": "steps.orders"
      }
    }
  }'
```

Execute a flow:

```bash
curl -X POST http://localhost:3000/v1/flows/<flow-id>/execute \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "123"
  }'
```

## Notes

- Flow ids and execution error ids exposed by the API are the Mongo `_id` values, generated as UUID strings.
- The app uses Axios through `@nestjs/axios` for outbound HTTP calls.
- There is currently no automated test suite in the repository.
