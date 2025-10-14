const express = require("express");
const router = express.Router();
const claimController = require("../controllers/claimController");
const upload = require("../config/multer");

router.post(
    "/claim-request",
    upload.single("bukti"),
    claimController.createClaimRequest
);
router.get("/claim-requests/user/:userId", claimController.getUserClaimRequests);
router.get("/claim-requests", claimController.getAllClaimRequests);
router.patch("/claim-request/:id/status", claimController.updateClaimStatus);
router.delete("/claim-request/:id", claimController.deleteClaimRequest);

module.exports = router;
