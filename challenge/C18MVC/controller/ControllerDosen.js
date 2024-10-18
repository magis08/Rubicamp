import ViewDosen from '../view/ViewDosen.js'
import Utama, { rl } from '../c18.js'
import ModelDosen from '../model/ModelDosen.js'

export default class Dosen {
    static displayDosenMenu() {
        ViewDosen.dosenMenu()
        rl.question("Masukkan salah satu nomor dari opsi di atas: ", (choice3) => {
            switch (choice3) {
                case '1':
                    Dosen.displayDosen();
                    break;
                case '2':
                    rl.question(`Masukkan NIP dosen yang ingin dicari: `, (nip) => {
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
        ModelDosen.displayDosen();
    }

    static searchDosen(nip) {
        ModelDosen.searchDosen(nip);
    }

    static addDosen() {
        ModelDosen.addDosen();
    }

    static deleteDosen() {
        ModelDosen.deleteDosen();
    }
}
