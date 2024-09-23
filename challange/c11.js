const fs = require('fs')
const readline = require('readline')

// Membaca dan mem-parsing file JSON
fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err)
        return
    }
    let tebakKata
    try {
        tebakKata = JSON.parse(data)
    } catch (parseError) {
        console.error('Error parsing JSON:', parseError)
        return
    }
    
    if (!Array.isArray(tebakKata.tebak)) {
        console.error('Properti "tebak" bukan array atau tidak ada')
        return
    }

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
                    console.log('Selamat Anda benar!\n')
                    pertanyaanIndex += 1
                    tanyakanPertanyaan(); // Panggil fungsi untuk pertanyaan berikutnya
                } else {
                    console.log('Salah lu ndro!\n')
                    tanyakanPertanyaan(); // Ulangi pertanyaan yang sama
                }
            })
        } else {
            console.log('Hore Anda Menang!')
            rl.close()
        }
    }

    // Mulai dengan pertanyaan pertama
    tanyakanPertanyaan();
})
