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

  // Penyajian file CSS statis
  switch (req.url) {
    case '/style.css':
      if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        const css = readFileSync('style.css');
        res.end(css);
        return;
      }
      break;

    case '/':
      if (req.method === 'GET') {
        // Menampilkan daftar orang
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<!DOCTYPE html>');
        res.write('<html><head><title>JSON CRUD (Create, Read, Update, Delete)</title>');
        res.write('<link rel="stylesheet" href="/style.css">');
        res.write('</head><body>');
        res.write('<h1>JSON CRUD (Create, Read, Update, Delete)</h1>');
        res.write('<a href="/add" class="create-link">Create</a><br/><br/>');
        res.write('<table><tr><th>No.</th><th>Name</th><th>Height</th><th>Weight</th><th>Birthdate</th><th>isMarried</th><th>Action</th></tr>');
        data.forEach((item, index) => {
          res.write(`<tr>
            <td>${index + 1}</td>
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
        res.write('</body></html>');
        res.end();
        return;
      }
      break;

    case '/add':
      switch (req.method) {
        case 'GET':
          // Menampilkan form tambah orang
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write('<!DOCTYPE html>');
          res.write('<html><head><title></title>');
          res.write('<link rel="stylesheet" href="/style.css">');
          res.write('</head><body>');
          res.write('<h1></h1>');
          res.write('<a method="POST" action="/add" style="width: 100vw; max-width: 600px; margin: 0 auto;"></a><br/><br/>');
          res.write('<input type="text" name="name" placeholder="input name" required/><br/>');
          res.write('<input type="number" name="height" placeholder="input height (cm)" required/><br/>');
          res.write('<input type="number" name="weight" placeholder="input weight (kg)" required/><br/>');
          res.write('<input type="date" name="birthdate" required/><br/>');
          res.write('Married: <select name="married"><option value="false">Not Yet</option><option value="true">Yes</option></select><br/>');
          res.write('<input type="submit" value="Save" style="margin-top: 10px;"/>');
          res.write('<input type="button" value="Cancel" onclick="window.location.href=\'/\'" style="margin-top: 10px;"/>');
          res.write('</form>');
          res.write('</body></html>');
          res.end();
          return;

        case 'POST':
          // Menambah data orang
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            const params = new URLSearchParams(body);
            const newPerson = {
              name: params.get('name'),
              height: !isNaN(Number(params.get('height'))) ? Number(params.get('height')) : 0,
              weight: !isNaN(Number(params.get('weight'))) ? Number(params.get('weight')) : 0,
              birthdate: params.get('birthdate'),
              married: params.get('married') === 'true'
            };
            data.push(newPerson);
            saveData(data);
            res.writeHead(302, { Location: '/' });
            res.end();
          });
          return;
      }
      break;

    default:
      if (req.url.startsWith('/delete/') && req.method === 'GET') {
        // Menghapus data orang
        const index = req.url.split('/')[2];
        data.splice(index, 1);
        saveData(data);
        res.writeHead(302, { Location: '/' });
        res.end();
        return;
      } else if (req.url.startsWith('/edit/') && req.method === 'GET') {
        // Menampilkan form edit orang
        const index = req.url.split('/')[2];
        const person = data[index];
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<!DOCTYPE html>');
        res.write('<html><head><title>Edit Orang</title>');
        res.write('<link rel="stylesheet" href="/style.css">');
        res.write('</head><body>');
        res.write(`<h1>Edit Orang</h1>
          <form method="POST" action="/edit/${index}">
          Name: <input type="text" name="name" value="${person.name}"/><br/>
          Height: <input type="number" name="height" value="${person.height}"/><br/>
          Weight: <input type="number" name="weight" value="${person.weight}"/><br/>
          Birthdate: <input type="date" name="birthdate" value="${person.birthdate}"/><br/>
          is Married: <select name="married"><option value="false" ${!person.married ? 'selected' : ''}>Not Yet</option><option value="true" ${person.married ? 'selected' : ''}>Yes</option></select><br/>
          <input type="submit" value="Save"/>
          <input type="button" value="Cancel" onclick="window.location.href=\'/\'">
          </form>`);
        res.write('</body></html>');
        res.end();
        return;
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
            height: !isNaN(Number(params.get('height'))) ? Number(params.get('height')) : 0,
            weight: !isNaN(Number(params.get('weight'))) ? Number(params.get('weight')) : 0,
            birthdate: params.get('birthdate'),
            married: params.get('married') === 'true'
          };
          saveData(data);
          res.writeHead(302, { Location: '/' });
          res.end();
        });
        return;
      }
  }

  // Menangani URL tidak ditemukan
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

// Menjalankan server di port 3000
server.listen(3001, () => {
  console.log('Server berjalan di port 3000');
});
