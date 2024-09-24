const fs = require('fs')
const readline = require('readline')

// Membaca dan mem-parsing file JSON
fs.readFile('data.json', 'utf8', (err, data) => {
    let tebakKata
    tebakKata = JSON.parse(data)
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    let pertanyaanIndex = 0
    const tanyakanPertanyaan = () => {
        if (pertanyaanIndex < tebakKata.tebak.length) {
            console.log(`Pertanyaan ${pertanyaanIndex + 1}: ${tebakKata.tebak[pertanyaanIndex].definition}`)
            rl.question('Tebakan: ', (jawabanPengguna) => {
                const jawabanBenar = tebakKata.tebak[pertanyaanIndex].term.toString().toLowerCase()
                const jawaban = jawabanPengguna.trim().toLowerCase()

                if (jawaban === jawabanBenar) {
                    console.log('Kelas, prince!\n')
                    pertanyaanIndex += 1
                    tanyakanPertanyaan(); // Panggil fungsi untuk pertanyaan berikutnya
                } else {
                    console.log('Coba lagi, prince!\n')
                    tanyakanPertanyaan(); // Ulangi pertanyaan yang sama
                }
            })
        } else {
            console.log('Kelas king, mahkotamu lagi transit di DC Cakung!\n')
            rl.close()
        }
    }
    // Mulai dengan pertanyaan pertama
    tanyakanPertanyaan();
})
