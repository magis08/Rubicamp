import readline from 'readline';
import sqlite3 from 'sqlite3';
import users from './controller/ControllerLogin.js'; 
import Mahasiswa from './controller/ControllerMahasiswa.js'; 
import Jurusan from './controller/ControllerJurusan.js'; 
import Dosen from './controller/ControllerDosen.js'; 
import Matakuliah from './controller/ControllerMatkul.js'; 
import Kontrak from './controller/ControllerKontrak.js'; 
import ViewLogin from './view/ViewLogin.js'; 

export const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export const db = new sqlite3.Database('university.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) { 
        console.log(`Tidak terkoneksi dengan database`, err);
    }
});

export default class Utama {
    static login() {
        ViewLogin.welcome(); 
        users.username(); 
    }

    static home() {
        ViewLogin.home();
        rl.question('Masukan salah satu nomor dari opsi di atas: ', (opsi) => {
            switch (opsi) {
                case '1': // Mahasiswa
                    Mahasiswa.displayMahasiswaMenu();
                    break;
                case '2': // Jurusan
                    Jurusan.displayJurusanMenu();
                    break;
                case '3': // Dosen
                    Dosen.displayDosenMenu();
                    break;
                case '4': // Mata Kuliah
                    Matakuliah.displayMatakuliahMenu();
                    break;
                case '5': // Kontrak
                    Kontrak.displayAssignmentMenu();
                    break;
                case '6': // Keluar
                    ViewLogin.logout(); // Menggunakan ViewLogin.logout()
                    Utama.login(); // Mengulangi proses login
                    break;
                default:
                    console.log('Pilihan tidak valid, coba lagi.');
                    Utama.home(); // Ulangi menu home jika input tidak valid
            }
        });
    }
}

Utama.login(); // Memulai dengan login
