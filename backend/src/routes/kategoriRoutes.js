const express = require("express");
const router = express.Router();
const kategoriController = require("../controllers/kategoriController.js");

// Import middleware validate dan skema Zod pakai require
const validate = require('../middlewares/validate.js'); // Pastikan validate.js pakai module.exports
const {
  createKategoriSchema,
  updateKategoriStatusSchema,
  deleteKategoriSchema
} = require('../validations/kategori.validation.js'); // Pastikan kategori.validation.js pakai module.exports

/**
 * Rute API untuk Kategori Barang
 */

// GET /categories - Ambil semua kategori (Tidak perlu validasi)
router.get("/", kategoriController.getAllKategori);

// POST /categories - Buat kategori baru
router.post(
  "/",
  validate(createKategoriSchema), // Jalankan validasi Zod dulu
  kategoriController.createKategori // Baru jalankan controller
);

// PATCH /categories/:id/status - Update status kategori
router.patch(
  "/:id/status",
  validate(updateKategoriStatusSchema), // Validasi ID di params dan status di body
  kategoriController.updateKategoriStatus
);

// DELETE /categories/:id - Hapus kategori
router.delete(
  "/:id",
  validate(deleteKategoriSchema), // Validasi ID di params
  kategoriController.deleteKategori
);

module.exports = router;