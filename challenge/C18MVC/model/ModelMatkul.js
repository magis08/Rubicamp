import { db } from "../c18.js";
import Utama, { rl } from "../c18.js";
import Table from "cli-table3";
import Matkul from "../controller/ControllerMatkul.js";
import ViewMatkul from "../view/ViewMatkul.js";

export default class ModelMatkul {
    static displayMatakuliahMenu() {
        ViewMatkul.matakuliahMenu()
        rl.question("Masukkan salah satu nomor dari opsi di atas: ", (choice3) => {
            switch (choice3) {
                case '1':
                    Matkul.displayMatakuliah();
                    break;
                case '2':
                    rl.question(`Masukkan kode mata kuliah yang ingin dicari: `, (kodemk) => {
                        Matkul.searchMatakuliah(kodemk);
                    });
                    break;
                case '3':
                    Matkul.addMatakuliah();
                    break;
                case '4':
                    Matkul.deleteMatakuliah();
                    break;
                case '5':
                    Utama.home();
                    break;
                default:
                    console.log("Pilihan tidak valid.");
                    Matkul.displayMatakuliahMenu();
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
            ModelMatkul.displayMatakuliahMenu()
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
            ModelMatkul.displayMatakuliahMenu()
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
                                ModelMatkul.displayMatakuliahMenu()
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
                ModelMatkul.displayMatakuliahMenu()
            })
        })
    }
}