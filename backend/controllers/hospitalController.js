const supabase = require("../config/supabase");

// GET all hospitals
const getHospitals = async (req, res) => {
  try {
    const { data, error } = await supabase.from("hospitals").select("*");

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single hospital by id
const getHospitalById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("hospitals")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) return res.status(400).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "Hospital not found" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE a new hospital
const createHospital = async (req, res) => {
  const { name, city, contact_number, email, address } = req.body;

  if (!name || !city) {
    return res.status(400).json({ error: "`name` and `city` are required" });
  }

  try {
    const insertPayload = {
      name,
      city,
      contact_number: contact_number || null,
      email: email || null,
      address: address || null,
    };

    const { data, error } = await supabase
      .from("hospitals")
      .insert([insertPayload])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: "Hospital created successfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a hospital
const updateHospital = async (req, res) => {
  const { id } = req.params;
  const { name, city, contact_number, email, address } = req.body;

  try {
    const updatePayload = {};
    if (name !== undefined) updatePayload.name = name;
    if (city !== undefined) updatePayload.city = city;
    if (contact_number !== undefined) updatePayload.contact_number = contact_number;
    if (email !== undefined) updatePayload.email = email;
    if (address !== undefined) updatePayload.address = address;

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    const { data, error } = await supabase
      .from("hospitals")
      .update(updatePayload)
      .eq("id", id)
      .select();

    if (error) return res.status(400).json({ error: error.message });
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    res.json({ message: "Hospital updated successfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE a hospital
const deleteHospital = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("hospitals")
      .delete()
      .eq("id", id)
      .select();

    if (error) return res.status(400).json({ error: error.message });
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    res.json({ message: "Hospital deleted successfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital,
};
