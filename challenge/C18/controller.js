const Mahasiswa = require('../models/Mahasiswa');
const Jurusan = require('../models/Jurusan');
const Dosen = require('../models/Dosen');
const MataKuliah = require('../models/MataKuliah');
const Assignment = require('../models/Assignment');
const View = require('../views/View');

class UniversityController {
    constructor() {
        this.mahasiswaList = [];
        this.jurusanList = [];
        this.dosenList = [];
        this.mataKuliahList = [];
        this.assignmentList = [];
        this.view = new View();
    }

    async start() {
        let action;
        do {
            action = await this.view.askQuestion(
                "Choose an action: 1. Add Mahasiswa 2. Add Dosen 3. Add MataKuliah 4. Exit\n"
            );

            switch (action) {
                case '1':
                    await this.addMahasiswa();
                    break;
                case '2':
                    await this.addDosen();
                    break;
                case '3':
                    await this.addMataKuliah();
                    break;
                case '4':
                    this.view.showMessage("Exiting...");
                    break;
                default:
                    this.view.showMessage("Invalid choice, try again.");
            }
        } while (action !== '4');

        this.view.close();
    }

    async addMahasiswa() {
        const nim = await this.view.askQuestion("Enter NIM: ");
        const nama = await this.view.askQuestion("Enter Name: ");
        const jurusan = await this.view.askQuestion("Enter Jurusan: ");
        const mahasiswa = new Mahasiswa(nim, nama, jurusan);
        this.mahasiswaList.push(mahasiswa);
        this.view.showMessage(`Mahasiswa ${nama} added.`);
    }

    async addDosen() {
        const nip = await this.view.askQuestion("Enter NIP: ");
        const nama = await this.view.askQuestion("Enter Name: ");
        const dosen = new Dosen(nip, nama);
        this.dosenList.push(dosen);
        this.view.showMessage(`Dosen ${nama} added.`);
    }

    async addMataKuliah() {
        const kodemk = await this.view.askQuestion("Enter Kode Mata Kuliah: ");
        const namamk = await this.view.askQuestion("Enter Nama Mata Kuliah: ");
        const sks = await this.view.askQuestion("Enter SKS: ");
        const dosenName = await this.view.askQuestion("Enter Nama Dosen: ");
        const dosen = this.dosenList.find(d => d.nama === dosenName);
        if (!dosen) {
            this.view.showMessage("Dosen not found!");
            return;
        }
        const mataKuliah = new MataKuliah(kodemk, namamk, sks, dosen);
        this.mataKuliahList.push(mataKuliah);
        this.view.showMessage(`Mata Kuliah ${namamk} added.`);
    }
}

module.exports = UniversityController;
