/**
 * Custom error class dengan status code
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Error mapping dari business logic ke HTTP status
 */
const errorMap = {
    KATEGORI_NOT_FOUND: { status: 404, message: "Kategori tidak ditemukan" },
    BARANG_NOT_FOUND: { status: 404, message: "Barang tidak ditemukan" },
    BARANG_ALREADY_CLAIMED: { status: 400, message: "Barang sudah diambil" },
    USER_NOT_FOUND: { status: 404, message: "User tidak ditemukan" },
    INVALID_CREDENTIALS: { status: 401, message: "Username atau password salah" },
    DUPLICATE_USERNAME: { status: 409, message: "Username sudah digunakan" },
    DUPLICATE_NIM: { status: 409, message: "NIM sudah terdaftar" },
    DELETE_FAILED: { status: 500, message: "Gagal menghapus data" },
};

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    // 1. Log error untuk debugging
    console.error("❌ Error:", {
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        path: req.path,
        method: req.method,
    });

    // 2. Handle custom business errors
    if (errorMap[err.message]) {
        const { status, message } = errorMap[err.message];
        return res.status(status).json({
            success: false,
            message,
            error: process.env.NODE_ENV === "development" ? err.message : undefined,
        });
    }

    // 3. Handle AppError (custom errors dengan statusCode)
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // 4. Handle Multer file upload errors
    if (err.name === "MulterError") {
        return res.status(400).json({
            success: false,
            message: "Error saat upload file",
            error: err.message,
        });
    }

    // 5. Handle database errors
    if (err.code === "23505") { // PostgreSQL unique violation
        return res.status(409).json({
            success: false,
            message: "Data sudah ada",
        });
    }

    // 6. Handle validation errors (jika pakai validator library)
    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Validasi gagal",
            errors: err.errors,
        });
    }

    // 7. Default error (unknown/unexpected errors)
    res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
    });
};

module.exports = { errorHandler, AppError };
