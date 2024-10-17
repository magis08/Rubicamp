import ViewMahasiswa from '../view/ViewMahasiswa.js';
import Utama, { rl } from '../c18.mjs';
import ModelMahasiswa from '../model/ModelMahasiswa.js';

export default class Mahasiswa {
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
        ModelMahasiswa.displayMahasiswa(); 
    }

    static searchMahasiswa(nim) {
        ModelMahasiswa.searchMahasiswa(nim); 
    }

    static addMahasiswa() {
        ModelMahasiswa.addMahasiswa(); 
    }

    static deleteMahasiswa() {
        ModelMahasiswa.deleteMahasiswa(); 
    }
}
