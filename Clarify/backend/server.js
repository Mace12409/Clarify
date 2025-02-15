import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your client's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'clarify'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('MySQL connection error:', err);
        process.exit(1); // Exit if database fails to connect
    }
    console.log('MySQL connected...');
});

// Corrected table creation query
const createTestSessionsTable = `
    CREATE TABLE IF NOT EXISTS test_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        username VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        start_time TIMESTAMP NULL,
        stop_time TIMESTAMP NULL,
        test_result FLOAT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

// Function to execute migration
const migrate = () => {
    return new Promise((resolve, reject) => {
        db.query(createTestSessionsTable, (err, result) => {
            if (err) {
                console.error('Error during migration:', err);
                reject(err);
            } else {
                console.log('Test sessions table created successfully');
                resolve(result);
            }
        });
    });
};

// Run migration
migrate().catch(err => console.error('Migration failed:', err));

// Route to save session
app.post('/api/save-session', (req, res) => {
    const { user_id, username, age, start_time, stop_time, test_result } = req.body;
    if (!user_id || !username || !age) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
        INSERT INTO test_sessions (user_id, username, age, start_time, stop_time, test_result)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [user_id, username, age, start_time || null, stop_time || null, test_result || null], (err, result) => {
        if (err) {
            console.error('Error saving session:', err);
            return res.status(500).json({ message: 'Error saving session' });
        }
        res.json({ message: 'Session saved successfully', sessionId: result.insertId });
    });
});

// Route to get a session by ID
app.get('/api/get-session/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM test_sessions WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error retrieving session:', err);
            return res.status(500).json({ message: 'Error retrieving session' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.json(results[0]);
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});