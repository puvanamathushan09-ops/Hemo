const express = require("express");
const router = express.Router();
const {
  getBloodRequests,
  getBloodRequestById,
  createBloodRequest,
  updateBloodRequest,
  deleteBloodRequest,
} = require("../controllers/bloodRequestController");

router.get("/", getBloodRequests);
router.get("/:id", getBloodRequestById);
router.post("/", createBloodRequest);
router.put("/:id", updateBloodRequest);
router.delete("/:id", deleteBloodRequest);

module.exports = router;
