# 📝 Layer 3 — Phase A — "Backend Auth Real Code"
**Date:** 2026-06-28

> 🎯 Phase A Goal: Write real working auth code for the first time
> Focus: understand WHY each file exists and HOW they connect

---

## 📋 Build Order — Why This Order Matters

```
❌ wrong order → routes first → imports don't exist → crash!

✅ correct order (bottom-up):
   1. User.ts model           → needs nothing, standalone
   2. auth.validation.ts      → needs nothing, standalone
   3. auth.middleware.ts      → needs jwt.ts (Phase 0 ✅)
   4. auth.service.ts         → needs User.ts + password.ts + jwt.ts
   5. auth.controller.ts      → needs auth.service.ts
   6. rateLimiter.middleware  → needs express-rate-limit only
   7. auth.routes.ts          → needs ALL of the above ✅

rule: always build what you NEED before what USES it!
```

---

## 🔗 How All 7 Files Connect

```
REQUEST comes in
      ↓
auth.routes.ts          → receives request, runs middleware chain
      ↓
rateLimiter             → too many attempts? 🛑
      ↓
auth.validation.ts      → bad data format? 🛑
      ↓
validate.middleware     → any errors? 🛑
      ↓
auth.middleware.ts      → invalid token? 🛑 (only on /me)
      ↓
auth.controller.ts      → reads req, calls service, sends response
      ↓
auth.service.ts         → ALL real work happens here
      ↓
User.ts model           → talks to PostgreSQL database
      ↓
RESPONSE travels back to client
```

Think of it like a **pipeline** — each file has ONE job:
```
routes      → direct traffic
limiter     → block spam
validation  → check format
middleware  → verify identity
controller  → handle request
service     → do real work
model       → talk to database
```

---

## ✅ A1 — `User.ts` — "The Database Blueprint" 🗄️
**Location:** `backend/src/models/User.ts`

### What it does
Defines the structure of the `users` table in PostgreSQL.
Sequelize reads this blueprint and manages the actual table.
It's NOT the table itself — it's the DESCRIPTION of the table.

### Why it exists
Without this file, Sequelize doesn't know what columns exist,
what types they are, or what rules apply to them.
Every query to the users table goes through this model.

### Most important decisions made here

**ENUM for role:**
```
role: ENUM('super_admin', 'shop_admin', 'customer')

database REJECTS any value not in the list
can't save role: "hacker" → database says NO immediately! 🛑
this is enforced at DATABASE level, not just application level
```

**defaultValue: 'customer' for role:**
```
the most important security decision in this file!

if role came from req.body:
  hacker sends { role: "super_admin" } → full system access 😱

hardcoded 'customer' → register IGNORES role from request
only super_admin can upgrade someone → nobody self-promotes! 🔒
```

**shop_id nullable:**
```
super_admin → NULL (manages ALL shops, belongs to none)
shop_admin  → number (belongs to ONE specific shop)
customer    → NULL (shops anywhere, belongs to none)

not every user needs a shop → nullable is correct
```

**timestamps: true:**
```
Sequelize automatically adds:
  created_at → when user registered
  updated_at → when user data last changed

free columns, no extra work needed ✅
```

### How it connects
```
auth.service.ts → User.findOne() / User.create() / User.findByPk()
models/index.ts → defines User belongs to Shop (via shop_id)
migrations/     → creates the actual table with same structure
```

### ❓ Questions & Answers

**Q: What is the difference between Model.define() and class User extends Model?**
> Model.define() is the old functional style. class User extends Model is modern — better TypeScript support, cleaner code, easier to add methods. Always use modern way.

**Q: Why is role an ENUM and not just a STRING?**
> ENUM enforces fixed choices at database level. STRING would allow saving role: "hacker" or role: "god" — anything! ENUM rejects invalid values before they even reach the application.

**Q: Why is defaultValue 'customer' so important?**
> Security. If role came from the request body, any hacker could send role: "super_admin" and get full system control. Hardcoding 'customer' means the request's role field is completely ignored on register.

**Q: How does auth.service.ts use this model?**
> register → User.create() saves new row
> login → User.findOne() finds by email
> getMe → User.findByPk() finds by id (primary key directly)

---

## ✅ A2 — `auth.validation.ts` — "Request Data Rules" 📋
**Location:** `backend/src/validations/auth.validation.ts`

### What it does
Defines rules that check request data BEFORE it reaches the controller.
Uses express-validator's body() function to set rules per field.

### Why it exists
Without validation, anyone could send garbage data:
```
{ email: "notanemail", password: "1" }
→ reaches service → confusing errors deep in the app 😓

with validation:
→ stopped immediately with clear message 🛑
→ "Email must be valid"
→ controller never runs! clean and fast ✅
```

