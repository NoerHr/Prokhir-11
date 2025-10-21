const express = require('express');
const router = express.Router();

// Import controller Anda menggunakan require
const { register, login } = require('../controllers/authController.js');

// Import middleware validasi menggunakan require
const validate = require('../middlewares/validate.js');

// Import skema validasi Zod menggunakan require
const { registerSchema, loginSchema } = require('../validations/auth.validation.js');

// Terapkan middleware 'validate' sebelum controller
// Alur: Request -> validate(registerSchema) -> register (controller)
router.post(
  '/register',
  validate(registerSchema), // Validasi data register
  register // Controller hanya dijalankan jika validasi lolos
);

// Terapkan hal yang sama untuk login
router.post(
  '/login',
  validate(loginSchema), // Validasi data login
  login // Controller hanya dijalankan jika validasi lolos
);

// Gunakan module.exports
module.exports = router;