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

console.log(sentencesManipulation('ibu pergi ke pasar bersama aku'));