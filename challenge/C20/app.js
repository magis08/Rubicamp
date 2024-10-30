const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./data.db');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Pagination: menentukan berapa data per halaman
const ITEMS_PER_PAGE = 5;

// Route utama dengan pagination dan filter
app.get('/', (req, res) => {
  let page = parseInt(req.query.page) || 1;
  const ITEMS_PER_PAGE = 5;
  let offset = (page - 1) * ITEMS_PER_PAGE;

  // Mengambil parameter pencarian dari req.query
  const { name, height, weight, birthdateMin, birthdateMax, isMarried, operation } = req.query;
  const searchQuery = Object.keys(req.query)
    .filter(key => req.query[key] && key !== 'page')
    .map(key => `&${key}=${req.query[key]}`)
    .join('');

  // Query SQL untuk filter pencarian
  let whereClause = [];
  if (name) whereClause.push(`name LIKE '%${name}%'`);
  if (height) whereClause.push(`height = ${height}`);
  if (weight) whereClause.push(`weight = ${weight}`);
  if (birthdateMin && birthdateMax) {
    whereClause.push(`birthdate BETWEEN '${birthdateMin}' AND '${birthdateMax}'`);
  } else if (birthdateMin) {
    whereClause.push(`birthdate >= '${birthdateMin}'`);
  } else if (birthdateMax) {
    whereClause.push(`birthdate <= '${birthdateMax}'`);
  }
  if (isMarried === '1' || isMarried === '0') whereClause.push(`married = ${isMarried}`);
  

  const operator = operation === 'OR' ? 'OR' : 'AND';
  let sql = `SELECT * FROM persons ${whereClause.length ? `WHERE ${whereClause.join(` ${operator} `)}` : ''} LIMIT ? OFFSET ?`;

  db.all(sql, [ITEMS_PER_PAGE, offset], (err, persons) => {
    if (err) throw err;

    db.get(`SELECT COUNT(*) as count FROM persons ${whereClause.length ? `WHERE ${whereClause.join(` ${operator} `)}` : ''}`, (err, countResult) => {
      if (err) throw err;

      let totalItems = countResult.count;
      let totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

      res.render('index', {
        persons,
        currentPage: page,
        totalPages,
        offset,
        totalItems,
        searchQuery,
        query: req.query
      });
    });
  });
});

// Route untuk menampilkan form tambah data
app.get('/add', (req, res) => {
  res.render('add');
});

// Route untuk menangani tambah data
app.post('/add', (req, res) => {
  const { name, height, weight, birthdate, isMarried} = req.body;
  const married = isMarried === '1' ? 1 : 0; // Mengonversi nilai string menjadi angka

  // Simpan data ke database atau array sesuai dengan implementasi Anda
  db.run(`INSERT INTO persons (name, height, weight, birthdate, married) VALUES (?, ?, ?, ?, ?)`,
      [name, height, weight, birthdate, married],
      (err) => {
          if (err) {
              console.error(err);
              return res.status(500).send('Error saving data');
          }
          res.redirect('/'); // Redirect ke halaman utama setelah penyimpanan
      });
});

// Route untuk menampilkan form edit data
app.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM persons WHERE id = ?', [id], (err, person) => {
    if (err) throw err;

    if (person) {
      res.render('edit', { person });
    } else {
      res.status(404).send('Person not found');
    }
  });
});


// Route untuk menangani edit data
app.post('/edit/:id', (req, res) => {
  const id = req.params.id;
  const { name, height, weight, birthdate, isMarried } = req.body;

  db.run(
    `UPDATE persons SET name = ?, height = ?, weight = ?, birthdate = ?, married = ? WHERE id = ?`,
    [name, height, weight, birthdate, isMarried === '1' ? 1 : 0, id],
    (err) => {
      if (err) throw err;
      res.redirect('/');
    }
  );
});


// Route untuk menghapus data
app.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM persons WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Jalankan server
app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
