// Class Ban (Tyre)
class Tyre {
    constructor(brand, size) {
        this.brand = brand;
        this.size = size;
    }
}

// Class Mobil (Car)
class Car {
    constructor(variant, tyre, doors, seats, year) {
        this.variant = variant;
        this.tyre = tyre;
        this.doors = doors;
        this.seats = seats;
        this.year = year;
        this.sn = CarFactory.generateSerialNumber();
        this.warranty = this.calculateWarranty();     // Menghitung garansi
    }

    // Prototype method untuk menghitung garansi berdasarkan ukuran ban
    calculateWarranty() {
        return this.tyre.size === 17 ? 3 : 1;
    }
}

// Class Pabrik Mobil (CarFactory)
class CarFactory {
    constructor() {
        this.cars = [];
    }

    // Static method untuk menghasilkan serial number
    static generateSerialNumber() {
        let serial = '';
        for (let i = 0; i < 4; i++) {
            if (i > 0) serial += '-';
            serial += Math.random().toString(36).substring(2, 6);
        }
        return serial;
    }
    

    // Method untuk memproduksi mobil
    produce(year) {
        this.cars = []
        const variants = [
            { variant: 'Agya', tyre: new Tyre('dunlop', 15), doors: 5, seats: 5 },
            { variant: 'Rush', tyre: new Tyre('bridgestone', 17), doors: 5, seats: 5 },
        ];

        console.log(`hasil Produksi :`);

        // Menghasilkan mobil secara acak
        for (let i = 0; i < 12; i++) {
            const randomIndex = Math.floor(Math.random() * variants.length);
            const selectedVariant = variants[randomIndex];

            const car = new Car(
                selectedVariant.variant,
                selectedVariant.tyre,
                selectedVariant.doors,
                selectedVariant.seats,
                year
            );
            this.cars.push(car);

            console.log(`no. ${i + 1}`);
            console.log(`varian: ${car.variant}`);
            console.log(`sn: ${car.sn}`);
            console.log(`door: ${car.doors}`);
            console.log(`seat: ${car.seats} Seater`);
            console.log(`tyre: ${car.tyre.brand} ${car.tyre.size} inch`);
            console.log(`year: ${car.year}`);
            console.log(`warranty: ${car.warranty} year\n`);
        }
    }

    // Method untuk simulasi garansi
    guaranteeSimulation(simulationYear) {
        console.log(`\nhasil simulasi garansi semua mobil pada tahun ${simulationYear} :\n`);

        this.cars.forEach((car, index) => {
            const carAge = simulationYear - car.year;
            const warrantyStatus = carAge > car.warranty ? 'Expired' : 'Active';

            console.log(`no. ${index + 1}`);
            console.log(`varian: ${car.variant}`);
            console.log(`sn: ${car.sn}`);
            console.log(`door: ${car.doors}`);
            console.log(`seat: ${car.seats} Seater`);
            console.log(`tyre: ${car.tyre.brand} ${car.tyre.size} inch`);
            console.log(`year: ${car.year}`);
            console.log(`warranty: ${car.warranty} year\n`);
            console.log(`status on ${simulationYear}: this guarantee status is ${warrantyStatus}\n`);
        });
    }
}

// Driver Code
const toyota = new CarFactory();
toyota.produce(2020);
toyota.produce(2022);
toyota.guaranteeSimulation(2025);
