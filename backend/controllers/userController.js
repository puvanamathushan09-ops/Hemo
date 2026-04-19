const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
};

const registerUser = async (req, res) => {
  const { full_name, email, password, phone, blood_group, city, role } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: "`full_name`, `email` and `password` are required" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    const insertPayload = {
      full_name,
      email,
      password: hashed,
      phone: phone || null,
      blood_group: blood_group || null,
      city: city || null,
      role: role || null
    };

    // Request the inserted row(s) to be returned
    const { data, error } = await supabase.from("users").insert([insertPayload]).select();

    // If Supabase returned an error, forward it
    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(400).json({ error: error.message });
    }

    // If data is null (often due to RLS/policy or returning being blocked), try a fallback SELECT by email
    let returned = data;
    if (!returned) {
      console.warn('Supabase returned null data for insert, attempting fallback select');
      const { data: fetched, error: fetchErr } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .limit(1)
        .maybeSingle();

      if (fetchErr) {
        console.error('Fallback fetch error:', fetchErr);
      } else {
        returned = fetched ? (Array.isArray(fetched) ? fetched : [fetched]) : null;
      }
    }

    // Remove password from response
    const safeData = Array.isArray(returned)
      ? returned.map(({ password, ...rest }) => rest)
      : returned;

    res.status(201).json({ message: "User registered successfully", data: safeData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: '`email` and `password` are required' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1)
      .maybeSingle();

    if (error) return res.status(400).json({ error: error.message });
    if (!data) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, data.password || '');
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = { userId: data.id, email: data.email, role: data.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });

    const { password: _p, ...safeUser } = data;
    res.json({ message: 'Login successful', token, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Prevent password update via this route for simplicity
  delete updateData.password;
  delete updateData.email; // Also prevent email update for safety

  try {
    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Profile updated succesfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUsers, registerUser, loginUser, updateUser, deleteUser };