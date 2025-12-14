require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Parser } = require('json2csv');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); 

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ DB Error:", err));

// --- Schema ---
const ResponseSchema = new mongoose.Schema({
    participant_id: String, 
    role: String,
    age_group: String,
    gender: String,
    answers: [
        {
            email_id: String,
            user_verdict: String,
            reason: String,
            time_taken_ms: Number
        }
    ],
    submitted_at: Date // Removed 'default' to handle it manually
});
const Response = mongoose.model('Response', ResponseSchema);

// --- Save Route (THE FIX IS HERE) ---
app.post('/api/submit', async (req, res) => {
    try {
        const submission = req.body;
        
        // FORCE the current server time right now
        submission.submitted_at = new Date(); 

        const newResponse = new Response(submission);
        await newResponse.save();
        res.status(200).json({ message: "Data Saved" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed" });
    }
});

// --- Wide Format Excel Download ---
app.get('/admin/download', async (req, res) => {
    const password = req.query.pass;
    const requestedRole = req.query.role;

    if (password !== process.env.ADMIN_PASS) {
        return res.status(403).send("Access Denied");
    }

    try {
        const filter = requestedRole ? { role: requestedRole } : {};
        const data = await Response.find(filter);

        if (data.length === 0) {
            return res.send(`No data found for category: ${requestedRole || 'All'}`);
        }

        let flatData = [];

        data.forEach(user => {
            // SAFE DATE HANDLING:
            // If date exists, format it. If not (old data), put "N/A".
            let dateStr = "N/A";
            if (user.submitted_at) {
                dateStr = new Date(user.submitted_at).toISOString().split('T')[0];
            }

            // 1. Create the base row
            let row = {
                "Student_Name_ID": user.participant_id,
                "Role": user.role,
                "Age": user.age_group,
                "Gender": user.gender,
                "Date": dateStr // <--- Using the fixed date string
            };

            // 2. Add columns for the 10 answers
            user.answers.forEach((ans, index) => {
                const num = index + 1; 
                row[`Q${num}_Image`] = ans.email_id;
                row[`Q${num}_Verdict`] = ans.user_verdict;
                row[`Q${num}_Reason`] = ans.reason;
                row[`Q${num}_Time(sec)`] = (ans.time_taken_ms / 1000).toFixed(2);
            });

            flatData.push(row);
        });

        // Convert to CSV
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(flatData);

        res.header('Content-Type', 'text/csv');
        res.attachment(`${requestedRole || 'All'}_Wide_Data.csv`);
        return res.send(csv);

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));