const fs = require('fs');
const path = './todo.json';

// Fungsi untuk menambah objek baru ke file JSON
function tambahObjekBaru(objekBaru) {
  // Baca isi file JSON
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.log('Error membaca file:', err);
      return;
    }

    // Parse data JSON ke array
    let jsonData = JSON.parse(data);

    // Tambah objek baru ke array
    jsonData.push(objekBaru);

    // Tulis ulang data yang sudah ditambah ke file JSON
    fs.writeFile(path, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
      if (err) {
        console.log('Error menulis file:', err);
        return;
      }
      console.log('Objek baru berhasil ditambahkan!');
    });
  });
}

// Fungsi untuk menghapus objek berdasarkan id dari file JSON
function hapusObjek(id) {
  // Baca isi file JSON
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.log('Error membaca file:', err);
      return;
    }

    // Parse data JSON ke array
    let jsonData = JSON.parse(data);

    // Cari indeks objek yang ingin dihapus
    const index = jsonData.findIndex(obj => obj.id === id);

    if (index !== -1) {
      // Hapus objek dari array
      jsonData.splice(index, 1);

      // Tulis ulang data yang sudah dihapus ke file JSON
      fs.writeFile(path, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
        if (err) {
          console.log('Error menulis file:', err);
          return;
        }
        console.log(`Objek dengan id ${id} berhasil dihapus!`);
      });
    } else {
      console.log(`Objek dengan id ${id} tidak ditemukan.`);
    }
  });
}

// Fungsi utama untuk menentukan apakah menambah atau menghapus objek
function kelolaObjek(aksi, objek = null) {
  if (aksi === 'tambah' && objek) {
    tambahObjekBaru(objek);
  } else if (aksi === 'hapus' && objek?.id) {
    hapusObjek(objek.id);
  } else {
    console.log('Aksi tidak valid. Gunakan "tambah" untuk menambah atau "hapus" untuk menghapus objek.');
  }
}

// Contoh: Tambah objek baru
const objekBaru = { id: 4, nama: "Dede" };
kelolaObjek('tambah', objekBaru);

// Contoh: Hapus objek dengan id 3
kelolaObjek('hapus', { id: 3 });
