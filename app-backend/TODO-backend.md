# Backend Database Implementation TODO

## Backend Setup
- [x] Create `app-backend/` directory
- [x] Initialize Node.js project with `npm init`
- [x] Install dependencies: express, sqlite3, cors, body-parser
- [x] Create database initialization script (`db/init.js`) based on JSON schemas
- [x] Create `server.js` with Express setup and middleware
- [x] Implement API routes for banks (`/api/banks`)
- [x] Implement API routes for bank accounts (`/api/bank-accounts`)
- [x] Implement API routes for contacts (`/api/contacts`)
- [x] Implement API routes for items (`/api/items`)
- [x] Implement API routes for units (`/api/units`)
- [x] Implement authentication routes (`/api/auth/login`, `/api/auth/logout`)
- [x] Add user table and authentication logic in backend

## Frontend Updates
- [x] Create `src/utils/api.js` for centralized API fetch calls
- [ ] Update `src/utils/storage.js` to use API calls instead of localStorage
- [x] Update `src/hooks/setup/useBank.js` to use API
- [x] Update `src/hooks/setup/useBankAccount.js` to use API
- [x] Update `src/hooks/setup/useContacts.js` to use API
- [x] Update `src/hooks/setup/useItems.js` to use API
- [x] Update `src/hooks/setup/useUnits.js` to use API
- [x] Update `src/hooks/useAuth.jsx` to use backend authentication
- [x] Update Vite config to proxy API calls to backend server

## Testing and Integration
- [x] Run backend server on port 3001
- [ ] Test API endpoints manually
- [x] Run frontend and test data persistence
- [x] Handle loading states and errors in hooks
- [ ] Migrate existing localStorage data to backend (optional)
