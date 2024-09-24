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
    const mintaJawaban = () => {
            rl.question('Tebakan: ', (jawabanPengguna) => {
                const jawabanBenar = tebakKata.tebak[pertanyaanIndex].term.toString().toLowerCase()
                const jawaban = jawabanPengguna.trim().toLowerCase()

                if (jawaban === jawabanBenar) {
                    console.log('Jawabanmu benar!\n')
                    pertanyaanIndex += 1
                    tanyakanPertanyaan(); // Panggil fungsi untuk pertanyaan berikutnya
                } else {
                    console.log('Coba lagi, jawabanmu kurang tepat!\n')
                    mintaJawaban(); // Ulangi pertanyaan yang sama
                }
            })
    }
    const tanyakanPertanyaan = () => {
        if (pertanyaanIndex < tebakKata.tebak.length) {
            console.log(`Pertanyaan: ${tebakKata.tebak[pertanyaanIndex].definition}`)
            mintaJawaban()
        } else {
            console.log('Selamat, kamu menang!\n')
            rl.close()
        }
    }
    tanyakanPertanyaan()
})
