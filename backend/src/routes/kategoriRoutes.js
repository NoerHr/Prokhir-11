const express = require("express");
const router = express.Router();
const kategoriController = require("../controllers/kategoriController");
const { authenticate, isAdmin } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const {
  createKategoriSchema,
  updateKategoriStatusSchema,
  deleteKategoriSchema,
} = require("../validations/kategori.validation");

/**
 * Rute API untuk Kategori Barang
 */

// GET /categories - Ambil semua kategori (Tidak perlu validasi)
router.get("/", kategoriController.getAllKategori);

// POST /categories - Buat kategori baru
router.post(
  "/",
  authenticate,
  isAdmin,
  validate(createKategoriSchema),
  kategoriController.createKategori
);

// PATCH /categories/:id/status - Update status kategori
router.patch(
  "/:id/status",
  authenticate,
  isAdmin,
  validate(updateKategoriStatusSchema),
  kategoriController.updateKategoriStatus
);

// DELETE /categories/:id - Hapus kategori
router.delete(
  "/:id",
  authenticate,
  isAdmin,
  validate(deleteKategoriSchema),
  kategoriController.deleteKategori
);

module.exports = router;