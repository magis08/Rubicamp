const sqlite3 = require('sqlite3').verbose();

// Membuat koneksi ke database
let db = new sqlite3.Database('university.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the university database.');
});

// Membuat tabel mahasiswa
db.run(`CREATE TABLE IF NOT EXISTS mahasiswa (
    nim TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    alamat TEXT,
    jurusan TEXT
)`, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Table mahasiswa created or already exists.');
    }
});

// Membuat tabel jurusan
db.run(`CREATE TABLE IF NOT EXISTS jurusan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    namajurusan TEXT NOT NULL
)`, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Table jurusan created or already exists.');
    }
});

// Membuat tabel dosen
db.run(`CREATE TABLE IF NOT EXISTS dosen (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL
)`, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Table dosen created or already exists.');
    }
});

// Membuat tabel matakuliah
db.run(`CREATE TABLE IF NOT EXISTS matakuliah (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    sks INTEGER NOT NULL
)`, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Table matakuliah created or already exists.');
    }
});

// Menutup koneksi
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
});
