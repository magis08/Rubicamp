const sqlite3 = require('sqlite3').verbose();
const readline = require('readline');
const Table = require('cli-table3'); // Mengimpor cli-table3

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const db = new sqlite3.Database('./university.db', (err) => {
    if (err) {
        console.error("Gagal membuka database:", err.message);
    }
});

// Fungsi untuk validasi username
function validateUsername(username, callback) {
    const query = `SELECT * FROM users WHERE username = ?`;
    db.get(query, [username], (err, user) => {
        if (err) {
            console.error("Error saat validasi:", err.message);
            callback(false, null);
        } else if (user) {
            callback(true, user); // Username ditemukan
        } else {
            console.log("Username tidak ada.");
            callback(false, null); // Username tidak ditemukan
        }
    });
}

// Fungsi untuk validasi password
function validatePassword(user, password, callback) {
    if (user.password === password) {
        console.log(`Halo, ${user.username}. Level aksesmu adalah : ${user.role}.`);
        console.log('===============================================================================')
        callback(true);
    } else {
        console.log("Password salah.");
        callback(false);
    }
}

// Fungsi untuk menampilkan menu utama
function displayMenu() {
    console.log("1. Mahasiswa");
    console.log("2. Jurusan");
    console.log("3. Dosen");
    console.log("4. Mata Kuliah");
    console.log("5. Assignment");
    console.log("6. Keluar");
    console.log('===============================================================================')

    rl.question("Masukkan salah satu nomor dari opsi di atas: ", (choice) => {
        switch (choice) {
            case '1':
                displayMahasiswaMenu();
                break;
            case '2':
                displayJurusan();
                break;
            case '3':
                displayDosen();
                break;
            case '4':
                displayMatakuliah();
                break;
            case '5':
                displayAssignment();
                break;
            case '6':
                console.log("Keluar program.");
                rl.close();
                db.close();
                break;
            default:
                console.log("Pilihan tidak valid.");
                displayMenu();
        }
    });
}

// Fungsi untuk menampilkan submenu mahasiswa
function displayMahasiswaMenu() {
    console.log('===============================================================================');
    console.log("1. Daftar Mahasiswa");
    console.log("2. Cari Mahasiswa");
    console.log("3. Tambah Mahasiswa");
    console.log("4. Hapus Mahasiswa");
    console.log("5. Kembali");
    console.log('===============================================================================');
    rl.question("Masukkan salah satu nomor dari opsi di atas: ", (choice1) => {
        switch (choice1) {
            case '1':
                displayMahasiswa();
                break;
            case '2':
                rl.question(`Masukkan NIM mahasiswa yang ingin dicari: `, (nim) => {
                    searchMahasiswa(nim);
                });
                break;
            case '3':
                console.log("Fitur tambah mahasiswa belum tersedia.");
                displayMahasiswaMenu();
                break;
            case '4':
                console.log("Fitur hapus mahasiswa belum tersedia.");
                displayMahasiswaMenu();
                break;
            case '5':
                displayMenu();
                break;
            default:
                console.log("Pilihan tidak valid.");
                displayMahasiswaMenu();
        }
    });
}

// Fungsi untuk menampilkan data mahasiswa dalam tabel
function displayMahasiswa() {
    db.all("SELECT mahasiswa.nim, mahasiswa.nama, mahasiswa.tgllahir, mahasiswa.alamat, jurusan.kodejurusan, mahasiswa.jurusan, jurusan.namajurusan FROM mahasiswa JOIN jurusan ON mahasiswa.jurusan = jurusan.kodejurusan", (err, rows) => {
        if (err) {
            console.error("Gagal menampilkan data mahasiswa:", err.message);
        } else {
            const table = new Table({
                head: ['NIM', 'Nama', 'Tanggal Lahir', 'Alamat', 'Kode Jurusan', 'Jurusan'],
                colWidths: [10, 20, 20, 30, 20, 20]
            });
            rows.forEach(row => {
                table.push([row.nim, row.nama, row.tgllahir, row.alamat, row.kodejurusan, row.namajurusan]);
            });
            console.log(table.toString()); // Menampilkan tabel mahasiswa
        }
        displayMahasiswaMenu(); // Kembali ke submenu mahasiswa
    });
}

