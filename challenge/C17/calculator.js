const PI = 22/7

class Calculator {
    constructor() {
        this.x = 1;

    }

    add(value) {
        this.x += value;
        return this;

    }
    
    substract(value) {
        this.x -= value;
        return this;

    }

    divide(value) {
        if (value === 0) {
            console.error("tidak bisa dibagi 0.");
            return this;
        }
        this.x /= value;
        return this;

    }

    multiply(value) {
        this.x *= value;
        return this;
    }

    // tambahan method lain
    square(){
        this.x = Math.pow(this.x, 2);
        return this;

    }

    squareRoot(value){
        this.x = Math.sqrt(this.x, 2);
        return this;

    }
    
    exponent(value){
        this.x = Math.pow(this.x, value);
        return this;

    }

    result(){
        console.log(`hasil: ${this.x}`);
        return this;

    }
}

export { PI };
export default Calculator;
