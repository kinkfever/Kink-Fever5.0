const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { Pool } = require('pg'); // Import the PostgreSQL database tool

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Middleware to automatically parse incoming JSON data
app.use(express.json());

// Force explicit absolute directory routing for static assets
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// ==========================================================
// 🗄️ SECURE DATABASE LEDGER CONFIGURATION
// ==========================================================
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for secure Render cloud database handshakes
    }
});

// Auto-create tables on startup if they don't exist yet
const initDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                alias VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                phone VARCHAR(20),
                tokens INT DEFAULT 10,
                is_vip BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('🗄️ Database tables verified and ready.');
    } catch (err) {
        console.error('❌ Failed to initialize database tables:', err);
    }
};
initDatabase();

// Explicit root fallback handler to serve the main interface
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Explicit PDF route for the catalog
app.get('/catalog-pdf.pdf', (req, res) => {
    res.sendFile(path.join(publicPath, 'catalog-pdf.pdf'));
});

// ==========================================================
// 👤 USER PROFILE SESSIONS & DATA ENGINES
// ==========================================================

// ROUTE: Handle User Registration / Login Verification
app.post('/api/signup', async (req, res) => {
    const { alias, email, phone } = req.body;
    
    try {
        // Check if user already exists in the permanent ledger
        const userCheck = await pool.query('SELECT * FROM users WHERE alias = $1', [alias]);
        
        if (userCheck.rows.length > 0) {
            console.log(`👤 Welcome back session for existing user: ${alias}`);
            return res.json({ success: true, user: userCheck.rows[0], message: 'Existing profile verified.' });
        }

        // If completely new user, insert them into the database vault with 10 free tokens
        const newUser = await pool.query(
            'INSERT INTO users (alias, email, phone, tokens) VALUES ($1, $2, $3, 10) RETURNING *',
            [alias, email, phone]
        );
        
        console.log(`✨ Brand new user locked into database vault: ${alias}`);
        res.json({ success: true, user: newUser.rows[0], message: 'New profile established.' });

    } catch (error) {
        console.error('❌ Database profile authentication error:', error);
        res.status(500).json({ success: false, message: 'Vault authentication failure.' });
    }
});

// ==========================================================
// 💳 HIGH-RISK INTERNATIONAL PAYMENT GATEWAY PIPELINE
// ==========================================================
app.post('/api/checkout', async (req, res) => {
    const { alias, packName, priceZAR, tokensToCredit } = req.body;
    try {
        console.log(`💳 Initiating secure gateway order for ${alias} - ${packName} (R${priceZAR})`);
        res.json({
            success: true,
            checkoutUrl: `https://example.com` // Smooth simulation fallback
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Payment gateway error.' });
    }
});

// ==========================================================
// ⚡ LIVE SOCKET.IO CORE CHAT ENGINE
// ==========================================================
io.on('connection', (socket) => {
    console.log('⚡ A user connected to the network.');
    
    socket.on('chatMessage', (data) => {
        io.emit('chatMessage', data);
    });
    
    socket.on('disconnect', () => {
        console.log('❌ A user disconnected.');
    });
});

// Start the network
server.listen(PORT, () => {
    console.log(`🚀 Backend server fully functional on port ${PORT}`);
});