# Tags Feature — Implementation Plan

## Overview

Users can create named, colored tags and apply them to transactions for flexible grouping beyond categories. This plan covers three steps: a Tags management page, tag actions in the Statement table, and a dynamic Tagged Summary page.

---

## ~~Step 1 — Tags Management Page~~ ✅ Done

A new page where users create and visualize their tags, accessible from the user profile menu (`userItems`).

### 1.1 — Add `Tag` model

Create `src/app/models/tag.interface.ts`:
```ts
export interface Tag {
  id: string;
  name: string;
  color: string; // hex, e.g. "#4CAF50"
}
```

Also update `src/app/models/transaction.interface.ts` — add an optional `tag` field to both `IncomeTransaction` and `ExpenseTransaction`:
```ts
tag?: Tag | null;
```

### 1.2 — Create `TagService`

Create `src/app/services/tag.service.ts` with `providedIn: 'root'`. Methods:
- `getTags(): Observable<Tag[]>` — `GET /api/tags?userId={{userId}}`
- `createTag(name: string, color: string): Observable<Tag>` — `POST /api/tags?userId={{userId}}`

### 1.3 — Create `TagsComponent`

Create `src/app/dashboard/tags/tags.component.ts` (+ `.html`, `.scss`).

**Features:**
- On load, fetch all user tags via `TagService.getTags()`.
- Display existing tags as a list/grid of colored chips (use PrimeNG `Chip` or a styled `p-card`), showing tag name with its background color.
- **Create form** (inline, no separate page): two fields — `name` (PrimeNG `InputText`, max 30 chars) and `color` (HTML native `<input type="color">` or PrimeNG `ColorPicker`). Submit calls `TagService.createTag()`. Enforce frontend: max 15 tags (disable the form when limit is reached), show API conflict/validation errors.
- Show a loading spinner while fetching, and an empty-state message when no tags exist yet.

### 1.4 — Register route

In `src/app/app.routes.ts`, add:
```ts
{ path: 'tags', component: TagsComponent, canActivate: [authGuard] }
```

### 1.5 — Add to header `userItems`

In `src/app/header/header.component.ts`, add to the `userItems` signal (before Profile):
```ts
{
  label: 'Tags',
  icon: 'pi pi-tag',
  command: () => this.navigateTo('/tags'),
  routerLink: '/tags',
},
```

---

## ~~Step 2 — Tag Actions in Statement Table~~ ✅ Done

Two new action buttons per row allowing users to tag a single transaction or all transactions sharing the same origin.

### 2.1 — Update `StatementComponent`

Inject `TagService` and load tags on init. Add signals:
```ts
userTags = signal<Tag[]>([]);
taggingId = signal<string | null>(null);
selectedTagId = signal<string | null>(null);
savingTagId = signal<string | null>(null);
```

Methods to add:
- `loadTags()` — fetches user tags, sets `userTags`.
- `startTagging(transaction)` — sets `taggingId` to the transaction id; resets `selectedTagId` to the transaction's current `tag?.id ?? null`.
- `cancelTagging()` — clears `taggingId` and `selectedTagId`.
- `saveTag(transaction)` — calls `PATCH /api/transactions/{id}/tag` with `{ tagId: selectedTagId() }`. On success, updates the transaction in the local `transactions` signal.
- `saveSimilarOriginTag(transaction)` — calls `PATCH /api/transactions/{id}/similar-origin-tag` with `{ tagId: selectedTagId() }`. On success, refreshes the full transaction list.

### 2.2 — Update Statement table HTML

**Add a `Tag` column** (header and body) to show the current tag as a small colored badge (tag name with `background-color` from `tag.color`), or `—` when untagged.

**Add a filter row cell** for the new Tag column using `p-column-filter` (text, field `tag.name`).

**In the action buttons area** (the `@else` branch of `categorizingId()`), add two new buttons alongside the existing ones:

```
[tag icon]  pTooltip="Tag this transaction"   → startTagging(transaction)
```

When `taggingId() === transaction.id`, replace the row's action cell with:
- A `p-select` bound to `selectedTagId()`, options built from `userTags()` plus a "No tag" (`null`) entry.
- **"This Transaction"** confirm button → `saveTag(transaction)`
- **"Similar Transactions"** confirm button → `saveSimilarOriginTag(transaction)`
- **"Cancel"** button → `cancelTagging()`

This mirrors the existing `categorizingId` pattern already in the component.

---

## ~~Step 3 — Tagged Transactions Summary Page~~ ✅ Done

A dynamic summary table where rows are months and columns are the user's tags (one column per tag), similar to `expenses.component.html` and `incomes.component.html` but generated at runtime.

### 3.1 — Create `TaggedSummaryComponent`

Create `src/app/dashboard/tagged-summary/tagged-summary.component.ts` (+ `.html`, `.scss`).

**Data loading:**
- Inject `TagService` and `TransactionService` (and `YearService`).
- On init (and on year change via `effect()`), fetch in parallel:
  - All user tags via `TagService.getTags()`
  - All transactions for the selected year via `TransactionService`
- Filter transactions to only those that have a non-null `tag`.

**Data transformation:**
- Group transactions by month (rows) and by `tag.id` (columns).
- For each month row, compute the total amount per tag.
- Compute an **Averages** row and a **Totals** row at the bottom (same pattern as expenses/incomes components).

**Template structure:**
- Title: "Tagged Summary" + year display (same style as other summary pages).
- Loading spinner / empty-state message when no tagged transactions exist.
- `p-table` with:
  - **Header:** Month column + one `<th>` per tag (background-color = `tag.color`, white text, tag name as label).
  - **Body:** One row per month, month name in first cell, then amount per tag, currency formatted.
  - **Footer:** Averages row and Totals row, same style as other summary pages.
- All columns are generated with `@for (tag of userTags(); track tag.id)`.

### 3.2 — Register route

In `src/app/app.routes.ts`, add:
```ts
{ path: 'tagged-summary', component: TaggedSummaryComponent, canActivate: [authGuard] }
```

### 3.3 — Add to header `navItems`

In `src/app/header/header.component.ts`, add to the `navItems` signal:
```ts
{
  label: 'Tagged Summary',
  icon: 'pi pi-tags',
  command: () => this.navigateTo('/tagged-summary'),
  routerLink: '/tagged-summary',
},
```

---

## Implementation Order

1. `Tag` interface + update `Transaction` interface
2. `TagService`
3. `TagsComponent` + route + header `userItems` entry
4. Statement tag actions (Step 2)
5. `TaggedSummaryComponent` + route + header `navItems` entry
