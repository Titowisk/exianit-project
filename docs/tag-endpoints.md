# Tag Endpoints

## Create Tag
`POST /api/tags?userId={{userId}}`

```http
POST {{ExianitApi_HostAddress}}/api/tags?userId={{userId}}
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Groceries",
  "color": "#4CAF50"
}
```

**Name rules:** 1–30 chars, letters/digits/spaces/hyphens/underscores only, case-insensitive unique per user. Max 15 tags per user.

### Response — 201 Created
```json
{
  "id": "ec34bc5c-a8df-4a5c-8304-efe3b70722c2",
  "name": "Groceries",
  "color": "#4CAF50"
}
```

### Error responses
| Status | Reason |
|--------|--------|
| 400 | Tag limit of 15 reached |
| 400 | Name contains invalid characters or exceeds 30 chars |
| 409 | Tag with that name already exists for the user |

---

## Get User Tags
`GET /api/tags?userId={{userId}}`

```http
GET {{ExianitApi_HostAddress}}/api/tags?userId={{userId}}
Authorization: Bearer {{token}}
```

### Response — 200 OK
```json
[
  {
    "id": "ec34bc5c-a8df-4a5c-8304-efe3b70722c2",
    "name": "Groceries",
    "color": "#4CAF50"
  },
  {
    "id": "f1a2b3c4-d5e6-7890-abcd-ef1234567890",
    "name": "Reimbursable",
    "color": "#2196F3"
  }
]
```

---

## Tag a Transaction
`PATCH /api/transactions/{transactionId}/tag?userId={{userId}}`

Sets a tag on a single transaction. Send `tagId: null` to remove the tag.
After tagging, a `TagRule` is created/updated so future imports with the same origin are automatically tagged.

```http
PATCH {{ExianitApi_HostAddress}}/api/transactions/{{transactionId}}/tag?userId={{userId}}
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "tagId": "ec34bc5c-a8df-4a5c-8304-efe3b70722c2"
}
```

To **remove** a tag:
```json
{
  "tagId": null
}
```

### Response — 204 No Content

### Error responses
| Status | Reason |
|--------|--------|
| 404 | Transaction not found |
| 404 | Tag not found |
| 401 | Transaction does not belong to the user |
| 401 | Tag does not belong to the user |

---

## Tag All Transactions with Similar Origin
`PATCH /api/transactions/{transactionId}/similar-origin-tag?userId={{userId}}`

Tags all transactions that share the exact same origin and transaction type as the referenced transaction, regardless of category.
Send `tagId: null` to remove the tag from all matching transactions.

```http
PATCH {{ExianitApi_HostAddress}}/api/transactions/{{transactionId}}/similar-origin-tag?userId={{userId}}
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "tagId": "ec34bc5c-a8df-4a5c-8304-efe3b70722c2"
}
```

### Response — 200 OK
```json
{
  "updatedCount": 7
}
```

### Error responses
| Status | Reason |
|--------|--------|
| 404 | Transaction not found |
| 404 | Tag not found |
| 401 | Transaction does not belong to the user |
| 401 | Tag does not belong to the user |

---

## Get Transactions (updated)
`GET /api/transactions?userId={{userId}}&year={{year}}`

The existing endpoint now includes a `tag` field on each transaction. It is `null` when the transaction has no tag.

### Response — 200 OK
```json
[
  {
    "id": "8250d949-3e76-4578-9db3-a445a8d67c8f",
    "type": "Expense",
    "origin": "Supermercado Extra",
    "amount": 153.40,
    "date": "2026-06-15T00:00:00Z",
    "category": "Groceries",
    "description": null,
    "sourceStatementId": "41717089-fce1-4e46-9a36-221a706feab5",
    "sourceAccount": {
      "name": "Btg A",
      "source": { "id": 1, "name": "BTG" }
    },
    "tag": {
      "id": "ec34bc5c-a8df-4a5c-8304-efe3b70722c2",
      "name": "Groceries",
      "color": "#4CAF50"
    }
  },
  {
    "id": "3e19fda9-f475-4758-a6af-afee419e9066",
    "type": "Expense",
    "origin": "Netflix",
    "amount": 55.90,
    "date": "2026-06-01T00:00:00Z",
    "category": "Leisure",
    "description": null,
    "sourceStatementId": null,
    "sourceAccount": {
      "name": "Nubank",
      "source": { "id": 2, "name": "NUBANK" }
    },
    "tag": null
  }
]
```
