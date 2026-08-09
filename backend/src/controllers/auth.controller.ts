// WHAT: Handles HTTP requests for auth — calls service → sends response
// IMPORTS: services/auth.service.ts
// USED BY: routes/auth.routes.ts
// HANDLES: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
// RULE: controller is THIN — receives request, calls service, sends response. nothing else!
import { successResponse, errorResponse } from '../utils/response';
import { Request, Response, NextFunction } from 'express' // 🔧 added NextFunction
import * as authService from '../services/auth.service'

// ===========================
// REGISTER
// ===========================
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction // 🔧 added
): Promise<void> => {
  try {
    const { name , email, password_hash } = req.body;
    const result = await authService.register(name, email, password_hash);
    res.status(201).json(successResponse(result));
  } catch (error) {
    next(error); // 🔧 fix
  }
};

// ===========================
// LOGIN
// ===========================
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction // 🔧 added
): Promise<void> => {
  try {
    const { email, password_hash } = req.body;
    const result = await authService.login(email, password_hash);
    res.status(200).json(successResponse(result));
  } catch (error) {
    next(error); // 🔧 fix
  }
};

// ===========================
// GET ME
// ===========================
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction // 🔧 added
): Promise<void> => {
  try {
    const result = await authService.getMe(req.user!.id);
    res.status(200).json(successResponse(result));
  } catch (error) {
    next(error); // 🔧 fix
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

  ERROR HANDLING:
    service throws Error("message")
    controller catches it → next(error)
    error.middleware handles it → sends response to client ✅

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
  next(error) → error.middleware → sends 500 to client 🛑

  EXAMPLE — login fail (wrong password):
  ───────────────────────────────────────
  POST /api/auth/login
  body: { email: "alan@gmail.com", password: "wrongpass" }
        ↓
  authService.login() throws Error("Invalid email or password")
        ↓
  next(error) → error.middleware → sends 500 to client 🛑

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