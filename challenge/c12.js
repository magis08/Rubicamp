const fs = require('fs')
const readline = require('readline')

// Mengambil file JSON dari argumen command line
const args = process.argv.slice(2)

if (args.length !== 1) {
    process.exit(1)
}

// Membaca file JSON
fs.readFile(args[0], 'utf8', (err, data) => {

    // Parsing JSON
    let tebakKata = JSON.parse(data)

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'tebakan: '
    });

    let pertanyaanIndex = 0
    let skipPertanyaan = []
    let totalPertanyaan = tebakKata.length
    let totalSalah = 0 // Variabel untuk menghitung kesalahan

    // Tampilkan pertanyaan pertama sekali saja
    const tanya = () => {
        if (pertanyaanIndex < totalPertanyaan) {
            console.log(`Pertanyaan: ${tebakKata[pertanyaanIndex].definition}`)
            rl.prompt()
        } else if (skipPertanyaan.length > 0) {
            tebakKata = skipPertanyaan
            pertanyaanIndex = 0
            totalPertanyaan = skipPertanyaan.length
            skipPertanyaan = []
            tanya()
        } else {
            console.log('Hore Anda Menang!\n')
            rl.close()
        }
    }

    tanya()

    rl.on('line', (jawabanPengguna) => {
        const jawabanBenar = tebakKata[pertanyaanIndex].term.toString().toLowerCase()
        const jawaban = jawabanPengguna.trim().toLowerCase()

        if (jawaban === jawabanBenar) {
            console.log('Selamat Anda benar!\n')
            tebakKata.splice(pertanyaanIndex, 1)
            totalPertanyaan -= 1
            totalSalah = 0 // Reset kesalahan setelah jawaban benar
            tanya()
        } else if (jawaban === 'skip') {
            console.log('Pertanyaan diskip.\n')
            skipPertanyaan.push(tebakKata[pertanyaanIndex])
            tebakKata.splice(pertanyaanIndex, 1)
            totalPertanyaan -= 1
            totalSalah = 0 // Reset kesalahan jika skip
            tanya()
        } else {
            totalSalah += 1 // Tambahkan kesalahan setiap jawaban salah
            console.log(`Kamu telah salah ${totalSalah}x. Silakan coba lagi.`)
            rl.prompt() // Langsung ke interface tebakan tanpa mengulang pertanyaan
        }
    }).on('close', () => {
        process.exit(0)
    })
})
