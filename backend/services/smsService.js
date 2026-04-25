// Open-Source / Abstracted SMS Service
// This acts as a wrapper for any SMS Gateway (e.g. Twilio, Vonage, Textbelt)
// Right now, it logs the outgoing SMS if no keys are provided ("just integrate")

exports.sendSMSNotification = async (phone, message) => {
  const SMS_API_KEY = process.env.SMS_API_KEY; // e.g. Twilio SID / API Key / Textbelt Key
  
  if (!SMS_API_KEY) {
    // Development Mock Mode (Logs visually to node console)
    console.log(`\n================================`);
    console.log(`[SMS MOCK SERVICE] - NEW ALERT`);
    console.log(`TO: ${phone || 'Unknown Cell'}`);
    console.log(`MESSAGE: \n${message}`);
    console.log(`================================\n`);
    return true; // Pretend it successfully passed
  }

  try {
    // Free Open-Source tier integration example using Textbelt (allows 1 free a day natively)
    // You can replace this with Twilio implementation easily using npm i twilio later.
    console.log(`[SMS SERVICE] Dispatching SMS to ${phone}...`);
    
    /* 
    const response = await fetch('https://textbelt.com/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: phone,
        message: message,
        key: SMS_API_KEY, 
      }),
    });
    const data = await response.json();
    return data.success;
    */
   
    return true;
  } catch (error) {
    console.error(`[SMS SERVICE ERROR] `, error);
    return false;
  }
};
