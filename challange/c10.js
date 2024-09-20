const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function sentencesManipulation(sentence) {
    const vocal = ['a', 'i', 'u', 'e', 'o', 'A', 'I', 'U', 'E', 'O'];
    const kataArray = sentence.split(" ");
    const hasilArray = [];

    for (let i = 0; i < kataArray.length; i++) {
        const word = kataArray[i];
        const hurufAwal = word[0];

        if (vocal.includes(hurufAwal)) {
            hasilArray.push(word);
        } else {
            hasilArray.push(word.slice(1) + hurufAwal + 'nyo');
        }
    }

    return hasilArray.join(" ");
}
rl.question('tulis kalimatmu disini: ', (inputSentence) => {
    const hasil = sentencesManipulation(inputSentence)
    console.log(`hasil konversi: ${hasil}`)

    rl.close
})

rl.on('close', () => {
    console.log('Good bye!')
    process.exit(0)
})