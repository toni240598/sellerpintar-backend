import jwt from "jsonwebtoken";

const excludedRoutes = [
  { method: "POST", path: "/api/register" },
  { method: "POST", path: "/api/login" },
];

const authMiddleware = (req, res, next) => {
  const isExcluded = excludedRoutes.some(
    (route) => route.method === req.method && route.path === req.path
  );

  if (isExcluded) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Authorization token missing or invalid",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // menyimpan data user ke req.user
    next();
  } catch (err) {
    return res.status(401).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
