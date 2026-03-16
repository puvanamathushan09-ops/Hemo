const express = require("express");
const router = express.Router();
const {
  getDonations,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
} = require("../controllers/donationController");

router.get("/", getDonations);
router.get("/:id", getDonationById);
router.post("/", createDonation);
router.put("/:id", updateDonation);
router.delete("/:id", deleteDonation);

module.exports = router;
