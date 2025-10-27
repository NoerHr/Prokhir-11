const express = require("express");
const router = express.Router();
const barangController = require("../controllers/barangController.js");
const upload = require("../config/multer.js"); // Middleware Multer Anda
const { authenticate, isAdmin } = require("../middlewares/auth");

// REMOVE ALL ZOD VALIDATION FROM ROUTES

/**
 * RESTful API Routes for Items (Barang)
 */

// GET /items - Get all items (Tidak perlu validasi)
router.get("/", barangController.getAllBarang);

// GET /items/:id - Get single item by ID (Jika Anda membuatnya nanti)
router.get("/:id", barangController.getBarangById); 

// POST /items - Create new item
router.post(
  "/",
  authenticate,
  isAdmin,
  // 1. Multer handle file uploads
  upload.fields([
    { name: "itemPhoto", maxCount: 1 },
    { name: "finderPhoto", maxCount: 1 },
  ]),
  // 2. Controller
  barangController.createBarang 
);

// DELETE /items/:id - Delete item
router.delete(
  "/:id", 
  authenticate,
  isAdmin,
  barangController.deleteBarang
);

// POST /items/:id/claim - Claim an item
router.post(
  "/:id/claim",
  authenticate,
  isAdmin,
  // 1. Multer handle file upload
  upload.single("claimerPhoto"),
  // 2. Controller
  barangController.claimBarang
);

module.exports = router;