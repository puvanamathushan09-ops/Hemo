const express = require("express");
const router = express.Router();
const {
  getHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital,
} = require("../controllers/hospitalController");

router.get("/", getHospitals);
router.get("/:id", getHospitalById);
router.post("/", createHospital);
router.put("/:id", updateHospital);
router.delete("/:id", deleteHospital);

module.exports = router;
