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

class users {
    static username() {
        rl.question('username : ', (username) => {
            db.all('SELECT * FROM users WHERE users.username = ?', [username], (err, data) => {
                if (err) {
                    console.log('gagal ambil users', err)
                    process.exit(1)
                }
                if (data.length == 0) {
                    console.log('username tidak terdaftar')
                    users.username()
                }
                users.password(data[0])
            })
        })
    }

    static password(user) {
        rl.question('password : ', (password) => {
            if (password == user.password) {
                Open.line()
                console.log(`welcome, ${user.username}. Your access level is : ${user.role.toUpperCase()} `)
                Utama.home()
            } else {
                console.log('password salah')
                users.password(user)
            }

        })
    }
}

class Open {
    static line() {
        console.log('===============================')
    }

    static logout() {
        console.log(`
===============================
Anda telah keluar`)
    }
    static home() {
        Open.line()
        console.log(`
silakan pilih opsi di bawah ini :
[1] Mahasiswa
[2] Jurusan
[3] Dosen
[4] Mata Kuliah
[5] Kontrak
[6] Keluar
            `)
        Open.line();
    }
    static welcome() {
        Open.line()
        console.log('Welcome to Universitas Pendidikan Indonesia')
        console.log('Jl. Setiabudhi no. 255')
        Open.line()
    }

    static mahasiswaMenu() {
        Open.line();
        console.log(`
silakan pilih opsi di bawah ini:
[1] Daftar Mahasiswa
[2] Cari Mahasiswa
[3] Tambah Mahasiswa
[4] Hapus Mahasiswa
[5] Kembali`)
        Open.line();
    }

    static jurusanMenu() {
        Open.line();
        console.log(`
silakan pilih opsi di bawah ini:
[1] Daftar Jurusan
[2] Cari Jurusan
[3] Tambah Jurusan
[4] Hapus Jurusan
[5] Kembali`)
        Open.line()
    }

    static dosenMenu() {
        Open.line();
        console.log(`
silakan pilih opsi di bawah ini:
[1] Daftar Dosen
[2] Cari Dosen
[3] Tambah Dosen
[4] Hapus Dosen
[5] Kembali`)
        Open.line();
    }

    static matakuliahMenu() {
        Open.line();
        console.log(`
silakan pilih opsi di bawah ini:
[1] Daftar Matakuliah
[2] Cari Matakuliah
[3] Tambah Matakuliah
[4] Hapus Matakuliah
[5] Kembali`)
        Open.line();
    }

    static kontrakMenu() {
        Open.line();
        console.log(`
silakan pilih opsi di bawah ini:
[1] Daftar Kontrak
[2] Cari Kontrak
[3] Tambah Kontrak
[4] Hapus Kontrak
[5] Update Nilai
[6] Kembali`)
        Open.line();
    }
}

class Mahasiswa {
    static displayMahasiswaMenu() {
        Open.mahasiswaMenu()
        rl.question("Masukkan salah satu nomor dari opsi di atas: ", (choice1) => {
            switch (choice1) {
                case '1':
                    Mahasiswa.displayMahasiswa();
                    break;
                case '2':
                    rl.question(`Masukkan NIM mahasiswa yang ingin dicari: `, (nim) => {
                        Mahasiswa.searchMahasiswa(nim);
                    });
                    break;
                case '3':
                    Mahasiswa.addMahasiswa();
                    break;
                case '4':
                    Mahasiswa.deleteMahasiswa();
                    break;
                case '5':
                    Utama.home();
                    break;
                default:
                    console.log("Pilihan tidak valid.");
                    Mahasiswa.displayMahasiswaMenu();
            }
        });
    }
    static displayMahasiswa() {
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
            Mahasiswa.displayMahasiswaMenu(); // Kembali ke submenu mahasiswa
        })
    }

    static searchMahasiswa(nim) {
        const query = `SELECT mahasiswa.nim, mahasiswa.nama, mahasiswa.tgllahir, mahasiswa.alamat, jurusan.kodejurusan, mahasiswa.jurusan, jurusan.namajurusan FROM mahasiswa JOIN jurusan ON mahasiswa.jurusan = jurusan.kodejurusan WHERE mahasiswa.nim = ?`
        db.get(query, [nim], (err, row) => {
            if (err) {
                console.error('Gagal mengambil data mahasiswa', err.message);
            } else if (row) {
                console.log(`Detail mahasiswa dengan nim '${row.nim}'`);
                console.log(`NIM    : ${row.nim}`);
                console.log(`Nama   : ${row.nama}`);
                console.log(`Alamat : ${row.alamat}`);
                console.log(`Jurusan: ${row.namajurusan}`);
                console.log('===============================================================================')
            } else {
                console.log(`Mahasiswa dengan NIM ${nim} tidak ditemukan.`);
            }
            Mahasiswa.displayMahasiswaMenu(); // Kembali ke submenu mahasiswa
        });
    }

    static addMahasiswa() {
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
            rl.question("Masukkan NIM: ", (nim) => {
                rl.question("Masukkan Nama: ", (nama) => {
                    rl.question("Masukkan Tanggal Lahir (YYYY-MM-DD): ", (tgllahir) => {
                        rl.question("Masukkan Alamat: ", (alamat) => {
                            const query = "SELECT * FROM jurusan"
                            db.all(query, (err, rows) => {
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
                                rl.question("Masukkan Kode Jurusan: ", (kodejurusan) => {
                                    const query = `INSERT INTO mahasiswa (nim, nama, tgllahir, alamat, jurusan) VALUES (?, ?, ?, ?, ?)`;
                                    db.run(query, [nim, nama, tgllahir, alamat, kodejurusan], (err) => {
                                        if (err) {
                                            console.error("Gagal menambah data mahasiswa:", err.message);
                                        } else {
                                            console.log("Data mahasiswa berhasil ditambahkan.");
                                        } Mahasiswa.displayMahasiswa()
                                    });
                                });
                            });
                        });
                    });
                });
            });
        })
    }

    static deleteMahasiswa() {
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
                Mahasiswa.displayMahasiswaMenu();
            })
        })
    }
}