### Two exports
```
registerValidation → checks: full_name, email, password
loginValidation    → checks: email, password only
                    (no full_name — not needed for login)
                    (no isLength on password — wrong pass
                     gives better error from service)
```

### Most important concept — withMessage()
```
without it → frontend gets "Invalid value" → useless 😓
with it    → frontend gets "Email must be valid" → helpful ✅

always add clear messages — your frontend team will thank you!
```

### How it connects
```
auth.routes.ts → uses registerValidation and loginValidation
                 as middleware in the chain BEFORE controller
validate.middleware → reads validation results after rules run
                      stops request if any rule failed
```

### ❓ Questions & Answers

**Q: What is the difference between body() and validationResult()?**
> body() defines the rules — "email must be valid format".
> validationResult() checks if any rules were broken.
> body() sets up the rules, validationResult() reads the results.
> They work as a team — one sets, one checks.

**Q: Why does loginValidation not check password length?**
> Because wrong password gives a better error from the service: "Invalid email or password". Validation only checks FORMAT, not correctness. A short password attempt still needs to reach the service.

---

## ✅ A3 — `auth.middleware.ts` — "Token Checker" 🔐
**Location:** `backend/src/middleware/auth.middleware.ts`

### What it does
Protects routes by verifying the JWT token on every request.
Runs BEFORE the controller on any protected route.
Attaches decoded user data to req.user for controllers to use.

### Why it exists
Without this, anyone could call GET /api/auth/me without being logged in.
This file is the gatekeeper for all protected routes.

### The flow — step by step
```
1. read Authorization header → "Bearer eyJhbG..."
2. split by space → take second part → actual token
3. token missing? → 401 immediately, stop! 🛑
4. jwt.verify() → valid? → decoded data
5. invalid/expired? → catch fires → 401, stop! 🛑
6. attach decoded to req.user
7. next() → pass to controller ✅
```

### Most important concepts

**Optional chaining (?.):**
```
req.headers.authorization?.split(' ')[1]

without ?. → authorization header missing → crash! 💥
with ?.    → missing → returns undefined safely ✅
```

**next() is critical:**
```
without next() → req.user is set BUT request freezes forever
                 never reaches controller 😱
with next()    → passes to next step in chain ✅

forgetting next() = most common middleware mistake!
```

**req.user — why it matters:**
```
after authenticate() runs, every controller can read:
  req.user.id       → who is making this request?
  req.user.role     → what can they do?
  req.user.shop_id  → which shop do they belong to?

this is why we NEVER trust shop_id from req.body!
req.user.shop_id = verified, safe, from JWT 🔒
```

### How it connects
```
auth.routes.ts → uses authenticate as middleware on GET /me
express.d.ts   → defines req.user type so TypeScript knows about it
jwt.ts         → generateToken() created the token we're verifying here
```

### ❓ Questions & Answers

**Q: What does jwt.verify() return and what does it throw?**
> Valid token → returns decoded data { id, email, role, shop_id }.
> Invalid/expired token → THROWS an error → catch block fires → 401.

**Q: Why attach to req.user instead of passing as function argument?**
> Because middleware and controller are separate functions. You can't pass arguments between them directly. req is the shared object that travels through the entire middleware chain — attaching to req.user makes it available everywhere after.

**Q: What happens if next() is forgotten?**
> The request freezes. Token is verified, req.user is set, but the controller never runs. The client waits forever and eventually times out. Always call next() after setting req.user!

---

## ✅ A4 — `auth.service.ts` — "Business Logic" ⚙️
**Location:** `backend/src/services/auth.service.ts`

### What it does
Contains ALL the real work for authentication.
Controller calls these functions — service does the actual logic.
The only file that touches both the database AND utilities.

### Why it exists
Separation of concerns. Controller should be thin.
If business logic lived in controller:
```
❌ messy, hard to test, can't reuse
❌ mobile app + web app = duplicate code

✅ with service:
   controller calls service.login()
   service does all the work
   same service used by any controller, any platform
```

### 3 Functions and their logic

**register():**
```
1. findOne by email → exists? throw "Email already exists" 🛑
2. hashPassword() → never store plain text!
3. User.create() → role hardcoded 'customer' (security!)
4. build TokenPayload → bake into JWT
5. return { user, token }
```

**login():**
```
1. findOne by email → not found? throw "Invalid email or password" 🛑
2. comparePassword() → no match? throw "Invalid email or password" 🛑
   ⚠️ SAME message for both! hacker can't tell which is wrong 🔒
3. build TokenPayload → bake into JWT
4. return { user, token }
```

