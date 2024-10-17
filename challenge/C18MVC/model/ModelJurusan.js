import { db } from "../c18.mjs";
import Utama, { rl } from "../c18.mjs";
import Table from "cli-table3";
import ViewJurusan from "../view/ViewJurusan.js";
import Jurusan from "../controller/ControllerJurusan.js";

export default class ModelJurusan {
    static displayJurusanMenu() {
        ViewJurusan.jurusanMenu()
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
            ModelJurusan.displayJurusanMenu()
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
            ModelJurusan.displayJurusanMenu()
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
                        ModelJurusan.displayJurusanMenu()
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
                ModelJurusan.displayJurusanMenu()
            })
        });
    }
}