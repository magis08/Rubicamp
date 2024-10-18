import ViewJurusan from '../view/ViewJurusan.js'
import Utama, { rl } from '../c18.js'
import ModelJurusan from '../model/ModelJurusan.js'

export default class Jurusan {
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
        ModelJurusan.displayJurusan(); 
    }

    static searchJurusan(kodejurusan) {
        ModelJurusan.searchJurusan(kodejurusan); 
    }

    static addJurusan() {
        ModelJurusan.addJurusan(); 
    }

    static deleteJurusan() {
        ModelJurusan.deleteJurusan(); 
    }
}