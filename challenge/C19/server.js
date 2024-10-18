const http = require('http');
const { readFileSync, writeFileSync } = require('fs');

// Fungsi untuk membaca data dari file JSON
function loadData() {
  try {
    const input = readFileSync('data.json', 'utf8');
    return JSON.parse(input);
  } catch (err) {
    console.error('Gagal membaca file data');
    return [];
  }
}

// Fungsi untuk menulis data ke file JSON
function saveData(data) {
  writeFileSync('data.json', JSON.stringify(data, null, 2));
}

// Menangani request dan response
const server = http.createServer((req, res) => {
  let data = loadData();

  if (req.url === '/' && req.method === 'GET') {
    // Menampilkan daftar orang
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>JSON CRUD (Create, Read, Update, Delete</h1>');
    res.write('<a href="/add">Tambah Orang</a><br/><br/>');
    res.write('<table border="1"><tr><th>Nama</th><th>Tinggi</th><th>Berat</th><th>Tanggal Lahir</th><th>Married</th><th>Aksi</th></tr>');
    data.forEach((item, index) => {
      res.write(`<tr>
        <td>${item.name}</td>
        <td>${item.height}</td>
        <td>${item.weight}</td>
        <td>${item.birthdate}</td>
        <td>${item.married ? 'Yes' : 'No'}</td>
        <td>
          <a href="/edit/${index}">Edit</a> | 
          <a href="/delete/${index}" onclick="return confirm('Yakin ingin menghapus?')">Delete</a>
        </td>
      </tr>`);
    });
    res.write('</table>');
    res.end();
  } else if (req.url === '/add' && req.method === 'GET') {
    // Menampilkan form tambah orang
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Tambah Orang</h1>');
    res.write('<form method="POST" action="/add">');
    res.write('Nama: <input type="text" name="name"/><br/>');
    res.write('Tinggi: <input type="number" name="height"/><br/>');
    res.write('Berat: <input type="number" name="weight"/><br/>');
    res.write('Tanggal Lahir: <input type="date" name="birthdate"/><br/>');
    res.write('Married: <select name="married"><option value="false">Not Yet</option><option value="true">Yes</option></select><br/>');
    res.write('<input type="submit" value="Tambah"/>');
    res.write('</form>');
    res.end();
  } else if (req.url === '/add' && req.method === 'POST') {
    // Menambah data orang
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const params = new URLSearchParams(body);
      const newPerson = {
        name: params.get('name'),
        height: Number(params.get('height')),
        weight: Number(params.get('weight')),
        birthdate: params.get('birthdate'),
        married: params.get('married') === 'true'
      };
      data.push(newPerson);
      saveData(data);
      res.writeHead(302, { Location: '/' });
      res.end();
    });
  } else if (req.url.startsWith('/delete/') && req.method === 'GET') {
    // Menghapus data orang
    const index = req.url.split('/')[2];
    data.splice(index, 1);
    saveData(data);
    res.writeHead(302, { Location: '/' });
    res.end();
  } else if (req.url.startsWith('/edit/') && req.method === 'GET') {
    // Menampilkan form edit orang
    const index = req.url.split('/')[2];
    const person = data[index];
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`<h1>Edit Orang</h1>
      <form method="POST" action="/edit/${index}">
      Nama: <input type="text" name="name" value="${person.name}"/><br/>
      Tinggi: <input type="number" name="height" value="${person.height}"/><br/>
      Berat: <input type="number" name="weight" value="${person.weight}"/><br/>
      Tanggal Lahir: <input type="date" name="birthdate" value="${person.birthdate}"/><br/>
      Married: <select name="married"><option value="false" ${!person.married ? 'selected' : ''}>Not Yet</option><option value="true" ${person.married ? 'selected' : ''}>Yes</option></select><br/>
      <input type="submit" value="Simpan"/>
      </form>`);
    res.end();
  } else if (req.url.startsWith('/edit/') && req.method === 'POST') {
    // Mengupdate data orang
    const index = req.url.split('/')[2];
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const params = new URLSearchParams(body);
      data[index] = {
        name: params.get('name'),
        height: Number(params.get('height')),
        weight: Number(params.get('weight')),
        birthdate: params.get('birthdate'),
        married: params.get('married') === 'true'
      };
      saveData(data);
      res.writeHead(302, { Location: '/' });
      res.end();
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Menjalankan server di port 3000
server.listen(3000, () => {
  console.log('Server berjalan di port 3000');
});
