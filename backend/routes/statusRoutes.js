const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

router.get("/", async (req, res) => {
    
    let dbStatus = "checked";
    let dbError = null;

    try {
        const { error } = await supabase.from('users').select('id').limit(1);
        if (error) {
            dbStatus = "error";
            dbError = error.message;
        } else {
            dbStatus = "connected";
        }
    } catch (e) {
        dbStatus = "unreachable";
        dbError = e.message;
    }

    res.status(200).json({
        status: dbStatus === "connected" ? "online" : "degraded",
        timestamp: new Date().toISOString(),
        services: {
            database: {
                status: dbStatus,
                error: dbError
            }
        }
    });
});

module.exports = router;
