// WHAT: Checks user role — blocks access if wrong role
// IMPORTS: types/express.d.ts
// USED BY: routes/admin.routes.ts, routes/category.routes.ts, routes/product.routes.ts
// USAGE: authorize('super_admin') or authorize('shop_admin', 'super_admin')
// FLOW: check req.user.role is in allowedRoles → yes → next() | no → 403 Forbidden
// EXPORTS: authorize(...roles: string[])
// ⚠️ Must be placed AFTER auth.middleware (req.user must exist!)

import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

// WHY a function that RETURNS a function (higher-order function):
// Express middleware only accepts (req, res, next) — but we need to pass in
// WHICH roles are allowed too. So authorize('super_admin') builds a custom
// middleware function first, THEN Express calls that returned function per-request.
export const authorize = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // WHY req.user?. : defensive check — auth.middleware SHOULD have run first
        // and attached req.user, but this guards against missing/misordered middleware
        const userRole = req.user?.role;

        // WHY !allowedRoles.includes(): if the user's role is NOT one of the allowed roles,
        // block them immediately — this is the actual permission check
        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json(
                errorResponse('You do not have permission to access this resource')
            );
        }

        // WHY next(): role matched — let the request continue to the controller
        next();
    };
};

// ── 🍽️ THE STORY ─────────────────────────────────────────
// role.middleware.ts = the VIP list checker at the club door 🎫
// authorize('super_admin') → "only people on the SUPER ADMIN list get in"
// authorize('shop_admin', 'super_admin') → "either list works, come on in"
// checks req.user.role (already verified by auth.middleware, trusted)
// on the list? → next(), welcome in
// not on the list? → 403, "sorry, you're not allowed here"