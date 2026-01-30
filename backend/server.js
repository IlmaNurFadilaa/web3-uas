// FILE: backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// DATA KITA (Pastikan variabelnya campaigns)
const campaigns = [
    { 
        id: 1, 
        title: "Bantuan Bencana Alam", 
        category: "KEMANUSIAAN", 
        target: "10 ETH",
        collected: "2.5 ETH"
    },
    { 
        id: 2, 
        title: "Beasiswa Pendidikan IT", 
        category: "PENDIDIKAN", 
        target: "50 ETH",
        collected: "12 ETH"
    },
    { 
        id: 3, 
        title: "Pembangunan Masjid", 
        category: "INFRASTRUKTUR", 
        target: "100 ETH",
        collected: "45 ETH"
    }
];

// ENDPOINT HARUS SAMA DENGAN FRONTEND
app.get('/api/transactions', (req, res) => {
    res.json({ success: true, data: campaigns });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});