class Jurusan {
    static displayJurusanMenu() {
        Open.jurusanMenu()
        rl.question("Masukkan salah satu nomor dari opsi di atas: ", (choice2) => {
            switch (choice2) {
                case '1':
                    Jurusan.displayJurusan();
                    break;
                case '2':
                    rl.question(`Masukkan kode jurusan yang ingin dicari: `, (kodejurusan) => {
                        Jurusan.searchJurusan(kodejurusan);
                    });
                    break;
                case '3':
                    Jurusan.addJurusan();
                    break;
                case '4':
                    Jurusan.deleteJurusan();
                    break;
                case '5':
                    Utama.home();
                    break;
                default:
                    console.log("Pilihan tidak valid.");
                    Jurusan.displayJurusanMenu();
            }
        });
    }

    static displayJurusan() {
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
            Jurusan.displayJurusanMenu();
        });
    }

    static searchJurusan(kodejurusan) {
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
            Jurusan.displayJurusanMenu(); // Kembali ke submenu mahasiswa
        });
    }

    static addJurusan() {
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
            rl.question("Masukkan kode jurusan: ", (kodejurusan) => {
                rl.question("Masukkan Nama Jurusan: ", (namajurusan) => {
                    const query = `INSERT INTO jurusan (kodejurusan, namajurusan) VALUES (?, ?)`;
                    db.run(query, [kodejurusan, namajurusan], (err) => {
                        if (err) {
                            console.error("Gagal menambah data jurusan:", err.message);
                        } else {
                            console.log("Data jurusan berhasil ditambahkan.");
                        }
                        Jurusan.displayJurusan(); // Kembali ke submenu mahasiswa setelah menambah data
                    });
                });
            });
        })
    }

    static deleteJurusan() {
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
                Jurusan.displayJurusanMenu();
            })
        });
    }
}

class Dosen {
    static displayDosenMenu() {
        Open.dosenMenu()
        rl.question("Masukkan salah satu nomor dari opsi di atas: ", (choice3) => {
            switch (choice3) {
                case '1':
                    Dosen.displayDosen();
                    break;
                case '2':
                    rl.question(`Masukkan kode jurusan yang ingin dicari: `, (nip) => {
                        Dosen.searchDosen(nip);
                    });
                    break;
                case '3':
                    Dosen.addDosen();
                    break;
                case '4':
                    Dosen.deleteDosen();
                    break;
                case '5':
                    Utama.home();
                    break;
                default:
                    console.log("Pilihan tidak valid.");
                    Dosen.displayDosenMenu();
            }
        });
    }

    static displayDosen() {
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
            Dosen.displayDosenMenu();
        });
    }

    static searchDosen(nip) {
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
            Dosen.displayDosenMenu(); // Kembali ke submenu dosen
        });
    }

    static addDosen() {
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
            rl.question("Masukkan nip: ", (nip) => {
                rl.question("Masukkan Dosen: ", (namadosen) => {
                    const query = `INSERT INTO dosen (nip, namadosen) VALUES (?, ?)`;
                    db.run(query, [nip, namadosen], (err) => {
                        if (err) {
                            console.error("Gagal menambah data dosen:", err.message);
                        } else {
                            console.log("Data dosen berhasil ditambahkan.");
                        }
                        Dosen.displayDosenMenu(); // Kembali ke submenu mahasiswa setelah menambah data
                    });
                });
            });
        })
    }

    static deleteDosen() {
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
                Dosen.displayDosenMenu();
            })
        })
    }
}

