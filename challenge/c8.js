function pola(str) {
    for(let i = 0; i <= 9; i++) {
        for(let j = 0; j <= 9; j++){
            if (eval(str.replace('#', i).replace('#', j).replace("=", "==")))
            return [i, j]
        }
    }

}

console.log(pola("42#3 * 188 = 80#204"))
console.log(pola("8#61 * 895 = 78410#5"))