import { db } from "../c18.js";
import Utama, { rl } from "../c18.js";
import Table from "cli-table3";
import ViewDosen from "../view/ViewDosen.js";
import Dosen from "../controller/ControllerDosen.js";

export default class ModelDosen {
    static displayDosenMenu() {
        ViewDosen.dosenMenu()
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
            ModelDosen.displayDosenMenu()
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
            ModelDosen.displayDosenMenu()
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
                        ModelDosen.displayDosenMenu()
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
                ModelDosen.displayDosenMenu()
            })
        })
    }
}