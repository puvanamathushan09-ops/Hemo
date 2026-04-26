const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function diagnose() {
    console.log("🔍 Starting Hemo Diagnosis...");
    console.log("URL:", process.env.SUPABASE_URL);
    
    try {
        console.log("📡 Testing connectivity to Google...");
        const googleRes = await fetch("https://www.google.com", { method: 'HEAD' });
        console.log("✅ Google reached:", googleRes.status);
    } catch (e) {
        console.error("❌ Google failed:", e.message);
    }

    try {
        console.log("📡 Testing connectivity to Supabase API...");
        const start = Date.now();
        const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
        const duration = Date.now() - start;
        
        if (error) {
            console.error("❌ Supabase API failed:", error.message);
            console.error("Details:", error);
        } else {
            console.log(`✅ Supabase reached in ${duration}ms`);
        }
    } catch (e) {
        console.error("❌ Supabase fetch crashed:", e.message);
    }
}

diagnose();
