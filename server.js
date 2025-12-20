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

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ DB Error:", err));

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
    submitted_at: Date
});
const Response = mongoose.model('Response', ResponseSchema);

// --- SAVE ROUTE ---
app.post('/api/submit', async (req, res) => {
    try {
        const submission = req.body;
        submission.submitted_at = new Date(); 
        const newResponse = new Response(submission);
        await newResponse.save();
        res.status(200).json({ message: "Data Saved" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed" });
    }
});

// --- EXPORT ROUTE (Updated: NO DATE COLUMN) ---
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
            // [REMOVED] The Date formatting logic is gone.

            let row = {
                "Student_Name_ID": user.participant_id,
                "Role": user.role,
                "Age": user.age_group,
                "Gender": user.gender
                // [REMOVED] "Date" column is gone.
            };

            user.answers.forEach((ans, index) => {
                const num = index + 1; 
                row[`Q${num}_Image`] = ans.email_id;
                row[`Q${num}_Verdict`] = ans.user_verdict;
                row[`Q${num}_Reason`] = ans.reason;
                row[`Q${num}_Time(sec)`] = (ans.time_taken_ms / 1000).toFixed(2);
            });

            flatData.push(row);
        });

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

// --- [NEW] DANGEROUS RESET ROUTE ---
// Visits this link to DELETE ALL DATA
app.get('/admin/reset-database', async (req, res) => {
    const password = req.query.pass;
    
    if (password !== process.env.ADMIN_PASS) {
        return res.status(403).send("Access Denied: You need the password to wipe the DB.");
    }

    try {
        await Response.deleteMany({}); // Deletes everything!
        res.send("✅ DATABASE WIPED. All previous records are gone. You can start fresh.");
    } catch (error) {
        res.status(500).send("Error deleting data.");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));