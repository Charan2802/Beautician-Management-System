/**
 * Role-based access control middleware
 * Usage: authorizeRoles("Admin"), authorizeRoles("Employee")
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied for role: ${req.user.role}`,
      });
    }

    next();
  };
};
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

export const employeeOnly = (req, res, next) => {
  if (req.user.role !== "Employee") {
    return res.status(403).json({ message: "Employee access only" });
  }
  next();
};