**getMe():**
```
1. findByPk(id) → id comes from req.user (already verified!)
2. not found? throw "User not found" 🛑
3. return user
```

### Most important security decisions

**Same error message for login:**
```
"Invalid email or password" for BOTH wrong email AND wrong password

if we said "email not found" → hacker tests millions of emails
                                discovers which ones exist! 😱
same message → hacker learns nothing 🔒
```

**shop_id ?? undefined:**
```
User model returns shop_id as number | null
TokenPayload expects number | undefined
null ≠ undefined in TypeScript

?? converts: null → undefined ✅
             number → keeps number ✅
```

**3 Sequelize methods:**
```
findOne({ where: { email } }) → find by any column → returns User or null
findByPk(id)                  → find by primary key → cleaner for id lookups
create({ ... })               → INSERT new row → returns created user
```

### How it connects
```
auth.controller.ts → calls register(), login(), getMe()
User.ts model      → all database queries go through here
utils/password.ts  → hashPassword() + comparePassword()
utils/jwt.ts       → generateToken() builds the token
types/index.ts     → TokenPayload type used for token shape
```

### ❓ Questions & Answers

**Q: Why use findOne instead of findAll for checking existing email?**
> findOne returns ONE result or null — perfect for "does this exist?". findAll returns an array requiring .length > 0 check. findOne is cleaner, more efficient, semantically correct.

**Q: What does findByPk do differently from findOne?**
> findByPk(id) finds by Primary Key directly — just pass the id value.
> findOne needs { where: { id } } object.
> findByPk is shorter, cleaner, and slightly faster for primary key lookups.

**Q: Why hash the password before saving?**
> If database is breached, hacker gets hashes not real passwords. Bcrypt hashes can't be reversed. Even Duhok Ecommerce developers can't see user passwords. Industry standard security practice.

---

## ✅ A5 — `auth.controller.ts` — "Request Handler" 🎮
**Location:** `backend/src/controllers/auth.controller.ts`

### What it does
Receives HTTP requests, calls the right service function,
and sends the response back to the client.
Nothing more. Nothing less.

### Why it exists
Keeps the request/response handling separate from business logic.
Controller is the bridge between HTTP world and business logic world.

### The thin controller rule
```
controller does ONLY 3 things:
  1. read from req (body, params, user)
  2. call service function
  3. send res.json()

controller NEVER:
  → touches database directly ❌
  → hashes passwords ❌
  → generates tokens ❌
  → contains if/else business logic ❌

all of that = service's job!
```

### Status codes — why they matter
```
201 → register  → something CREATED in database
200 → login     → success, just checking credentials
200 → getMe     → success, just reading data
400 → register error → bad request (duplicate email)
401 → login error    → unauthorized (wrong credentials)
404 → getMe error    → not found (user doesn't exist)

wrong status codes = unprofessional API
correct codes = frontend knows exactly what happened
```

### How it connects
```
auth.routes.ts    → calls register, login, getMe as route handlers
auth.service.ts   → controller calls service for all real work
express types     → Request, Response types for TypeScript
```

### ❓ Questions & Answers

**Q: Why is controller called "thin"?**
> Because it does almost nothing itself. Just reads input, calls service, sends output. All real logic lives in service. Thin controller = easy to read, easy to test, easy to change.

**Q: Why 401 for login error and not 400?**
> 400 = client sent bad DATA format.
> 401 = client is not AUTHORIZED (wrong credentials).
> Login with wrong password is an authorization failure, not a data format error.

**Q: Why use (error as Error).message?**
> TypeScript doesn't know the type of caught errors. (error as Error) tells TypeScript "this is an Error object". .message then gives the string message from the thrown error safely.

---

## ✅ A6 — `rateLimiter.middleware.ts` — "Spam Protection" 🛡️
**Location:** `backend/src/middleware/rateLimiter.middleware.ts`

### What it does
Limits how many requests one IP address can make in a time window.
Two limiters for different levels of strictness.

### Why it exists
```
without it:
  hacker tries 10,000 passwords in 1 minute → brute-force login 😱
  bot registers 10,000 fake accounts → spam 🤖

with authLimiter (10/15min):
  attempt 11 → blocked immediately 🛑
  hacker must wait 15 minutes → attack is useless!
```

### Two limiters
```
authLimiter   → 10 requests / 15 min per IP
                used on: POST /login + POST /register
                why strict: these are the attack targets 🔒

globalLimiter → 100 requests / 15 min per IP
                used on: app.ts (ALL routes)
                why generous: real users browse a lot,
                              but bots/scrapers do thousands 🛡️
```

