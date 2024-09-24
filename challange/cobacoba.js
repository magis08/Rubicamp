const fs = require('fs');
const readline = require('readline');

// Membaca dan mem-parsing file JSON
fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) throw err;  // Pastikan program berhenti jika ada kesalahan pembacaan file
    
    let tebakKata = JSON.parse(data);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let pertanyaanIndex = 0;

    const tanyakanPertanyaan = () => {
        // Periksa apakah masih ada pertanyaan yang tersisa
        if (pertanyaanIndex < tebakKata.tebak.length) {
            console.log(`Pertanyaan: ${tebakKata.tebak[pertanyaanIndex].definition}`);
            mintaJawaban(); // Panggil fungsi untuk meminta jawaban dari pengguna
        } else {
            console.log('Selamat, kamu menang!\n');
            rl.close(); // Tutup antarmuka readline jika semua pertanyaan sudah terjawab
        }
    };

    const mintaJawaban = () => {
        // Ajukan pertanyaan dan tunggu jawaban pengguna
        rl.question('Tebakan: ', (jawabanPengguna) => {
            const jawabanBenar = tebakKata.tebak[pertanyaanIndex].term.toString().toLowerCase();
            const jawaban = jawabanPengguna.trim().toLowerCase();

            if (jawaban === jawabanBenar) {
                console.log('Jawabanmu benar!\n');
                pertanyaanIndex += 1; // Lanjut ke pertanyaan berikutnya
                tanyakanPertanyaan(); // Panggil kembali untuk pertanyaan berikutnya
            } else {
                console.log('Coba lagi, jawabanmu kurang tepat!\n');
                mintaJawaban(); // Ulangi pertanyaan yang sama
            }
        });
    };

    tanyakanPertanyaan(); // Mulai permainan dengan pertanyaan pertama
});
