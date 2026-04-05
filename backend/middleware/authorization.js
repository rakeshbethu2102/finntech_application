exports.requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    let role = req.header("x-user-role") || req.query.role || (req.body && req.body.role);

    if (role === "user") {
      role = "viewer";
    }

    const validRoles = ["viewer", "analyst", "admin"];

    if (!role) {
      return res.status(401).json({
        success: false,
        message: "User role is required to access this endpoint",
      });
    }

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role value. Expected one of: ${validRoles.join(", ")}`,
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: insufficient permissions",
      });
    }

    next();
  };
};