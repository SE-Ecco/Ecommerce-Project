// WHAT: Handles HTTP requests for auth — calls service → sends response
// IMPORTS: services/auth.service.ts
// USED BY: routes/auth.routes.ts
// HANDLES: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
// RULE: controller is THIN — receives request, calls service, sends response. nothing else!

import { Request, Response } from 'express'  // Request = req type, Response = res type
import * as authService from '../services/auth.service' // import all service functions

// ===========================
// REGISTER
// ===========================

export const register = async (
  req: Request,  // incoming HTTP request
  res: Response  // outgoing HTTP response
): Promise<void> => { // returns nothing — just sends response

  try {
    const { full_name, email, password } = req.body;
    // destructure — pull these 3 fields out of req.body
    // req.body = { full_name: "Alan", email: "alan@gmail.com", password: "mypass123" }

    const result = await authService.register(full_name, email, password);
    // call service — service does ALL real work:
    //   check email exists → hash password → create user → generate token
    // await → service is async, wait for it to finish
    // result = { user: {...}, token: "eyJhbG..." }

    res.status(201).json({ success: true, data: result });
    // 201 = Created — something new was created in database ✅
    // .json() → sends response as JSON to client

  } catch (error) {
    // service threw an error (e.g. "Email already exists")
    res.status(400).json({ message: (error as Error).message });
    // 400 = Bad Request — client sent invalid data
    // (error as Error).message → safely gets error message as string
  }
};

// ===========================
// LOGIN
// ===========================

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {
    const { email, password } = req.body;
    // pull email + password from request body
    // req.body = { email: "alan@gmail.com", password: "mypass123" }

    const result = await authService.login(email, password);
    // call service — service does ALL real work:
    //   find user → compare password → generate token
    // result = { user: {...}, token: "eyJhbG..." }

    res.status(200).json({ success: true, data: result });
    // 200 = OK — success, nothing new created

  } catch (error) {
    // service threw error (e.g. "Invalid email or password")
    res.status(401).json({ message: (error as Error).message });
    // 401 = Unauthorized — wrong credentials 🔒
  }
};

// ===========================
// GET ME
// ===========================

export const getMe = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {
    const result = await authService.getMe(req.user!.id);
    // req.user!.id → id from JWT token (attached by auth.middleware)
    // ! → tells TypeScript "I'm sure req.user exists here"
    //      safe because authenticate() middleware runs before this
    // call service → finds user in DB by id

    res.status(200).json({ success: true, data: result });
    // 200 = OK — just reading data, nothing created

  } catch (error) {
    // service threw error (e.g. "User not found")
    res.status(404).json({ message: (error as Error).message });
    // 404 = Not Found — user doesn't exist in DB
  }
};

/*
  HOW THIS FILE WORKS — FULL PICTURE:
  ─────────────────────────────────────────────────────────────────

  CONTROLLER RULE:
    THIN layer — never touches database directly!
    only does 3 things:
      1. reads from req (body, params, user)
      2. calls service
      3. sends res.json()

  STATUS CODES USED:
    201 → register  (something CREATED)
    200 → login, getMe (success, nothing created)
    400 → register error (bad request — invalid data)
    401 → login error (unauthorized — wrong credentials)
    404 → getMe error (not found — user doesn't exist)

  ERROR HANDLING:
    service throws Error("message")
    controller catches it
    sends error message back to client
    client never sees a server crash! ✅

  EXAMPLE — register success:
  ────────────────────────────
  POST /api/auth/register
  body: { full_name: "Alan", email: "alan@gmail.com", password: "mypass123" }
        ↓
  authService.register("Alan", "alan@gmail.com", "mypass123")
        ↓
  result = { user: { id:1, email:"alan@gmail.com", role:"customer" },
             token: "eyJhbGciOiJIUzI1NiJ9..." }
        ↓
  res.status(201).json({ success: true, data: result }) ✅

  EXAMPLE — register fail (duplicate email):
  ───────────────────────────────────────────
  POST /api/auth/register
  body: { email: "alan@gmail.com", ... } ← already exists!
        ↓
  authService.register() throws Error("Email already exists")
        ↓
  catch fires
  res.status(400).json({ message: "Email already exists" }) 🛑

  EXAMPLE — login fail (wrong password):
  ───────────────────────────────────────
  POST /api/auth/login
  body: { email: "alan@gmail.com", password: "wrongpass" }
        ↓
  authService.login() throws Error("Invalid email or password")
        ↓
  catch fires
  res.status(401).json({ message: "Invalid email or password" }) 🛑

  EXAMPLE — getMe success:
  ─────────────────────────
  GET /api/auth/me
  Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9..."
        ↓
  auth.middleware → extracts req.user.id = 1
        ↓
  authService.getMe(1) → finds user in DB
        ↓
  res.status(200).json({ success: true, data: { id:1, email:"alan@gmail.com", ... } }) ✅
*/