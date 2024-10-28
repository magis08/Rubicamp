function deretKaskus(n) {
    let result = []
    for (let i = 3; i <= n*3; i = i + 3) {
        if (i % 5 == 0 && i % 6 == 0) {
            result.push('KASKUS')
        } else if (i % 5 == 0) {
            result.push('KAS')
        } else if (i % 6 == 0) {
            result.push('KUS')
        } else {
            result.push(i)
        }
    }
    return result
}

console.log(deretKaskus(10))