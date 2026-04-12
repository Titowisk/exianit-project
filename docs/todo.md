# ToDo List

## 0.1 Tasks
- [ ] Add sorting and filtering for amount and date
  

## 0.2 Tasks
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
- [X] Use environment variables for API URL and other configuration values
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