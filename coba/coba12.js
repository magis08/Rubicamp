const fs = require('fs');
const readline = require('readline');

// Mengambil file JSON dari argumen command line
const args = process.argv.slice(2);

if (args.length !== 1) {
    console.log('Penggunaan: node file.js <nama-file-json>');
    process.exit(1);
}

const filePath = args[0];

// Membaca file JSON
fs.readFile(filePath, 'utf8', (err, data) => {

    let tebakKata = JSON.parse(data);

    if (!tebakKata || !Array.isArray(tebakKata)) {
        console.error('Format file JSON tidak valid.');
        process.exit(1);
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'tebakan: '
    });

    let pertanyaanIndex = 0;
    let skipPertanyaan = [];
    let totalPertanyaan = tebakKata.length;

    const tanya = () => {
        if (pertanyaanIndex < totalPertanyaan) {
            console.log(`Pertanyaan: ${tebakKata[pertanyaanIndex].definition}`);
            rl.prompt();
        } else if (skipPertanyaan.length > 0) {
            tebakKata = skipPertanyaan;
            pertanyaanIndex = 0;
            totalPertanyaan = skipPertanyaan.length;
            skipPertanyaan = [];
            tanya();
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
            tebakKata.splice(pertanyaanIndex, 1);
            totalPertanyaan -= 1;
        } else if (jawaban === 'skip') {
            console.log('Pertanyaan diskip.\n');
            skipPertanyaan.push(tebakKata[pertanyaanIndex]);
            tebakKata.splice(pertanyaanIndex, 1);
            totalPertanyaan -= 1;
        } else {
            console.log('Anda kurang beruntung!\n');
        }

        tanya();
    }).on('close', () => {
        process.exit(0);
    });
});
