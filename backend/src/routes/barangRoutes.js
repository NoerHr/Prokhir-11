const express = require("express");
const router = express.Router();
const barangController = require("../controllers/barangController");
const upload = require("../config/multer");

/**
 * RESTful API Routes for Items (Barang)
 * Base path: /api/v1/items
 */

// GET /api/v1/items - Get all items
router.get("/", barangController.getAllBarang);

// POST /api/v1/items - Create new item
router.post(
  "/",
  upload.fields([
    { name: "itemPhoto", maxCount: 1 },
    { name: "finderPhoto", maxCount: 1 },
  ]),
  barangController.createBarang
);

// GET /api/v1/items/:id - Get single item by ID
// router.get("/:id", barangController.getBarangById);

// DELETE /api/v1/items/:id - Delete item
router.delete("/:id", barangController.deleteBarang);

// POST /api/v1/items/:id/claim - Claim an item
router.post(
  "/:id/claim",
  upload.single("claimerPhoto"),
  barangController.claimBarang
);

module.exports = router;
