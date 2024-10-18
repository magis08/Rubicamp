import { db } from "../c18.js";
import Utama, { rl } from "../c18.js";
import Table from "cli-table3";
import Mahasiswa from "../controller/ControllerMahasiswa.js";
import ViewMahasiswa from "../view/ViewMahasiswa.js";

export default class ModelMahasiswa {
    static displayMahasiswaMenu() {
        ViewMahasiswa.mahasiswaMenu();
        rl.question("Masukkan salah satu nomor dari opsi di atas: ", (choice1) => {
            switch (choice1) {
                case '1':
                    Mahasiswa.displayMahasiswa();
                    break;
                case '2':
                    rl.question(`Masukkan NIM mahasiswa yang ingin dicari: `, (nim) => {
                        if (nim) {
                            Mahasiswa.searchMahasiswa(nim);
                        } else {
                            console.log("NIM tidak boleh kosong.");
                            Mahasiswa.displayMahasiswaMenu();
                        }
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
            ModelMahasiswa.displayMahasiswaMenu()
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
            ModelMahasiswa.displayMahasiswaMenu()
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
                                        }
                                        ModelMahasiswa.displayMahasiswaMenu()
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
                ModelMahasiswa.displayMahasiswaMenu()
            })
        })
    }
}