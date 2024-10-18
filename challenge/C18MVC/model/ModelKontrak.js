import { db } from "../c18.js"
import Utama, { rl } from "../c18.js";
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
                    ModelKontrak.displayAssignmentMenu()
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
                                    ModelKontrak.displayAssignmentMenu(); // Kembali ke menu assignment setelah menambah data
                                });
                            });
                        });
                    });
                })
            })
        })
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
                                ModelKontrak.displayAssignmentMenu(); // Kembali ke menu assignment setelah memperbarui data
                            });
                        });
                    });
                });
            })
        })

    }
}
