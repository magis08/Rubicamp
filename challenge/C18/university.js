const sqlite3 = require('sqlite3').verbose();
const readline = require('readline');

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
        console.log(`Login berhasil! Role: ${user.role}`);
        callback(true);
    } else {
        console.log("Password salah.");
        callback(false);
    }
}

// Fungsi untuk menampilkan menu utama
function displayMenu() {
    console.log("\n=== MENU UTAMA ===");
    console.log("1. Tampilkan data Mahasiswa");
    console.log("2. Tampilkan data Jurusan");
    console.log("3. Tampilkan data Dosen");
    console.log("4. Tampilkan data Mata Kuliah");
    console.log("5. Tampilkan data Assignment");
    console.log("6. Keluar");

    rl.question("Pilih opsi [1-6]: ", (choice) => {
        switch (choice) {
            case '1':
                displayMahasiswa();
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

// Fungsi untuk menampilkan data mahasiswa
function displayMahasiswa() {
    db.all("SELECT * FROM mahasiswa", (err, rows) => {
        if (err) {
            console.error("Gagal menampilkan data mahasiswa:", err.message);
        } else {
            console.log("\n=== Data Mahasiswa ===");
            rows.forEach(row => {
                console.log(`NIM: ${row.nim}, Nama: ${row.nama}, Alamat: ${row.alamat}, Jurusan: ${row.jurusan}`);
            });
        }
        displayMenu(); // Kembali ke menu
    });
}

// Fungsi untuk menampilkan data jurusan
function displayJurusan() {
    db.all("SELECT * FROM jurusan", (err, rows) => {
        if (err) {
            console.error("Gagal menampilkan data jurusan:", err.message);
        } else {
            console.log("\n=== Data Jurusan ===");
            rows.forEach(row => {
                console.log(`Kode Jurusan: ${row.kodejurusan}, Nama Jurusan: ${row.namajurusan}`);
            });
        }
        displayMenu();
    });
}

// Fungsi untuk menampilkan data dosen
function displayDosen() {
    db.all("SELECT * FROM dosen", (err, rows) => {
        if (err) {
            console.error("Gagal menampilkan data dosen:", err.message);
        } else {
            console.log("\n=== Data Dosen ===");
            rows.forEach(row => {
                console.log(`NIP: ${row.nip}, Nama Dosen: ${row.namadosen}`);
            });
        }
        displayMenu();
    });
}

// Fungsi untuk menampilkan data matakuliah
function displayMatakuliah() {
    db.all("SELECT * FROM matakuliah", (err, rows) => {
        if (err) {
            console.error("Gagal menampilkan data matakuliah:", err.message);
        } else {
            console.log("\n=== Data Mata Kuliah ===");
            rows.forEach(row => {
                console.log(`Kode MK: ${row.kodemk}, Nama MK: ${row.namamk}, SKS: ${row.sks}, Dosen: ${row.dosen}`);
            });
        }
        displayMenu();
    });
}

// Fungsi untuk menampilkan data assignment
function displayAssignment() {
    db.all("SELECT * FROM assignment", (err, rows) => {
        if (err) {
            console.error("Gagal menampilkan data assignment:", err.message);
        } else {
            console.log("\n=== Data Assignment ===");
            rows.forEach(row => {
                console.log(`ID: ${row.id}, NIM: ${row.nim}, Kode MK: ${row.kodemk}, NIP: ${row.nip}, Nilai: ${row.nilai}`);
            });
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
console.log('Welcome to Universitas Pendidikan Indonesia');
console.log('Jl. Setiabudhi no. 255');
promptLogin();
