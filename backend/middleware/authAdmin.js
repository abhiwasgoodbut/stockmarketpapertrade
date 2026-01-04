import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.json({
        success: false,
        message: "Admin not authorized"
      });
    }

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    if (decoded.role !== "ADMIN") {
      return res.json({
        success: false,
        message: "Admin access denied"
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.json({
      success: false,
      message: "Invalid or expired admin token"
    });
  }
};

export default adminAuth;