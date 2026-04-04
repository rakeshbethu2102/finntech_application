exports.requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    let role = (req.body && req.body.role) || req.query.role || req.header("x-user-role");

    if (role === "user") {
      role = "viewer";
    }

    if (!role) {
      return res.status(401).json({
        success: false,
        message: "User role is required to access this endpoint",
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