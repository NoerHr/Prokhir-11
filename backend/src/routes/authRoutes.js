const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

/**
 * RESTful API Routes for Authentication
 * Base path: /api/v1/auth
 */

// POST /api/v1/auth/login - User/Admin login
router.post("/login", authController.login);

// POST /api/v1/auth/register - User registration
router.post("/register", authController.register);

module.exports = router;
