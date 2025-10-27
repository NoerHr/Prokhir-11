const express = require("express");
const router = express.Router();
const claimController = require("../controllers/claimController.js");
const upload = require("../config/multer.js");
const { authenticate, isAdmin } = require("../middlewares/auth");

/**
 * RESTful API Routes for Claim Requests
 */

// GET /claims - Get all claim requests (No validation needed here)
router.get("/", authenticate, isAdmin, claimController.getAllClaimRequests);

// POST /claims - Create new claim request
router.post(
  "/",
  authenticate,
  upload.single("bukti"), // Multer handles file first
  claimController.createClaimRequest // Then controller
);

// GET /claims/user/:userId - Get claims by user ID (NIM)
router.get(
  "/user/:userId",
  authenticate,
  claimController.getUserClaimRequests
);

// PATCH /claims/:id/status - Update claim status (approve/reject)
router.patch(
  "/:id/status",
  authenticate,
  isAdmin,
  claimController.updateClaimStatus
);

// DELETE /claims/:id - Delete claim request
router.delete(
  "/:id",
  authenticate,
  isAdmin,
  claimController.deleteClaimRequest
);

module.exports = router;