function searchMahasiswa(nim) {
    const query = `SELECT mahasiswa.nim, mahasiswa.nama, mahasiswa.tgllahir, mahasiswa.alamat, jurusan.kodejurusan, mahasiswa.jurusan, jurusan.namajurusan FROM mahasiswa JOIN jurusan ON mahasiswa.jurusan = jurusan.kodejurusan WHERE mahasiswa.nim = ?`
    db.get(query, [nim], (err, row) => {
        if (err) {
            console.error('Gagal mengambil data mahasiswa', err.message);
        } else if (row) {
            console.log(`Detail mahasiswa dengan nim '${row.nim}'`);
            console.log(`NIM : ${row.nim}`);
            console.log(`Nama : ${row.nama}`);
            console.log(`Alamat : ${row.alamat}`);
            console.log(`Jurusan: ${row.namajurusan}`);
            console.log('===============================================================================')
        } else {
            console.log(`Mahasiswa dengan NIM ${nim} tidak ditemukan.`);
        }
        displayMahasiswaMenu(); // Kembali ke submenu mahasiswa
    });
}

// Fungsi untuk menampilkan data jurusan dalam tabel
function displayJurusan() {
    db.all("SELECT * FROM jurusan", (err, rows) => {
        if (err) {
            console.error("Gagal menampilkan data jurusan:", err.message);
        } else {
            const table = new Table({
                head: ['Kode Jurusan', 'Nama Jurusan'],
                colWidths: [15, 30]
            });
            rows.forEach(row => {
                table.push([row.kodejurusan, row.namajurusan]);
            });
            console.log(table.toString()); // Menampilkan tabel jurusan
        }
        displayMenu();
    });
}

// Fungsi untuk menampilkan data dosen dalam tabel
function displayDosen() {
    db.all("SELECT * FROM dosen", (err, rows) => {
        if (err) {
            console.error("Gagal menampilkan data dosen:", err.message);
        } else {
            const table = new Table({
                head: ['NIP', 'Nama Dosen'],
                colWidths: [15, 30]
            });
            rows.forEach(row => {
                table.push([row.nip, row.namadosen]);
            });
            console.log(table.toString()); // Menampilkan tabel dosen
        }
        displayMenu();
    });
}

// Fungsi untuk menampilkan data matakuliah dalam tabel
function displayMatakuliah() {
    db.all("SELECT * FROM matakuliah", (err, rows) => {
        if (err) {
            console.error("Gagal menampilkan data matakuliah:", err.message);
        } else {
            const table = new Table({
                head: ['Kode MK', 'Nama MK', 'SKS', 'Dosen'],
                colWidths: [10, 30, 5, 30]
            });
            rows.forEach(row => {
                table.push([row.kodemk, row.namamk, row.sks, row.dosen]);
            });
            console.log(table.toString()); // Menampilkan tabel matakuliah
        }
        displayMenu();
    });
}

// Fungsi untuk menampilkan data assignment dalam tabel
function displayAssignment() {
    db.all("SELECT * FROM assignment", (err, rows) => {
        if (err) {
            console.error("Gagal menampilkan data assignment:", err.message);
        } else {
            const table = new Table({
                head: ['ID', 'NIM', 'Kode MK', 'NIP', 'Nilai'],
                colWidths: [5, 10, 10, 10, 10]
            });
            rows.forEach(row => {
                table.push([row.id, row.nim, row.kodemk, row.nip, row.nilai]);
            });
            console.log(table.toString()); // Menampilkan tabel assignment
        }
        displayMenu();
    });
}

// Proses login
function promptLogin() {
    rl.question('Masukkan username: ', (username) => {
        validateUsername(username, (isValid, user) => {
            if (isValid) {
                // Jika username benar, tanyakan password
                rl.question('Masukkan password: ', (password) => {
                    validatePassword(user, password, (isAuthenticated) => {
                        if (isAuthenticated) {
                            displayMenu(); // Jika login berhasil, tampilkan menu
                        } else {
                            promptLogin(); // Jika password salah, ulangi login
                        }
                    });
                });
            } else {
                promptLogin(); // Jika username salah, ulangi login
            }
        });
    });
}

// Mulai proses login
console.log('===============================================================================')
console.log('Welcome to Universitas Pendidikan Indonesia');
console.log('Jl. Setiabudhi no. 255');
console.log('===============================================================================')
promptLogin();
