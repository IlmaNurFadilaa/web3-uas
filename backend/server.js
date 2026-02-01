const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

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

let transactionHistory = [];

app.get('/api/transactions', (req, res) => {
    res.json({ success: true, data: campaigns });
});

app.get('/api/history', (req, res) => {
    res.json({ success: true, data: transactionHistory });
});

app.post('/api/history', (req, res) => {
    const { title, hash, amount, date } = req.body;
    
    const newRecord = {
        id: transactionHistory.length + 1,
        title,
        hash,
        amount,
        date
    };

    transactionHistory.unshift(newRecord);

    console.log("Riwayat Baru Disimpan:", newRecord);
    res.json({ success: true, message: "Riwayat tersimpan" });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});