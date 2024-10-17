import ViewMatkul from '../view/ViewMatkul.js'
import Utama, { rl } from '../c18.mjs'
import ModelMatkul from '../model/ModelMatkul.js'

export default class Matkul {
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
        ModelMatkul.displayMatakuliah(); 
    }

    static searchMatakuliah(kodemk) {
        ModelMatkul.searchMatakuliah(kodemk); 
    }

    static addMatakuliah() {
        ModelMatkul.addMatakuliah(); 
    }

    static deleteMatakuliah() {
        ModelMatkul.deleteMatakuliah(); 
    }
}