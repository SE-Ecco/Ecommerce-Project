// WHAT: Standard helpers for consistent API responses
// IMPORTS: express (Response type)
// USED BY: All controllers

import { ApiResponse } from "../types"
// CONTAINS: sendSuccess(res, data, message), sendError(res, message, status), sendPaginated(res, data, total, page, limit)
export const successResponse = (data: any): ApiResponse => { // returns an ApiResponse object with success true and the provided data
  return {
    success: true, // indicates the operation was successful
    data: data     // the actual result of the operation
  }
}

export const errorResponse = (message: string): ApiResponse => {  // returns an ApiResponse object with success false and the provided error message
    return { // indicates the operation failed
        success: false,    // indicates the operation failed
        message: message   // the error message describing what went wrong
    }
}

// successResponse:
//   data: data ← the param itself"

// errorResponse:
//   message: message ← the param itself"?
// WITHOUT:
//   "Invalid password" 
//   { error: "bad login" }
//   { msg: "wrong pass" }
//   → frontend can't catch errors consistently 😱

// WITH:
//   errorResponse("Invalid password")
//   → { success: false, message: "Invalid password" }

// frontend ALWAYS checks:
//   if (!response.success) → show response.message ✅