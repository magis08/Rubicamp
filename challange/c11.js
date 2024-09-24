const fs = require('fs')
const readline = require('readline')

fs.readFile('data.json', 'utf8', (err, data) => {
    let tebakKata
    tebakKata = JSON.parse(data)
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'tebakan: '
    })
    let pertanyaanIndex = 0
    console.log(`Pertanyaan: ${tebakKata[pertanyaanIndex].definition}`)
    rl.prompt();

    rl.on('line', (jawabanPengguna) => {
        const jawabanBenar = tebakKata[pertanyaanIndex].term.toString().toLowerCase()
        const jawaban = jawabanPengguna.trim().toLowerCase()

        if (jawaban === jawabanBenar) {
            console.log('Selamat Anda benar!\n')
            pertanyaanIndex += 1
            if (pertanyaanIndex < tebakKata.length) {
                console.log(`Pertanyaan: ${tebakKata[pertanyaanIndex].definition}`)
            } else {
                console.log('Hore Anda Menang!\n')
                rl.close()
            }
        } else {
            console.log('Anda kurang beruntung!\n')
        }
        rl.prompt();
    }).on('close', () => {
        process.exit(0);
    });
}
)