class Matakuliah {
    static displayMatakuliahMenu() {
        Open.matakuliahMenu()
        rl.question("Masukkan salah satu nomor dari opsi di atas: ", (choice3) => {
            switch (choice3) {
                case '1':
                    Matakuliah.displayMatakuliah();
                    break;
                case '2':
                    rl.question(`Masukkan kode mata kuliah yang ingin dicari: `, (kodemk) => {
                        Matakuliah.searchMatakuliah(kodemk);
                    });
                    break;
                case '3':
                    Matakuliah.addMatakuliah();
                    break;
                case '4':
                    Matakuliah.deleteMatakuliah();
                    break;
                case '5':
                    Utama.home();
                    break;
                default:
                    console.log("Pilihan tidak valid.");
                    Matakuliah.displayMatakuliahMenu();
            }
        });
    }

    static displayMatakuliah() {
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
            Matakuliah.displayMatakuliahMenu();
        });
    }

    static searchMatakuliah(kodemk) {
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
            Matakuliah.displayMatakuliahMenu(); // Kembali ke submenu mahasiswa
        });
    }

    static addMatakuliah() {
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
                console.log(table.toString());
            }
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
                                Matakuliah.displayMatakuliahMenu(); // Kembali ke submenu mahasiswa setelah menambah data
                            });
                        })
                    })
                });
            });
        })
    }

    static deleteMatakuliah() {
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
                Matakuliah.displayMatakuliahMenu();
            })
        })
    }
}

class Kontrak {
    static displayAssignmentMenu() {
        Open.kontrakMenu()
        rl.question("Masukkan salah satu nomor dari opsi di atas: ", (choice1) => {
            switch (choice1) {
                case '1':
                    Kontrak.displayKontrak();
                    break;
                case '2':
                    Kontrak.searchKontrak();
                    break;
                case '3':
                    Kontrak.addKontrak();
                    break;
                case '4':
                    Kontrak.deleteKontrak();
                    break;
                case '5':
                    // displayKontrakMenu();
                    Kontrak.updateKontrak();
                    break;
                case '6':
                    Utama.home();
                    break;
                default:
                    console.log("Pilihan tidak valid.");
                    Kontrak.displayKontrak();
            }
        });
    }

