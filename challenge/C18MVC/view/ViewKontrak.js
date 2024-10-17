export default class ViewKontrak {
    static line() {
        console.log('===============================')
    }

    static kontrakMenu() {
        ViewKontrak.line();
        console.log(`
silakan pilih opsi di bawah ini:
[1] Daftar Kontrak
[2] Cari Kontrak
[3] Tambah Kontrak
[4] Hapus Kontrak
[5] Update Nilai
[6] Kembali`)
        ViewKontrak.line();
    }
}