const { verifyToken } = require("../config/jwt");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token tidak ditemukan. Silakan login terlebih dahulu",
    });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      message: "Token tidak valid atau sudah kadaluarsa",
    });
  }

  req.user = decoded;
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Akses ditolak. Hanya admin yang diizinkan",
    });
  }
  next();
};

module.exports = {
  authenticate,
  isAdmin,
};
