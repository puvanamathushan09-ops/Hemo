const supabase = require("../config/supabase");

// GET all donations
const getDonations = async (req, res) => {
  try {
    const { data, error } = await supabase.from("donations").select("*");

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single donation by id
const getDonationById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) return res.status(400).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "Donation not found" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE a new donation
const createDonation = async (req, res) => {
  const { donor_id, request_id, donation_date, status } = req.body;

  try {
    const insertPayload = {
      donor_id: donor_id || null,
      request_id: request_id || null,
      donation_date: donation_date || null,
      status: status || null,
    };

    const { data, error } = await supabase
      .from("donations")
      .insert([insertPayload])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: "Donation created successfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a donation
const updateDonation = async (req, res) => {
  const { id } = req.params;
  const { donor_id, request_id, donation_date, status } = req.body;

  try {
    const updatePayload = {};
    if (donor_id !== undefined) updatePayload.donor_id = donor_id;
    if (request_id !== undefined) updatePayload.request_id = request_id;
    if (donation_date !== undefined) updatePayload.donation_date = donation_date;
    if (status !== undefined) updatePayload.status = status;

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    const { data, error } = await supabase
      .from("donations")
      .update(updatePayload)
      .eq("id", id)
      .select();

    if (error) return res.status(400).json({ error: error.message });
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Donation not found" });
    }

    res.json({ message: "Donation updated successfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE a donation
const deleteDonation = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("donations")
      .delete()
      .eq("id", id)
      .select();

    if (error) return res.status(400).json({ error: error.message });
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Donation not found" });
    }

    res.json({ message: "Donation deleted successfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getDonations,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
};
