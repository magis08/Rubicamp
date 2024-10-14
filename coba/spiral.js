function spiral(param1) {
    // Membuat array 2D yang kosong
    const spiralArray = Array.from({ length: param1 }, () => Array(param1).fill(0));

    // Inisialisasi variabel untuk batasan
    let left = 0, right = param1 - 1;
    let top = 0, bottom = param1 - 1;
    let num = 0;  // Angka yang akan dimasukkan ke dalam array
    const result = []; // Array untuk hasil spiral

    while (left <= right && top <= bottom) {
        // Mengisi baris atas
        for (let i = left; i <= right; i++) {
            spiralArray[top][i] = num;
            result.push(num++);
        }
        top++;

        // Mengisi kolom kanan
        for (let i = top; i <= bottom; i++) {
            spiralArray[i][right] = num;
            result.push(num++);
        }
        right--;

        // Mengisi baris bawah
        if (top <= bottom) {
            for (let i = right; i >= left; i--) {
                spiralArray[bottom][i] = num;
                result.push(num++);
            }
            bottom--;
        }

        // Mengisi kolom kiri
        if (left <= right) {
            for (let i = bottom; i >= top; i--) {
                spiralArray[i][left] = num;
                result.push(num++);
            }
            left++;
        }
    }

    // Menampilkan hasil dalam bentuk array 1D
    console.log(result);
}

// Driver code
spiral(5); // Output seharusnya: [1, 2, 3, 4, 5, 10, 15, 20, 25, 24, 23, 22, 21, 16, 11, 6, 7, 8, 9, 14, 19, 18, 17, 12, 13]
spiral(6); // Output seharusnya: [1, 2, 3, 4, 5, 6, 12, 18, 24, 23, 22, 21, 20, 19, 13, 7, 8, 9, 10, 11, 17, 16, 15, 14, 14, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42]
