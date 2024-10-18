import ViewKontrak from '../view/ViewKontrak.js'
import Utama, { rl } from '../c18.js'
import ModelKontrak from '../model/ModelKontrak.js'

export default class Kontrak {
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
        ModelKontrak.displayKontrak();
    }

    static searchKontrak(nim) {
        ModelKontrak.searchKontrak(nim); 
    }

    static addKontrak() {
        ModelKontrak.addKontrak(); 
    }

    static deleteKontrak() {
        ModelKontrak.deleteKontrak(); 
    }

    static updateKontrak() {
        ModelKontrak.updateKontrak();
    }
}