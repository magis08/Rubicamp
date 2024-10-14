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
                displayJurusanMenu();
                break;
            case '3':
                displayDosenMenu();
                break;
            case '4':
                displayMatakuliahMenu();
                break;
            case '5':
                displayAssignmentMenu();
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
                addMahasiswa();
                break;
            case '4':
                deleteMahasiswa();
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

function displayJurusanMenu() {
    console.log('===============================================================================');
    console.log("1. Daftar Jurusan");
    console.log("2. Cari Jurusan");
    console.log("3. Tambah Jurusan");
    console.log("4. Hapus Jurusan");
    console.log("5. Kembali");
    console.log('===============================================================================');
    rl.question("Masukkan salah satu nomor dari opsi di atas: ", (choice2) => {
        switch (choice2) {
            case '1':
                displayJurusan();
                break;
            case '2':
                rl.question(`Masukkan kode jurusan yang ingin dicari: `, (kodejurusan) => {
                    searchJurusan(kodejurusan);
                });
                break;
            case '3':
                addJurusan();
                break;
            case '4':
                deleteJurusan();
                break;
            case '5':
                displayMenu();
                break;
            default:
                console.log("Pilihan tidak valid.");
                displayJurusanMenu();
        }
    });
}

function displayDosenMenu() {
    console.log('===============================================================================');
    console.log("1. Daftar Dosen");
    console.log("2. Cari Dosen");
    console.log("3. Tambah Dosen");
    console.log("4. Hapus Dosen");
    console.log("5. Kembali");
    console.log('===============================================================================');
    rl.question("Masukkan salah satu nomor dari opsi di atas: ", (choice3) => {
        switch (choice3) {
            case '1':
                displayDosen();
                break;
            case '2':
                rl.question(`Masukkan kode jurusan yang ingin dicari: `, (nip) => {
                    searchDosen(nip);
                });
                break;
            case '3':
                addDosen();
                break;
            case '4':
                deleteDosen();
                break;
            case '5':
                displayMenu();
                break;
            default:
                console.log("Pilihan tidak valid.");
                displayDosenMenu();
        }
    });
}

function displayMatakuliahMenu() {
    console.log('===============================================================================');
    console.log("1. Daftar Mata kuliah");
    console.log("2. Cari Mata kuliah");
    console.log("3. Tambah Mata kuliah");
    console.log("4. Hapus Mata kuliah");
    console.log("5. Kembali");
    console.log('===============================================================================');
    rl.question("Masukkan salah satu nomor dari opsi di atas: ", (choice3) => {
        switch (choice3) {
            case '1':
                displayMatakuliah();
                break;
            case '2':
                rl.question(`Masukkan kode mata kuliah yang ingin dicari: `, (kodemk) => {
                    searchMatakuliah(kodemk);
                });
                break;
            case '3':
                addMatakuliah();
                break;
            case '4':
                deleteMatakuliah();
                break;
            case '5':
                displayMenu();
                break;
            default:
                console.log("Pilihan tidak valid.");
                displayMatakuliahMenu();
        }
    });
}

