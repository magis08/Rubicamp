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
        this.year = year;  // Tetap menggunakan parameter year
        this.sn = CarFactory.generateSerialNumber();  // Static method untuk serial number
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
        return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () =>
            Math.floor(Math.random() * 16).toString(16)
        );
    }

    // Method untuk memproduksi mobil
    produce(year) {  // Menggunakan parameter year
        this.cars = []
        const variants = [
            { variant: 'Agya', tyre: new Tyre('Dunlop', 15), doors: 5, seats: 5 },
            { variant: 'Rush', tyre: new Tyre('Bridgestone', 17), doors: 5, seats: 7 },
        ];

        console.log(`Hasil Produksi:`);

        // Menghasilkan mobil secara acak
        for (let i = 0; i < 12; i++) {
            const randomIndex = Math.floor(Math.random() * variants.length);
            const selectedVariant = variants[randomIndex];

            const car = new Car(
                selectedVariant.variant,
                selectedVariant.tyre,
                selectedVariant.doors,
                selectedVariant.seats,
                year  // Tahun tidak diacak lagi, tapi menggunakan year dari parameter
            );
            this.cars.push(car);

            console.log(`No. ${i + 1}`);
            console.log(`Varian: ${car.variant}`);
            console.log(`SN: ${car.sn}`);
            console.log(`Door: ${car.doors}`);
            console.log(`Seat: ${car.seats} Seater`);
            console.log(`Tyre: ${car.tyre.brand} ${car.tyre.size} inch`);
            console.log(`Year: ${car.year}`);  // Menampilkan year dari parameter
            console.log(`Warranty: ${car.warranty} Year(s)\n`);
        }
    }

    // Method untuk simulasi garansi
    guaranteeSimulation(simulationYear) {
        console.log(`\nHasil Simulasi Garansi Semua Mobil pada Tahun ${simulationYear}:\n`);

        this.cars.forEach((car, index) => {
            const carAge = simulationYear - car.year;
            const warrantyStatus = carAge > car.warranty ? 'Expired' : 'Active';

            console.log(`No. ${index + 1}`);
            console.log(`Varian: ${car.variant}`);
            console.log(`SN: ${car.sn}`);
            console.log(`Door: ${car.doors}`);
            console.log(`Seat: ${car.seats} Seater`);
            console.log(`Tyre: ${car.tyre.brand} ${car.tyre.size} inch`);
            console.log(`Year: ${car.year}`);
            console.log(`Warranty: ${car.warranty} Year`);
            console.log(`Status on ${simulationYear}: This guarantee status is ${warrantyStatus}\n`);
        });
    }
}

// Driver Code
const toyota = new CarFactory();
toyota.produce(2020);
toyota.produce(2022);
toyota.guaranteeSimulation(2025);
