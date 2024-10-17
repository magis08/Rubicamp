export default class ViewMatkul {
    static line() {
        console.log('===============================')
    }

    static matakuliahMenu() {
        ViewMatkul.line();
        console.log(`
silakan pilih opsi di bawah ini:
[1] Daftar Matakuliah
[2] Cari Matakuliah
[3] Tambah Matakuliah
[4] Hapus Matakuliah
[5] Kembali`)
        ViewMatkul.line();
    }
}