function displayAssignmentMenu() {
    console.log('===============================================================================');
    console.log("1. Daftar Kontrak");
    console.log("2. Cari Kontrak");
    console.log("3. Tambah Kontrak");
    console.log("4. Hapus Kontrak");
    console.log("5. Update Kontrak")
    console.log("6. Kembali");
    console.log('===============================================================================');
    rl.question("Masukkan salah satu nomor dari opsi di atas: ", (choice1) => {
        switch (choice1) {
            case '1':
                displayKontrakMenu();
                break;
            case '2':
                rl.question(`Masukkan NIM mahasiswa yang ingin dicari: `, (nim) => {
                    searchKontrak(nim);
                });
                break;
            case '3':
                addKontrak();
                break;
            case '4':
                deleteKontrak();
                break;
            case '5':
                // displayKontrakMenu();
                updateKontrak();
                break;
            case '6':
                displayMenu();
                break;
            default:
                console.log("Pilihan tidak valid.");
                displayKontrakMenu();
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

function addMahasiswa() {
    rl.question("Masukkan NIM: ", (nim) => {
        rl.question("Masukkan Nama: ", (nama) => {
            rl.question("Masukkan Tanggal Lahir (YYYY-MM-DD): ", (tgllahir) => {
                rl.question("Masukkan Alamat: ", (alamat) => {
                    rl.question("Masukkan Kode Jurusan: ", (kodejurusan) => {
                        const query = `INSERT INTO mahasiswa (nim, nama, tgllahir, alamat, jurusan) VALUES (?, ?, ?, ?, ?)`;
                        db.run(query, [nim, nama, tgllahir, alamat, kodejurusan], (err) => {
                            if (err) {
                                console.error("Gagal menambah data mahasiswa:", err.message);
                            } else {
                                console.log("Data mahasiswa berhasil ditambahkan.");
                            }
                            displayMahasiswaMenu(); // Kembali ke submenu mahasiswa setelah menambah data
                        });
                    });
                });
            });
        });
    });
}

function deleteMahasiswa() {
    rl.question("Masukkan NIM yang ingin didelete: ", (nim) => {
        const query = `DELETE FROM mahasiswa WHERE nim =?`;
        db.run(query, [nim], function (err) {
            if (err) {
                console.error("Gagal menghapus data mahasiswa", err.message);
            } else if (this.changes === 0) {
                console.log(`Mahasiswa dengan NIM ${nim} tidak ditemukan.`);
            } else {
                console.log(`Mahasiswa dengan NIM ${nim}, berhasil dihapus.`);
            }
            displayMahasiswaMenu();
        })
    })
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
        displayJurusanMenu();
    });
}

function searchJurusan(kodejurusan) {
    const query = `SELECT jurusan.kodejurusan, jurusan.namajurusan FROM jurusan WHERE jurusan.kodejurusan = ?`
    db.get(query, [kodejurusan], (err, row) => {
        if (err) {
            console.error('Gagal mengambil data jurusan', err.message);
        } else if (row) {
            console.log(`Detail jurusan dengan kode '${row.kodejurusan}'`);
            console.log(`Kode Jurusan : ${row.kodejurusan}`);
            console.log(`Nama Jurusan: ${row.namajurusan}`);
            console.log('===============================================================================')
        } else {
            console.log(`Jurusan dengan kode ${kodejurusan} tidak ditemukan.`);
        }
        displayJurusanMenu(); // Kembali ke submenu mahasiswa
    });
}

function addJurusan() {
    rl.question("Masukkan kode jurusan: ", (kodejurusan) => {
        rl.question("Masukkan Jurusan: ", (namajurusan) => {
            const query = `INSERT INTO jurusan (kodejurusan, namajurusan) VALUES (?, ?)`;
            db.run(query, [kodejurusan, namajurusan], (err) => {
                if (err) {
                    console.error("Gagal menambah data jurusan:", err.message);
                } else {
                    console.log("Data jurusan berhasil ditambahkan.");
                }
                displayJurusanMenu(); // Kembali ke submenu mahasiswa setelah menambah data
            });
        });
    });
}

function deleteJurusan() {
    rl.question("Masukkan kode jurusan yang ingin didelete: ", (kodejurusan) => {
        const query = `DELETE FROM jurusan WHERE kodejurusan =?`;
        db.run(query, [kodejurusan], function (err) {
            if (err) {
                console.error("Gagal menghapus data jurusan", err.message);
            } else if (this.changes === 0) {
                console.log(`Mahasiswa dengan kode jurusan ${kodejurusan} tidak ditemukan.`);
            } else {
                console.log(`Mahasiswa dengan kode jurusan ${kodejurusan}, berhasil dihapus.`);
            }
            displayJurusanMenu();
        })
    })
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
        displayDosenMenu();
    });
}
function searchDosen(nip) {
    const query = `SELECT dosen.nip, dosen.namadosen FROM dosen WHERE dosen.nip = ?`
    db.get(query, [nip], (err, row) => {
        if (err) {
            console.error('Gagal mengambil data dosen', err.message);
        } else if (row) {
            console.log(`Detail Dosen dengan kode '${row.nip}'`);
            console.log(`Kode Dosen : ${row.nip}`);
            console.log(`Nama Dosen: ${row.namadosen}`);
            console.log('===============================================================================')
        } else {
            console.log(`Dosen dengan kode ${nip} tidak ditemukan.`);
        }
        displayDosenMenu(); // Kembali ke submenu dosen
    });
}

function addDosen() {
    rl.question("Masukkan kode dosen: ", (nip) => {
        rl.question("Masukkan Dosen: ", (namadosen) => {
            const query = `INSERT INTO dosen (nip, namadosen) VALUES (?, ?)`;
            db.run(query, [nip, namadosen], (err) => {
                if (err) {
                    console.error("Gagal menambah data dosen:", err.message);
                } else {
                    console.log("Data dosen berhasil ditambahkan.");
                }
                displayDosenMenu(); // Kembali ke submenu mahasiswa setelah menambah data
            });
        });
    });
}

