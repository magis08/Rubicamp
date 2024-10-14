const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('university.db');

class Mahasiswa {
    constructor(nim, nama, alamat, jurusan, tgllahir) {
        this.nim = nim;
        this.nama = nama;
        this.alamat = alamat;
        this.jurusan = jurusan;
        this.tgllahir = tgllahir;
    }

    info() {
        return `${this.nama} (${this.nim}) - Alamat: ${this.alamat} - Jurusan: ${this.jurusan} - Tanggal Lahir: ${this.tgllahir}`;
    }
}

class Jurusan {
    constructor(kodeJurusan, namaJurusan) {
        this.kodeJurusan = kodeJurusan;
        this.namaJurusan = namaJurusan;
    }
}

class Dosen {
    constructor(nip, namaDosen) {
        this.nip = nip;
        this.namaDosen = namaDosen;
    }

    info() {
        return `${this.namaDosen} (${this.nip})`;
    }
}

class MataKuliah {
    constructor(kodeMK, namaMK, sks, dosen) {
        this.kodeMK = kodeMK;
        this.namaMK = namaMK;
        this.sks = sks;
        this.dosen = dosen;
    }

    info() {
        return `${this.namaMK} (${this.kodeMK}), ${this.sks} SKS, Dosen: ${this.dosen}`;
    }
}

class Kontrak {
    constructor(mahasiswa, matakuliah, dosen, nilai) {
        this.mahasiswa = mahasiswa;
        this.matakuliah = matakuliah;
        this.dosen = dosen;
        this.nilai = nilai;
    }

    info() {
        return `${this.mahasiswa} - Mata Kuliah: ${this.matakuliah} - Dosen: ${this.dosen} - Nilai: ${this.nilai}`;
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const menu = `
Pilih data yang ingin dilihat:
1. Mahasiswa
2. Jurusan
3. Dosen
4. Mata Kuliah
5. Kontrak
6. Keluar
Masukkan pilihan (1-6): `;

function displayMenu() {
    rl.question(menu, (choice) => {
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
                displayMataKuliah();
                break;
            case '5':
                displayKontrak();
                break;
            case '6':
                console.log('Keluar program.');
                rl.close();
                db.close();
                return;
            default:
                console.log('Pilihan tidak valid, silakan coba lagi.');
        }
        displayMenu(); // Tampilkan menu kembali setelah pilihan selesai
    });
}

function displayMahasiswa() {
    db.each(`SELECT mahasiswa.nim, mahasiswa.nama, mahasiswa.alamat, mahasiswa.tgllahir, jurusan.namajurusan 
            FROM mahasiswa 
            JOIN jurusan ON mahasiswa.jurusan = jurusan.kodejurusan`, 
        (err, row) => {
            if (err) {
                console.error(err.message);
            } else {
                const mahasiswa = new Mahasiswa(row.nim, row.nama, row.alamat, row.namajurusan, row.tgllahir);
                console.log(mahasiswa.info());
            }
        }
    );
}

function displayJurusan() {
    db.each(`SELECT * FROM jurusan`, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            const jurusan = new Jurusan(row.kodejurusan, row.namajurusan);
            console.log(`${jurusan.kodeJurusan} - ${jurusan.namaJurusan}`);
        }
    });
}

function displayDosen() {
    db.each(`SELECT * FROM dosen`, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            const dosen = new Dosen(row.nip, row.namadosen);
            console.log(dosen.info());
        }
    });
}

function displayMataKuliah() {
    db.each(`SELECT matakuliah.kodeMK, matakuliah.namaMK, matakuliah.sks, dosen.namadosen 
            FROM matakuliah 
            JOIN dosen ON matakuliah.dosen = dosen.nip`, 
        (err, row) => {
            if (err) {
                console.error(err.message);
            } else {
                const matkul = new MataKuliah(row.kodeMK, row.namaMK, row.sks, row.namadosen);
                console.log(matkul.info());
            }
        }
    );
}

function displayKontrak() {
    db.each(`SELECT mahasiswa.nama AS namaMahasiswa, matakuliah.namaMK, dosen.namadosen, assignment.nilai 
            FROM assignment 
            JOIN mahasiswa ON assignment.nim = mahasiswa.nim 
            JOIN matakuliah ON assignment.kodemk = matakuliah.kodeMK 
            JOIN dosen ON assignment.nip = dosen.nip`, 
        (err, row) => {
            if (err) {
                console.error(err.message);
            } else {
                const kontrak = new Kontrak(row.namaMahasiswa, row.namaMK, row.namadosen, row.nilai);
                console.log(kontrak.info());
            }
        }
    );
}

displayMenu();
