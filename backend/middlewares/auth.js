import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";

/**
 * Middleware to check if user is authenticated
 */
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  // If no token found
  if (!token) {
    return next(new ErrorHandler("User is not authenticated.", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("✅ Decoded ID:", decoded.id);

    // Find user by ID
    const user = await User.findById(decoded.id);
    console.log("🔍 Found User:", user ? user.name : "Not found");

    if (!user) {
      return next(new ErrorHandler("User not found in database.", 404));
    }

    // Set user on request object
    req.user = user;

    // Proceed to next middleware/controller
    next();
  } catch (error) {
    console.error("🚫 Error verifying token:", error.message);
    return next(new ErrorHandler("Invalid or expired token.", 401));
  }
});

/**
 * Middleware to check if user has required role(s)
 * @param  {...String} roles - Roles allowed to access route
 */
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource.`,
          403
        )
      );
    }
    next();
  };
};