function deleteDosen() {
    rl.question("Masukkan nip dosen yang ingin didelete: ", (nip) => {
        const query = `DELETE FROM dosen WHERE nip = ?`;
        db.run(query, [nip], function (err) {
            if (err) {
                console.error("Gagal menghapus data dosen", err.message);
            } else if (this.changes === 0) {
                console.log(`Dosen dengan NIP ${nip} tidak ditemukan.`);
            } else {
                console.log(`Dosen dengan NIP ${nip}, berhasil dihapus.`);
            }
            displayDosenMenu();
        })
    })
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
        displayMatakuliahMenu();
    });
}

function searchMatakuliah(kodemk) {
    const query = `SELECT matakuliah.kodemk, matakuliah.namamk FROM matakuliah WHERE matakuliah.kodemk = ?`
    db.get(query, [kodemk], (err, row) => {
        if (err) {
            console.error('Gagal mengambil data mata kuliah', err.message);
        } else if (row) {
            console.log(`Detail mata kuliah dengan kode '${row.kodemk}'`);
            console.log(`Kode Mata kuliah : ${row.kodemk}`);
            console.log(`Nama Mata kuliah: ${row.namamk}`);
            console.log('===============================================================================')
        } else {
            console.log(`Mata kuliah dengan kode ${kodemk} tidak ditemukan.`);
        }
        displayMatakuliahMenu(); // Kembali ke submenu mahasiswa
    });
}

function addMatakuliah() {
    rl.question("Masukkan kode mata kuliah: ", (kodemk) => {
        rl.question("Masukkan Mata Kuliah: ", (namamk) => {
            rl.question("Masukkan jumlah SKS: ", (sks) => {
                rl.question("Masukkan nip dosen: ", (nip) => {
                    const query = `INSERT INTO matakuliah (kodemk, namamk, sks, dosen) VALUES (?, ?, ?, ?)`;
                    db.run(query, [kodemk, namamk, sks, nip], (err) => {
                        if (err) {
                            console.error("Gagal menambah data mata kuliah:", err.message);
                        } else {
                            console.log("Data mata kuliah berhasil ditambahkan.");
                        }
                        displayMatakuliahMenu(); // Kembali ke submenu mahasiswa setelah menambah data
                    });
                })
            })
        });
    });
}

function deleteMatakuliah() {
    rl.question("Masukkan kode mata kuliah yang ingin didelete: ", (kodemk) => {
        const query = `DELETE FROM matakuliah WHERE kodemk =?`;
        db.run(query, [kodemk], function (err) {
            if (err) {
                console.error("Gagal menghapus data mata kuliah", err.message);
            } else if (this.changes === 0) {
                console.log(`Mata kuliah dengan kode matakuliah ${kodemk} tidak ditemukan.`);
            } else {
                console.log(`Mata kuliah dengan kode matakuliah ${kodemk}, berhasil dihapus.`);
            }
            displayMatakuliahMenu();
        })
    })
}

// Fungsi untuk menampilkan data assignment dalam tabel
function displayKontrakMenu() {
    const query = `
    SELECT assignment.id, mahasiswa.nim, mahasiswa.nama, jurusan.namajurusan, dosen.namadosen, assignment.nilai 
    FROM assignment
    JOIN mahasiswa ON assignment.nim = mahasiswa.nim
    JOIN jurusan ON mahasiswa.jurusan = jurusan.kodejurusan
    JOIN dosen ON assignment.nip = dosen.nip`;

    db.all(query, (err, rows) => {
        if (err) {
            console.error("Gagal menampilkan data assignment:", err.message);
        } else {
            const table = new Table({
                head: ['ID', 'NIM', 'Nama Mahasiswa', 'Jurusan', 'Nama Dosen', 'Nilai'],
                colWidths: [5, 10, 20, 20, 20, 10]
            });
            rows.forEach(row => {
                table.push([row.id, row.nim, row.nama, row.namajurusan, row.namadosen, row.nilai]);
            });
            console.log(table.toString()); // Menampilkan tabel assignment dengan kolom yang diinginkan
        }
        displayAssignmentMenu(); // Kembali ke submenu assignment setelah daftar ditampilkan
    });
}

