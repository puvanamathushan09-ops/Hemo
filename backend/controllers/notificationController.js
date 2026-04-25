const nodemailer = require("nodemailer");

// ─── INITIALIZE TRANSPORTER ───
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "placeholder@gmail.com",
    pass: process.env.EMAIL_PASS || "placeholder",
  },
});

const sendNotification = async (req, res) => {
  const { blood_group, hospital_name, units, donor_emails } = req.body;

  if (!blood_group || !hospital_name || !units || !donor_emails || !Array.isArray(donor_emails)) {
    return res.status(400).json({ error: "Missing required notification fields or invalid format" });
  }

  // Premium Web-Themed Email Template (HTML)
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #e63946, #c1121f); padding: 40px; text-align: center; color: #ffffff; }
        .content { padding: 40px; color: #334155; line-height: 1.6; }
        .badge { display: inline-block; padding: 6px 16px; background: rgba(230, 57, 70, 0.1); color: #e63946; border-radius: 50px; font-weight: 700; font-size: 14px; margin-bottom: 20px; }
        .hospital-box { background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #e63946; }
        .btn { display: inline-block; padding: 16px 32px; background: #e63946 !important; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; margin-top: 30px; box-shadow: 0 8px 24px rgba(230, 57, 70, 0.2); }
        .footer { padding: 30px; text-align: center; font-size: 12px; color: #94a3b8; background: #f8fafc; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin:0; font-size: 32px; color: #ffffff;">HEMO ALERT</h1>
          <p style="opacity: 0.9; margin-top: 10px; color: #ffffff;">Emergency Network Response</p>
        </div>
        <div class="content">
          <div class="badge">🚨 CRITICAL PRIORITY</div>
          <h2 style="color: #0f172a; margin-top: 0;">Be a Life-Saving Hero</h2>
          <p>We have detected an immediate requirement for <strong>${blood_group}</strong> blood in your vicinity. Your contribution can directly save a life today.</p>
          
          <div class="hospital-box">
            <div style="font-size: 14px; opacity: 0.7;">HOSPITAL NODE:</div>
            <div style="font-size: 18px; font-weight: 800; color: #0f172a;">${hospital_name}</div>
            <div style="margin-top: 10px;"><strong>Units Needed:</strong> ${units} Units Requested</div>
          </div>

          <p>Please visit the hospital center as soon as possible. Your identity is secured and authenticated through the Hemo network.</p>
          
          <center>
            <a href="http://localhost:3000/dashboard?tab=alerts" class="btn">View Patient Context & Help</a>
          </center>
        </div>
        <div class="footer">
          &copy; 2026 Hemo Blood Bank Network. All medical data is HIPAA compliant.<br/>
          Secure Node: #HEMO-NOTIF-001
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("⚠️ [HEMO SOS WARNING] SMTP Credentials missing in .env. Email broadcast skipped.");
      return res.status(200).json({ 
        message: "Simulation Mode: SOS Broadcast logged (Credentials Missing)", 
        recipients: donor_emails.length,
        handshake: "SIMULATED"
      });
    }

    const mailOptions = {
      from: `"Hemo Network" <${process.env.EMAIL_USER}>`,
      to: donor_emails.join(", "),
      subject: `🚨 EMERGENCY: ${blood_group} Blood Needed at ${hospital_name}`,
      html: emailHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📡 [HEMO SOS BROADCAST] Success: Sent to ${donor_emails.length} recipients. MessageId: ${info.messageId}`);
    
    res.status(200).json({ 
      message: "SOS Broadcast successful", 
      recipients: donor_emails.length,
      handshake: "OK"
    });
  } catch (error) {
    console.error("❌ [HEMO SOS ERROR] SMTP Handshake Failed:", error.message);
    // In dev mode, we still return 200 to allow the UI to proceed, but log the error
    res.status(200).json({ 
      message: "Broadcast simulated due to SMTP error: " + error.message, 
      recipients: donor_emails.length,
      handshake: "FAIL_BUT_PROCEEDED"
    });
  }
};

module.exports = { sendNotification };
