Purchase Booking :: Cancel will be refund amount
POS :: dropdown item select to add to list
Separate Hook for DDL


in api auth middle ware, must enable user session when live



.1 Plaintext Password Storage (Leakage / Security Issue)
Issue: Passwords are not hashed. In routes/auth/auth.routes.js (registration & password reset) and routes/auth/auth.v1.routes.js (login), the users_pswrd is directly inserted into and compared against the database in plaintext. Impact: If the database is compromised, all user passwords are exposed immediately. Implementation Guide:

Install bcrypt: npm install bcrypt
In registration/reset routes, hash the password before saving:
javascript
const bcrypt = require('bcrypt');
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(users_pswrd, saltRounds);
// Save hashedPassword to DB
In the login route, compare the hashed password:
javascript
const match = await bcrypt.compare(users_pswrd, row_user.users_pswrd);
if (!match) { /* Return Invalid Password error */ }