import Calculator, {PI} from "./calculator.js";

const calc = new Calculator()

calc.add(10).substract(5).result() // 6
calc.add(3).multiply(4).divide(6).result() // 6
calc.x = 7
console.log(`nilai sekarang : ${calc.x}`) // print 7
calc.multiply(2).multiply(PI).result() // 44
calc.x = 7
calc.square(2).multiply(PI).result() // 154
calc.x = 4
calc.exponent(3).result() // 64
calc.squareRoot().result() // 8