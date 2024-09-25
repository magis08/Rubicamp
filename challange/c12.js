const fs = require('fs');
const readline = require('readline');

fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    let tebakKata = JSON.parse(data);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'tebakan: '
    });

    let pertanyaanIndex = 0;
    let skipPertanyaan = [];
    let totalPertanyaan = tebakKata.length;

    const tanya = () => {
        // Pastikan pertanyaan index valid
        if (pertanyaanIndex < totalPertanyaan) {
            console.log(`Pertanyaan: ${tebakKata[pertanyaanIndex].definition}`);
            rl.prompt();
        } else if (skipPertanyaan.length > 0) {
            // Reset untuk pertanyaan yang diskip
            tebakKata = skipPertanyaan;
            pertanyaanIndex = 0;
            totalPertanyaan = skipPertanyaan.length;
            tanya(); // tanya pertanyaan yang diskip
        } else {
            console.log('Hore Anda Menang!\n');
            rl.close();
        }
    };

    tanya();

    rl.on('line', (jawabanPengguna) => {
        const jawabanBenar = tebakKata[pertanyaanIndex].term.toString().toLowerCase();
        const jawaban = jawabanPengguna.trim().toLowerCase();

        if (jawaban === jawabanBenar) {
            console.log('Selamat Anda benar!\n');
            // Hapus pertanyaan yang sudah dijawab
            tebakKata.splice(pertanyaanIndex, 1);
            totalPertanyaan -= 1; // Kurangi total pertanyaan
        } else if (jawaban === 'skip') {
            console.log('Anda telah melewatkan pertanyaan ini.\n');
            skipPertanyaan.push(tebakKata[pertanyaanIndex]); // Simpan pertanyaan yang diskip
            tebakKata.splice(pertanyaanIndex, 1); // Hapus pertanyaan dari daftar
            totalPertanyaan -= 1; // Kurangi total pertanyaan
        } else {
            console.log('Anda kurang beruntung!\n');
        }

        tanya();
    }).on('close', () => {
        process.exit(0);
    });
});