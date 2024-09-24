const fs = require('fs')
const readline = require('readline')

fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err)
        return
    }
    let tebakKata
    try{
        tebakKata = JSON.parse(data)
    } catch (parseError) {
        console.error('Error parsing JSON:', parseError)
        return
    }
    
    if(!Array.isArray(tebakKata.tebak)) {
        console.error('Properti "tebak" bukan array atau tidak ada')
        return
    }
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout        
    })
    let pertanyaanIndex = 0
    console.log(`Pertanyaan ${pertanyaanIndex + 1}: ${tebakKata.tebak[pertanyaanIndex].definition}`)

    rl.on('line',(jawabanPengguna) => {
        const jawabanBenar = tebakKata.tebak[pertanyaanIndex].term.toString().toLowerCase()
        const jawaban = jawabanPengguna.trim().toLowerCase()

        if (jawaban === jawabanBenar){
            console.log('Selamat Anda benar!\n')
            pertanyaanIndex += 1
                if (pertanyaanIndex < tebakKata.tebak.length) {
                    console.log(`Pertanyaan ${pertanyaanIndex + 1}: ${tebakKata.tebak[pertanyaanIndex].definition}`)
                    } else {
                        console.log('Hore Anda Menang!\n')
                        rl.close()
                    } 
                    } else {
                        console.log('Salah lu ndro!\n')
                    }
                })
        })
