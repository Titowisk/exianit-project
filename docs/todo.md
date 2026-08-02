# ToDo List

## Bugs

## 0.1 Tasks
- [ ] Tag calculations must be done by the backend, not the frontend. Backend must provide endpoints for that.
- [ ] Add tag deletion and edition features. Backend must provide endpoints for that.
- [ ] Remember to refactor transaction creation to make it easier to fetch the sourceAccountId when backend provides it in the response

## 0.2 Tasks
- [ ] In Imports Page, display the last imported file name to make it easier for users to identify which statement they imported for each month and source account.
- [ ] Add log out feature
- [ ] Add user profile component + password change feature
- [ ] Add unit tests for components and services

## UnPlanned Tasks
- [ ] File upload backend validation errors in import component (file field not in form control)
- [ ] Configure Github Actions for CI/CD
  - some way to automate tagging in github repository
  - action must publish images to Github Packages Registry
- [ ] Configure ArgoCD to track a repository with manifests and deploy to Kubernetes cluster. (where ?)

## Completed
- [X] Add tags visualization page
- [X] Add a way to check, in the source statements page, what are the missing months I need to import to complete the whole year.
- [X] Use environment variables for API URL and other configuration
- [X] When user tries to edit a transaction, the date picker is not shown properly. It is cut off and sometimes the user can't select the date it wants.
- [X] Editing date from 2025-02-03 to 2025-03-04, actually saves to 2025-03-03 (one day less) values
- [X] Add sorting and filtering for amount and date
- [X] Add SourceAccount information to the statement component table
- [X] Replace `source-statement-type.helper.ts` with a api call to get the statement types
- [X] Change statement component name to transaction component
  - merge statement and transacion services
    - also in the dropdown selector in the statement component
- [X] How to deal with year dropdown in the nav bar?
- [X] When table reloads, keep current filters and pagination
- [X] How to deal with 4xx and 5xx errors from the API?
- [X] In statement component, add red color to expense type and amount and green color to income type and amount
- [X] Add colors for expenses in transaction list and also in charts
- [X] Add colors for incomes in transaction list and also in charts
- [X] When user is logged in soft block access to register page
- [X] When user gets 401, redirect to login page
- [X] Changing year should reload the current component
- [X] Add search filter for Source column in the statement component
- [X] Add trimming for cells in the statement component table that contains texts larger than some threshold (e.g. 20 characters) and show the full text in a tooltip on hover