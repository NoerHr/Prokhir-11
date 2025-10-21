const express = require("express");
const router = express.Router();
const claimController = require("../controllers/claimController.js");
const upload = require("../config/multer.js"); // Your Multer middleware

// Import validate middleware and Zod schemas using require
const validate = require('../middlewares/validate.js'); // Assuming validate.js uses module.exports
const {
  createClaimSchema,
  getUserClaimsSchema,
  updateClaimStatusSchema,
  deleteClaimSchema
} = require('../validations/claim.validation.js'); // Assuming claim.validation.js uses module.exports

/**
 * RESTful API Routes for Claim Requests
 */

// GET /claims - Get all claim requests (No validation needed here)
router.get("/", claimController.getAllClaimRequests);

// POST /claims - Create new claim request
router.post(
  "/",
  upload.single("bukti"), // Multer handles file first
  validate(createClaimSchema), // Then Zod validates body
  claimController.createClaimRequest // Then controller
);

// GET /claims/user/:userId - Get claims by user ID (NIM)
router.get(
  "/user/:userId",
  validate(getUserClaimsSchema), // Validate userId in params
  claimController.getUserClaimRequests
);

// PATCH /claims/:id/status - Update claim status (approve/reject)
router.patch(
  "/:id/status",
  validate(updateClaimStatusSchema), // Validate id in params and status/adminNote in body
  claimController.updateClaimStatus
);

// DELETE /claims/:id - Delete claim request
router.delete(
  "/:id",
  validate(deleteClaimSchema), // Validate id in params
  claimController.deleteClaimRequest
);

module.exports = router;