function searchKontrak(nim) {
    const query = `
                SELECT assignment.id, mahasiswa.nim, mahasiswa.nama, jurusan.namajurusan, dosen.namadosen, assignment.nilai 
                FROM assignment
                JOIN mahasiswa ON assignment.nim = mahasiswa.nim
                JOIN jurusan ON mahasiswa.jurusan = jurusan.kodejurusan
                JOIN dosen ON assignment.nip = dosen.nip
                WHERE mahasiswa.nim = ?`;

    db.all(query, [nim], (err, rows) => {
        if (err) {
            console.error('Gagal mengambil data kontrak:', err.message);
        } else if (rows.length > 0) {
            console.log('===============================================================================')
            console.log(`Detal nim Mahasiswa dengan NIM'${nim}' :`)
            const table = new Table({
                head: ['ID', 'Jurusan', 'Nilai'],
                colWidths: [5, 20, 10]
            });
            rows.forEach(row => {
                table.push([row.id, row.namajurusan, row.nilai]);
            })
            console.log(table.toString());
        } else {
            console.log(`Kontrak dengan NIM '${nim}' tidak ditemukan.`);
        }
        displayAssignmentMenu(); // Kembali ke menu assignment
    });
}


function addKontrak() {
    rl.question("Masukkan NIM Mahasiswa: ", (nim) => {
        rl.question("Masukkan Kode MK: ", (kodemk) => {
            rl.question("Masukkan NIP Dosen: ", (nip) => {
                rl.question("Masukkan Nilai: ", (nilai) => {
                    const query = `INSERT INTO assignment (nim, kodemk, nip, nilai) VALUES (?, ?, ?, ?)`;
                    db.run(query, [nim, kodemk, nip, nilai], (err) => {
                        if (err) {
                            console.error("Gagal menambah data kontrak:", err.message);
                        } else {
                            console.log("Data kontrak berhasil ditambahkan.");
                        }
                        displayAssignmentMenu(); // Kembali ke menu assignment setelah menambah data
                    });
                });
            });
        });
    });
}

function deleteKontrak() {
    rl.question("Masukkan ID kontrak yang ingin dihapus: ", (id) => {
        const query = `DELETE FROM assignment WHERE id = ?`;
        db.run(query, [id], function (err) {
            if (err) {
                console.error("Gagal menghapus data kontrak:", err.message);
            } else if (this.changes === 0) {
                console.log(`Kontrak dengan ID '${id}' tidak ditemukan.`);
            } else {
                console.log(`Kontrak dengan ID '${id}' berhasil dihapus.`);
            }
            displayAssignmentMenu(); // Kembali ke menu assignment setelah menghapus data
        });
    });
}

function updateKontrak() {
    const query = `
    SELECT assignment.id, mahasiswa.nim, mahasiswa.nama, jurusan.namajurusan, dosen.namadosen, assignment.nilai 
    FROM assignment
    JOIN mahasiswa ON assignment.nim = mahasiswa.nim
    JOIN jurusan ON mahasiswa.jurusan = jurusan.kodejurusan
    JOIN dosen ON assignment.nip = dosen.nip`;

    db.all(query, (err, rows) => {
        if (err) {
            console.error("Gagal menampilkan data assignment:", err.message);
        } else {
            const table = new Table({
                head: ['ID', 'NIM', 'Nama Mahasiswa', 'Jurusan', 'Nama Dosen', 'Nilai'],
                colWidths: [5, 10, 20, 20, 20, 10]
            });
            rows.forEach(row => {
                table.push([row.id, row.nim, row.nama, row.namajurusan, row.namadosen, row.nilai]);
            });
            console.log(table.toString()); // Menampilkan tabel assignment dengan kolom yang diinginkan
        }
    rl.question("Masukkan NIM kontrak yang ingin diupdate: ", (nim) => {
        rl.question("Masukkan id yang akan diubah nilainya: ", (id) => {
            rl.question("Masukkan nilai baru: ", (nilaiBaru) => {
                const query = `UPDATE assignment SET nilai = ? WHERE id = ?`;
                db.run(query, [nilaiBaru, id], function (err) {
                    if (err) {
                        console.error("Gagal memperbarui data kontrak:", err.message);
                    } else if (this.changes === 0) {
                        console.log(`Kontrak dengan ID '${id}' tidak ditemukan.`);
                    } else {
                        console.log(`Nilai kontrak dengan ID '${id}' berhasil diperbarui menjadi '${nilaiBaru}'.`);
                    }
                    displayAssignmentMenu(); // Kembali ke menu assignment setelah memperbarui data
                });
            });
        });
    });
})
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