    static displayKontrak() {
        const query = `
                SELECT assignment.id, mahasiswa.nim, mahasiswa.nama, matakuliah.namamk, dosen.namadosen, assignment.nilai 
                FROM assignment
                JOIN mahasiswa ON assignment.nim = mahasiswa.nim
                JOIN matakuliah ON assignment.kodemk = matakuliah.kodemk
                JOIN dosen ON assignment.nip = dosen.nip`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error("Gagal menampilkan data assignment:", err.message);
            } else {
                const table = new Table({
                    head: ['ID', 'NIM', 'Nama Mahasiswa', 'Mata Kuliah', 'Dosen', 'Nilai'],
                    colWidths: [5, 10, 20, 20, 20, 10]
                });
                rows.forEach(row => {
                    table.push([row.id, row.nim, row.nama, row.namamk, row.namadosen, row.nilai]);
                });
                console.log(table.toString()); // Menampilkan tabel assignment dengan kolom yang diinginkan
            }
            Kontrak.displayAssignmentMenu();
        });
    }

    static searchKontrak(nim) {
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
            rl.question(`Masukkan NIM mahasiswa yang ingin dicari: `, (nim) => {
                const queryDetail = `
                SELECT assignment.id, assignment.nim, assignment.kodemk, assignment.nip, assignment.nilai 
                FROM assignment
                WHERE assignment.nim = ?`;
                db.all(queryDetail, [nim], (err, detailRows) => {
                    if (err) {
                        console.error('Gagal mengambil data kontrak:', err.message);
                    } else if (detailRows.length > 0) {
                        console.log('===============================================================================')
                        console.log(`Detal nim Mahasiswa dengan NIM'${nim}' :`)
                        const table = new Table({
                            head: ['ID', 'NIM', 'kode mk', 'NIP', 'Nilai'],
                            colWidths: [5, 10, 10, 10, 10]
                        });
                        detailRows.forEach(row => {
                            table.push([row.id, row.nim, row.kodemk, row.nip, row.nilai]);
                        })
                        console.log(table.toString());
                    } else {
                        console.log(`Kontrak dengan NIM '${nim}' tidak ditemukan.`);
                    }
                    Kontrak.displayAssignmentMenu(); // Kembali ke menu assignment
                });
            });
        })
    }

    static addKontrak() {
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
            rl.question("Masukkan NIM Mahasiswa: ", (nim) => {
                db.all("SELECT matakuliah.kodemk, matakuliah.namamk FROM matakuliah", (err, rows) => {
                    if (err) {
                        console.error("Gagal menampilkan data matakuliah:", err.message);
                    } else {
                        const table = new Table({
                            head: ['Kode MK', 'Nama MK'],
                            colWidths: [10, 30]
                        });
                        rows.forEach(row => {
                            table.push([row.kodemk, row.namamk]);
                        });
                        console.log(table.toString()); // Menampilkan tabel matakuliah
                    }
                    rl.question("Masukkan Kode MK: ", (kodemk) => {
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
                            rl.question("Masukkan NIP Dosen: ", (nip) => {

                                const query = `INSERT INTO assignment (nim, kodemk, nip) VALUES (?, ?, ?)`;

                                db.run(query, [nim, kodemk, nip], (err) => {
                                    if (err) {
                                        console.error("Gagal menambah data kontrak:", err.message);
                                    } else {
                                        console.log("Data kontrak berhasil ditambahkan.");
                                    }
                                    Kontrak.displayAssignmentMenu(); // Kembali ke menu assignment setelah menambah data
                                });
                            });
                        });
                    });
                })
            })
        })
    }

    static deleteKontrak() {
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
                Kontrak.displayAssignmentMenu(); // Kembali ke menu assignment setelah menghapus data
            });
        });
    }

    static updateKontrak() {
        const query = `
                SELECT assignment.id, mahasiswa.nim, mahasiswa.nama, matakuliah.namamk, dosen.namadosen, assignment.nilai 
                FROM assignment
                JOIN mahasiswa ON assignment.nim = mahasiswa.nim
                JOIN matakuliah ON assignment.kodemk = matakuliah.kodemk
                JOIN dosen ON assignment.nip = dosen.nip`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error("Gagal menampilkan data assignment:", err.message);
            } else {
                const table = new Table({
                    head: ['ID', 'NIM', 'Nama Mahasiswa', 'Mata Kuliah', 'Dosen', 'Nilai'],
                    colWidths: [5, 10, 20, 20, 20, 10]
                });
                rows.forEach(row => {
                    table.push([row.id, row.nim, row.nama, row.namamk, row.namadosen, row.nilai]);
                });
                console.log(table.toString()); // Menampilkan tabel assignment dengan kolom yang diinginkan
            }
            rl.question("Masukkan NIM kontrak yang ingin diupdate: ", (nim) => {
                const query = `
                SELECT assignment.id, mahasiswa.nim, mahasiswa.nama, matakuliah.namamk, dosen.namadosen, assignment.nilai 
                FROM assignment
                JOIN mahasiswa ON assignment.nim = mahasiswa.nim
                JOIN matakuliah ON assignment.kodemk = matakuliah.kodemk
                JOIN dosen ON assignment.nip = dosen.nip WHERE mahasiswa.nim = ?`;
                db.all(query, [nim], (err, rows) => {
                    if (err) {
                        console.error("Gagal menampilkan data assignment:", err.message);
                    } else {
                        const table = new Table({
                            head: ['ID', 'Matakuliah', 'Nilai'],
                            colWidths: [5, 20, 10]
                        });
                        rows.forEach(row => {
                            table.push([row.id, row.namamk, row.nilai]);
                        });
                        console.log(table.toString()); // Menampilkan tabel assignment dengan kolom yang diinginkan
                    }

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
                                Kontrak.displayAssignmentMenu(); // Kembali ke menu assignment setelah memperbarui data
                            });
                        });
                    });
                });
            })
        })
    }
}

class Utama {
    static login() {
        Open.welcome()
        users.username()
    }

    static home() {
        Open.home();
        rl.question('Masukan salah satu nomor dari opsi diatas : ', (opsi) => {
            switch (opsi) {


                case '1': //Mahasiswa
                    Mahasiswa.displayMahasiswaMenu();
                    break;
                case '2': //Jurusan
                    Jurusan.displayJurusanMenu();
                    break;
                case '3': //Dosen
                    Dosen.displayDosenMenu();
                    break;
                case '4': //Mata Kuliah
                    Matakuliah.displayMatakuliahMenu()
                    break;
                case '5': //Kontrak
                    Kontrak.displayAssignmentMenu()
                    break;
                case '6': //Keluar
                    Open.logout()
                    Utama.login()
            }
        })
    }
};

Utama.login()
//Utama.home()