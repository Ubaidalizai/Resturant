import { Role } from "../models/role.model.js";
import ErrorHandler from "../utils/errorHandler.util.js";

export const authorize = (...requiredPermissions) => {
  return async (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler(401, "Unauthorized"));
    }
    // Get role with permissions
    const role = await Role.findById(req.user.role).populate("permissions");

    if (!role) {
      return next(new ErrorHandler(403, "No role assigned to the user"));
    }

    // Extract permission keys
    const userPermissions = role.permissions.map(p => p.key);

    // Check if user has any required permission
    const allowed = requiredPermissions.some(permission =>
      userPermissions.includes(permission)
    );

    if (!allowed) {
      return next(new ErrorHandler(403, "You don't have permission to access this resource"));
    }
    next();
  };
};