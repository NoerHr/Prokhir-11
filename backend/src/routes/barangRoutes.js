const express = require("express");
const router = express.Router();
const barangController = require("../controllers/barangController.js");
const upload = require("../config/multer.js"); // Middleware Multer Anda

// Import middleware validate dan skema Zod
const validate = require('../middlewares/validate.js'); 
const { 
  createBarangSchema, 
  claimBarangSchema, 
  deleteBarangSchema 
} = require('../validations/barang.validation.js');

/**
 * RESTful API Routes for Items (Barang)
 */

// GET /items - Get all items (Tidak perlu validasi)
router.get("/", barangController.getAllBarang);

// POST /items - Create new item
router.post(
  "/",
  // 1. Multer handle file uploads
  upload.fields([
    { name: "itemPhoto", maxCount: 1 },
    { name: "finderPhoto", maxCount: 1 },
  ]),
  // 2. Zod validate req.body
  validate(createBarangSchema), 
  // 3. Controller
  barangController.createBarang 
);

// DELETE /items/:id - Delete item
router.delete(
  "/:id", 
  validate(deleteBarangSchema), // Validasi req.params.id
  barangController.deleteBarang
);

// POST /items/:id/claim - Claim an item
router.post(
  "/:id/claim",
  // 1. Multer handle file upload
  upload.single("claimerPhoto"),
  // 2. Zod validate req.params.id dan req.body
  validate(claimBarangSchema), 
  // 3. Controller
  barangController.claimBarang
);

// GET /items/:id - Get single item by ID (Jika Anda membuatnya nanti)
// router.get("/:id", validate(getBarangSchema), barangController.getBarangById); 

module.exports = router;