const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Initialize the WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth' // Persists your login session locally
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

let isReady = false;

client.on('qr', (qr) => {
    isReady = false;
    console.log('\n-----------------------------------------------------------');
    console.log('📢 HEMO WA-SOS: SCAN THIS QR CODE WITH YOUR WHATSAPP APP');
    console.log('-----------------------------------------------------------\n');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    isReady = true;
    console.log('\n✅ HEMO WA-SOS: WHATSAPP CLIENT IS ONLINE AND BONDED!\n');
});

client.on('authenticated', () => {
    console.log('🔐 HEMO WA-SOS: AUTHENTICATED SUCCESSFULLY');
});

client.on('auth_failure', msg => {
    isReady = false;
    console.error('❌ HEMO WA-SOS: AUTHENTICATION FAILURE', msg);
});

client.on('disconnected', (reason) => {
    isReady = false;
    console.log('❌ HEMO WA-SOS: WHATSAPP CLIENT DISCONNECTED', reason);
});

client.initialize();

const getWhatsappStatus = () => ({
    online: isReady,
    info: isReady ? "WhatsApp Client is Bonded and Online" : "WhatsApp Client is Offline/Initializing"
});

module.exports = { client, getWhatsappStatus };
