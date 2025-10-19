const express = require("express");
const router = express.Router();
const kategoriController = require("../controllers/kategoriController");

/**
 * RESTful API Routes for Categories (Kategori Barang)
 * Base path: /api/v1/categories
 */

// GET /api/v1/categories - Get all categories
router.get("/", kategoriController.getAllKategori);

// POST /api/v1/categories - Create new category
router.post("/", kategoriController.createKategori);

// PATCH /api/v1/categories/:id/status - Update category status
router.patch("/:id/status", kategoriController.updateKategoriStatus);

// DELETE /api/v1/categories/:id - Delete category
router.delete("/:id", kategoriController.deleteKategori);

module.exports = router;
