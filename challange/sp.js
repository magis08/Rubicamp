function spiral(param1) {
    const result = [];
    let left = 0, right = param1 - 1, top = 0, bottom = param1 - 1;

    while (left <= right && top <= bottom) {
        // Mengisi dari kiri ke kanan
        for (let i = left; i <= right; i++) {
            result.push((top * param1) + i);
        }
        top++;

        // Mengisi dari atas ke bawah
        for (let i = top; i <= bottom; i++) {
            result.push((i * param1) + right);
        }
        right--;

        // Mengisi dari kanan ke kiri
        if (top <= bottom) {
            for (let i = right; i >= left; i--) {
                result.push((bottom * param1) + i);
            }
            bottom--;
        }

        // Mengisi dari bawah ke atas
        if (left <= right) {
            for (let i = bottom; i >= top; i--) {
                result.push((i * param1) + left);
            }
            left++;
        }
    }

    return result;
}

// Menampilkan hasil dalam bentuk array
console.log(spiral(5));
console.log(spiral(6));
