const express = require("express");
const router = express.Router();
const barangController = require("../controllers/barangController");
const upload = require("../config/multer");

// Endpoint untuk barang
router.get("/get-barang", barangController.getAllBarang);

// Upload multiple files: itemPhoto dan finderPhoto
router.post(
  "/create-barang",
  upload.fields([
    { name: "itemPhoto", maxCount: 1 },
    { name: "finderPhoto", maxCount: 1 },
  ]),
  barangController.createBarang
);

// Upload single file untuk claimer photo
router.post(
  "/claim-barang/:id",
  upload.single("claimerPhoto"),
  barangController.claimBarang
);

router.delete("/delete-barang/:id", barangController.deleteBarang);

module.exports = router;