### windowMs calculation
```
15 * 60 * 1000
↑    ↑    ↑
15  min   ms  = 900,000 milliseconds = 15 minutes
```

### How it connects
```
auth.routes.ts → authLimiter used on /login and /register
app.ts         → globalLimiter applied to ALL routes
```

### ❓ Questions & Answers

**Q: Why 10 for auth and 100 for global?**
> Auth is strict — real users need 2-3 login attempts max. 10 is generous for real users but blocks brute-force. Global is generous — normal browsing hits many endpoints. 100 stops scrapers and bots without affecting real users.

---

## ✅ A7 — `auth.routes.ts` — "URL Traffic Map" 🚦
**Location:** `backend/src/routes/auth.routes.ts`

### What it does
Maps each URL to a middleware chain and controller function.
Defines the ORDER middleware runs in.
Registered in app.ts as /api/auth prefix.

### Why it exists
Without routes, Express doesn't know what to do with incoming requests.
Routes = the receptionist that says "this URL goes here, run these checks first".

### The middleware chain — order matters!
```
POST /register:
  authLimiter      → 1st (block spam before wasting time)
  registerValidation → 2nd (check format)
  validateMiddleware → 3rd (confirm no errors)
  controller       → last (only if all pass)

POST /login:
  authLimiter      → 1st (block brute-force before anything)
  loginValidation  → 2nd (check format)
  validateMiddleware → 3rd (confirm no errors)
  controller       → last (only if all pass)

GET /me:
  authenticate     → 1st (verify token — who are you?)
  controller       → last (only if token valid)
  no authLimiter   → already authenticated, no brute-force risk
  no validation    → no body data, nothing to validate
```

### Router vs App
```
Router = mini Express app for ONE feature
app.ts mounts it: app.use('/api/auth', authRouter)

'/register' in routes file = '/api/auth/register' in real app
prefix is added by app.ts, not the route file itself
```

### How it connects
```
app.ts             → imports this router → mounts at /api/auth
auth.controller.ts → endpoint handler functions
auth.validation.ts → validation rule arrays
auth.middleware.ts → authenticate function
rateLimiter.middleware → authLimiter function
validate.middleware → validateMiddleware function
```

### ❓ Questions & Answers

**Q: Why does middleware order matter?**
> Runs left to right. authLimiter must be first — no point checking format if IP is blocked. validateMiddleware must be after validation rules — it reads their results. Controller must be last — only runs when everything passes.

**Q: Why does /me not have authLimiter or validation?**
> No brute-force risk on /me — you need a valid token to even try. No body data — nothing to validate. Token check is all that's needed. Adding more would be unnecessary overhead.

---

## 📌 Phase A — Full Connection Map

```
REQUEST → auth.routes.ts
               ↓
          rateLimiter.middleware → block spam
               ↓
          auth.validation.ts → check format
               ↓
          validate.middleware → confirm no errors
               ↓
          auth.middleware.ts → verify token (only /me)
               ↓
          auth.controller.ts → read req, call service
               ↓
          auth.service.ts → ALL real work
               ↓
          User.ts model → talk to database
               ↓
          PostgreSQL → store/retrieve data
               ↓
          response travels back ✅
```

---

## 📌 Key Rules — Phase A

```
1.  build bottom-up — imports must exist before using them
2.  ENUM → database rejects invalid values at DB level
3.  role: 'customer' hardcoded → nobody self-promotes!
4.  password ALWAYS hashed before saving → never plain text
5.  same error for wrong email AND wrong password → security
6.  findOne → one result or null (email checks)
7.  findByPk(id) → primary key lookup, no { where } needed
8.  shop_id ?? undefined → converts null to undefined for TypeScript
9.  controller = thin (req → service → res, nothing else)
10. service = fat (all real business logic lives here)
11. next() MUST be called or request freezes forever
12. middleware runs left to right in route chain
13. 201 created | 200 ok | 400 bad | 401 unauth | 404 not found
14. authLimiter 10/15min | globalLimiter 100/15min
15. router prefix added in app.ts, not in route file itself
16. req.user = shared data across middleware chain (from JWT)
17. same error message for both wrong email + wrong password
18. optional chaining (?.) = crash-safe property access
```

---

## 📁 Files Created This Phase
```
backend/src/models/User.ts
backend/src/validations/auth.validation.ts
backend/src/middleware/auth.middleware.ts
backend/src/services/auth.service.ts
backend/src/controllers/auth.controller.ts
backend/src/middleware/rateLimiter.middleware.ts
backend/src/routes/auth.routes.ts
```