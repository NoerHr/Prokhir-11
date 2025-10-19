const express = require("express");
const router = express.Router();
const claimController = require("../controllers/claimController");
const upload = require("../config/multer");

/**
 * RESTful API Routes for Claim Requests
 * Base path: /api/v1/claims
 */

// GET /api/v1/claims - Get all claim requests
router.get("/", claimController.getAllClaimRequests);

// POST /api/v1/claims - Create new claim request
router.post("/", upload.single("bukti"), claimController.createClaimRequest);

// GET /api/v1/claims/user/:userId - Get claims by user ID
router.get("/user/:userId", claimController.getUserClaimRequests);

// PATCH /api/v1/claims/:id/status - Update claim status (approve/reject)
router.patch("/:id/status", claimController.updateClaimStatus);

// DELETE /api/v1/claims/:id - Delete claim request
router.delete("/:id", claimController.deleteClaimRequest);

module.exports = router;
