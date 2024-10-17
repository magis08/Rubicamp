export default class ViewMahasiswa {
    static line() {
        console.log('===============================')
    }

    static mahasiswaMenu() {
        ViewMahasiswa.line();
        console.log(`
silakan pilih opsi di bawah ini:
[1] Daftar Mahasiswa
[2] Cari Mahasiswa
[3] Tambah Mahasiswa
[4] Hapus Mahasiswa
[5] Kembali`)
        ViewMahasiswa.line();
    }
}