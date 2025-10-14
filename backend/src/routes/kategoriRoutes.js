const express = require("express");
const router = express.Router();
const kategoriController = require("../controllers/kategoriController");

// Endpoint untuk kategori barang
router.get("/get-kategori-barang", kategoriController.getAllKategori);
router.post("/create-kategori", kategoriController.createKategori);
router.patch("/update-kategori-status/:id", kategoriController.updateKategoriStatus);
router.delete("/delete-kategori-barang/:id", kategoriController.deleteKategori);

module.exports = router;
