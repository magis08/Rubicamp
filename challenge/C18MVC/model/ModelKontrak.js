import { db } from "../c18.mjs"
import Utama, { rl } from "../c18.mjs";
import Table from "cli-table3";
import ViewKontrak from "../view/ViewKontrak.js";
import Kontrak from "../controller/ControllerKontrak.js";

export default class ModelKontrak {
        static displayAssignmentMenu() {
            ViewKontrak.kontrakMenu()
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
                        Kontrak.updateKontrak();
                        break;
                    case '6':
                        Utama.home();
                        break;
                    default:
                        console.log("Pilihan tidak valid.");
                        Kontrak.displayAssignmentMenu();
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
            ModelKontrak.displayAssignmentMenu()
        });
    }

    static searchKontrak(nim) {
        const query = `
                SELECT assignment.id, mahasiswa.nim, mahasiswa.nama, matakuliah.kodemk, matakuliah.namamk, dosen.nip, dosen.namadosen, assignment.nilai 
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
                console.log(table.toString());
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
                    ModelKontrak.displayAssignmentMenu()
                });
            });
        })
    }

    static addKontrak() {
        rl.question("Masukkan NIM Mahasiswa: ", (nim) => {

            rl.question("Masukkan Kode MK: ", (kodemk) => {

                rl.question("Masukkan NIP Dosen: ", (nip) => {

                    const query = `INSERT INTO assignment (nim, kodemk, nip) VALUES (?, ?, ?)`;

                    db.run(query, [nim, kodemk, nip], (err) => {
                        if (err) {
                            console.error("Gagal menambah data kontrak:", err.message);
                        } else {
                            console.log("Data kontrak berhasil ditambahkan.");
                        }
                        ModelKontrak.displayAssignmentMenu()
                    });
                });
            });
        });
    };

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
                ModelKontrak.displayAssignmentMenu()
            });
        });
    }

    static updateKontrak() {
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
                            ModelKontrak.displayAssignmentMenu()
                        });
                    });
                });
            });
        })
    }
}