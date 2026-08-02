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

## Step 4 — Tag Edit & Delete in Tags Page

Extends the Tags management page so users can rename, recolor, and delete their existing tags inline — no separate page or dialog required.

### 4.1 — Add methods to `TagService`

In `src/app/services/tag.service.ts`, add two new methods:

```ts
updateTag(tagId: string, changes: { name?: string; color?: string }): Observable<Tag> {
  const userId = this.authService.userId();
  return this.http.patch<Tag>(`${this.apiUrl}/tags/${tagId}?userId=${userId}`, changes);
}

deleteTag(tagId: string): Observable<void> {
  const userId = this.authService.userId();
  return this.http.delete<void>(`${this.apiUrl}/tags/${tagId}?userId=${userId}`);
}
```

### 4.2 — Update `TagsComponent` signals and methods

Add the following signals to track edit/delete state:

```ts
editingTagId = signal<string | null>(null);
isSavingTag = signal(false);
isDeletingTagId = signal<string | null>(null);
editBackendErrors = signal<Record<string, string[]>>({});
editForm: FormGroup;  // initialized in constructor
```

Initialize `editForm` in the constructor (same validators as `tagForm`):
```ts
this.editForm = this.fb.group({
  name: ['', [Validators.required, Validators.maxLength(30)]],
  color: ['#4CAF50', [Validators.required]]
});
```

Methods to add:

- **`startEditing(tag: Tag)`** — sets `editingTagId` to `tag.id`; patches `editForm` with `{ name: tag.name, color: tag.color }`; resets `editBackendErrors`.
- **`cancelEditing()`** — clears `editingTagId` and resets `editForm`.
- **`saveEdit(tag: Tag)`** — validates `editForm`; calls `TagService.updateTag(tag.id, { name, color })`; on success: updates the entry in `tags` signal and calls `cancelEditing()`; on error: populates `editBackendErrors` from the API response via `ErrorHandlerService`.
- **`deleteTag(tag: Tag)`** — sets `isDeletingTagId` to `tag.id`; calls `TagService.deleteTag(tag.id)`; on success: removes the tag from `tags` signal and shows a success toast; on error: shows an error toast; always clears `isDeletingTagId`.

### 4.3 — Update `TagsComponent` template

In the `tags-grid` section, replace each static `tag-chip` with a conditional block:

**Normal mode** (when `editingTagId() !== tag.id`):
- Render the existing colored chip (color swatch + tag name).
- Add an **Edit** icon button (`pi pi-pencil`, `p-button` text/icon variant) → `startEditing(tag)`.
- Add a **Delete** icon button (`pi pi-trash`, `p-button` text/icon variant, severity `danger`) → `deleteTag(tag)`. Show a spinner via `[loading]="isDeletingTagId() === tag.id"`.

**Edit mode** (when `editingTagId() === tag.id`):
- Replace the chip with an inline edit row containing:
  - `pInputText` bound to `editForm.get('name')`, max 30 chars. Show validation/backend errors below (same pattern as create form).
  - `<input type="color">` bound to `editForm.get('color')`, with the hex value displayed alongside.
  - **Save** button (`pi pi-check`) → `saveEdit(tag)`, `[loading]="isSavingTag()"`.
  - **Cancel** button (`pi pi-times`) → `cancelEditing()`, `[disabled]="isSavingTag()"`.
- Only one tag can be in edit mode at a time (enforced by the single `editingTagId` signal).
- Disable the delete buttons of all other tags while one is being edited or deleted.

---

---

## Step 5 — Refactor Tagged Summary to Use Dedicated API Endpoints

Replace the frontend calculation logic in `TaggedSummaryComponent` with two dedicated backend endpoints that return pre-aggregated data. The page will display two separate tables: one for tagged expenses and one for tagged incomes.

### 5.1 — Create `TaggedSummaryResponse` interface

Create `src/app/models/tagged-summary.interface.ts`:

```ts
import { Tag } from './tag.interface';

export interface TaggedSummaryMonth {
  month: string;
  tagAmounts: Record<string, number>;
  total: number;
}

export interface TaggedSummaryAggregates {
  tagAmounts: Record<string, number>;
  total: number;
}

export interface TaggedSummaryResponse {
  tags: Tag[];
  months: TaggedSummaryMonth[];
  totals: TaggedSummaryAggregates;
  averages: TaggedSummaryAggregates;
}
```

### 5.2 — Add methods to `TagService`

In `src/app/services/tag.service.ts`, add two new methods:

```ts
getTaggedExpenseSummary(year: number): Observable<TaggedSummaryResponse> {
  const userId = this.authService.userId();
  return this.http.get<TaggedSummaryResponse>(
    `${this.apiUrl}/transactions/tagged-expense-summary?userId=${userId}&year=${year}`
  );
}

getTaggedIncomeSummary(year: number): Observable<TaggedSummaryResponse> {
  const userId = this.authService.userId();
  return this.http.get<TaggedSummaryResponse>(
    `${this.apiUrl}/transactions/tagged-income-summary?userId=${userId}&year=${year}`
  );
}
```

### 5.3 — Rewrite `TaggedSummaryComponent` TS

**Remove:**
- `TransactionService` injection and its import
- `buildSummary()` and all local calculation logic
- `MONTH_NAMES` constant and the local `TaggedMonthRow` / `TaggedSummaryAggregates` interfaces
- `userTags`, `monthRows`, `averages`, `totals` signals

**Add:**
```ts
expenseSummary = signal<TaggedSummaryResponse | null>(null);
incomeSummary = signal<TaggedSummaryResponse | null>(null);
```

In `loadData(year)`, replace the `forkJoin` call with:
```ts
forkJoin({
  expenses: this.tagService.getTaggedExpenseSummary(year),
  incomes: this.tagService.getTaggedIncomeSummary(year)
}).subscribe({
  next: ({ expenses, incomes }) => {
    this.expenseSummary.set(expenses);
    this.incomeSummary.set(incomes);
    this.isLoading.set(false);
  },
  error: ...
});
```

### 5.4 — Rewrite `TaggedSummaryComponent` template

Replace the single `p-table` block with two sections. Each section follows the same `p-table` structure — only the data source differs.

**Shared table structure** (applied to both sections):
- **Header row:** Month column + one `<th>` per `tag` in `summary.tags` (background-color = `tag.color`, white text) + Total column.
- **Body row:** month name + `row.tagAmounts[tag.id]` per tag + `row.total`, all currency-formatted.
- **Footer:** Averages row from `summary.averages.tagAmounts[tag.id]` / `.total`, then Totals row from `summary.totals.tagAmounts[tag.id]` / `.total`.
- Columns generated with `@for (tag of summary.tags; track tag.id)`.

**Page layout:**
- One `isLoading` spinner covers both fetches.
- After loading, show two stacked subsections, each with its own `<h2>` title and `p-table`:
  - **"Tagged Expenses"** — sourced from `expenseSummary()`. Show empty-state ("No tagged expense transactions for this year.") when `expenseSummary()?.months.length === 0`.
  - **"Tagged Incomes"** — sourced from `incomeSummary()`. Show empty-state ("No tagged income transactions for this year.") when `incomeSummary()?.months.length === 0`.

---

## Implementation Order

1. `Tag` interface + update `Transaction` interface
2. `TagService`
3. `TagsComponent` + route + header `userItems` entry
4. Statement tag actions (Step 2)
5. `TaggedSummaryComponent` + route + header `navItems` entry
6. Tag edit & delete in Tags page (Step 4)
7. Refactor Tagged Summary to use API endpoints (Step 5)
