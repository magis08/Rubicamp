const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Set up SQLite database connection
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create users table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                age INTEGER NOT NULL,
                email TEXT NOT NULL
            )
        `);
    }
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes

// Route to display all users
app.get('/', (req, res) => {
    // Data dummy atau data dari database
    const users = [
        { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', age: 25, email: 'jane@example.com' }
    ];

    // Render halaman index dan passing data 'users'
    res.render('index', { users });
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', (req, res) => {
    const { name, age, email } = req.body;
    // Proses penambahan user ke database atau data storage
    // Setelah menambah, redirect ke halaman home
    res.redirect('/');
});


// Route to handle deleting a user
app.post('/delete/:id', (req, res) => {
    const userId = req.params.id;
    db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
        if (err) {
            console.error('Error deleting user:', err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/');
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
