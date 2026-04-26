const nodemailer = require("nodemailer");
const { client: whatsappClient } = require("../whatsappClient");

// ─── INITIALIZE EMAIL TRANSPORTER ───
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "placeholder@gmail.com",
    pass: process.env.EMAIL_PASS || "placeholder",
  },
});

const sendNotification = async (req, res) => {
  const { blood_group, hospital_name, hospital_address, units, donors } = req.body;

  if (!blood_group || !hospital_name || !units || !donors || !Array.isArray(donors)) {
    return res.status(400).json({ error: "Missing required notification fields or invalid format" });
  }

  const emails = donors.map(d => d.email).filter(Boolean);
  const phones = donors.map(d => d.phone).filter(Boolean);

  // 1. WhatsApp Template (Zero Cost)
  const waBody = `🚨 *HEMO EMERGENCY SOS* 🚨\n\nBiological Type: *${blood_group}*\nHospital Node: *${hospital_name}*\nLocation: *${hospital_address || "Contact Hospital"}*\nUnits Required: *${units}*\n\nYour contribution can save a life today. View details and accept the mission below:\n\n👉 https://hemo-don.netlify.app/dashboard?tab=alerts`;

  // 2. Email Template (Clinical Detail)
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head><style>
      body { font-family: 'Segoe UI', sans-serif; background: #f8fafc; }
      .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.05); }
      .header { background: linear-gradient(135deg, #e63946, #c1121f); padding: 40px; text-align: center; color: #fff; }
      .content { padding: 40px; color: #334155; line-height: 1.6; }
      .badge { display: inline-block; padding: 6px 16px; background: rgba(230, 57, 70, 0.1); color: #e63946; border-radius: 50px; font-weight: 700; }
      .btn { display: inline-block; padding: 16px 32px; background: #e63946; color: #fff !important; text-decoration: none; border-radius: 12px; font-weight: 700; margin-top: 30px; }
    </style></head>
    <body><div class="container">
      <div class="header"><h1>HEMO ALERT</h1><p>Emergency Network Response</p></div>
      <div class="content">
        <div class="badge">🚨 CRITICAL PRIORITY</div>
        <h2>Be a Life-Saving Hero</h2>
        <p>An immediate requirement for <b>${blood_group}</b> blood has been detected at <b>${hospital_name}</b> (${hospital_address}).</p>
        <p>Your identity is secured through the Hemo network.</p>
        <center><a href="https://hemo-don.netlify.app/dashboard?tab=alerts" class="btn">View Request & Help</a></center>
      </div>
    </div></body></html>
  `;

  // --- Process WhatsApp (Multi-cast) ---
  const waPromise = (async () => {
    try {
      const results = await Promise.all(phones.map(async (phone) => {
        let formatted = phone.replace(/\D/g, '');
        if (formatted.startsWith('0')) formatted = '94' + formatted.substring(1);
        if (!formatted.endsWith('@c.us')) formatted += '@c.us';
        
        return whatsappClient.sendMessage(formatted, waBody);
      }));
      return { status: "sent", count: results.length };
    } catch (err) {
      return { status: "failed/uninitialized", error: err.message };
    }
  })();

  // --- Process Email ---
  const emailPromise = (async () => {
    if (emails.length === 0 || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) return { status: "skipped" };
    try {
      await transporter.sendMail({
        from: '"Hemo Network" <' + process.env.EMAIL_USER + '>',
        to: emails.join(", "),
        subject: `🚨 EMERGENCY: ${blood_group} Blood Needed`,
        html: emailHtml
      });
      return { status: "sent", count: emails.length };
    } catch (err) {
      return { status: "error", error: err.message };
    }
  })();

  try {
    const [waRes, emailRes] = await Promise.all([waPromise, emailPromise]);
    console.log(`📡 [HEMO SOS] Multi-Channel Alert Complete. WA: ${waRes.status}, Email: ${emailRes.status}`);
    res.status(200).json({ message: "SOS signals dispatched", waRes, emailRes });
  } catch (error) {
    res.status(500).json({ error: "Broadcast failed", details: error.message });
  }
};

module.exports = { sendNotification };
