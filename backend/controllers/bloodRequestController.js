const supabase = require("../config/supabase");

// GET all blood requests
const getBloodRequests = async (req, res) => {
  try {
    const { data, error } = await supabase.from("blood_requests").select("*");

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single blood request by id
const getBloodRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("blood_requests")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) return res.status(400).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "Blood request not found" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE a new blood request
const createBloodRequest = async (req, res) => {
  const { patient_id, hospital_id, blood_group, city, status } = req.body;

  if (!blood_group || !city) {
    return res.status(400).json({ error: "`blood_group` and `city` are required" });
  }

  try {
    const insertPayload = {
      patient_id: patient_id || null,
      hospital_id: hospital_id || null,
      blood_group,
      city,
      status: status || "pending",
    };

    const { data, error } = await supabase
      .from("blood_requests")
      .insert([insertPayload])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: "Blood request created successfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a blood request
const updateBloodRequest = async (req, res) => {
  const { id } = req.params;
  const { patient_id, hospital_id, blood_group, city, status } = req.body;

  try {
    const updatePayload = {};
    if (patient_id !== undefined) updatePayload.patient_id = patient_id;
    if (hospital_id !== undefined) updatePayload.hospital_id = hospital_id;
    if (blood_group !== undefined) updatePayload.blood_group = blood_group;
    if (city !== undefined) updatePayload.city = city;
    if (status !== undefined) updatePayload.status = status;

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    const { data, error } = await supabase
      .from("blood_requests")
      .update(updatePayload)
      .eq("id", id)
      .select();

    if (error) return res.status(400).json({ error: error.message });
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Blood request not found" });
    }

    res.json({ message: "Blood request updated successfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE a blood request
const deleteBloodRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("blood_requests")
      .delete()
      .eq("id", id)
      .select();

    if (error) return res.status(400).json({ error: error.message });
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Blood request not found" });
    }

    res.json({ message: "Blood request deleted successfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getBloodRequests,
  getBloodRequestById,
  createBloodRequest,
  updateBloodRequest,
  deleteBloodRequest,
};
