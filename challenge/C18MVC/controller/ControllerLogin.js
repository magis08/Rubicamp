import ViewLogin from '../view/ViewLogin.js';
import Utama, { rl } from '../c18.mjs';
import ModelLogin from '../model/ModelLogin.js';

export default class users {
    static username() {
        rl.question('username : ', (username) => {
            // Menggunakan ModelLogin untuk mengambil user dari database
            ModelLogin.findUser(username, (err, data) => {
                if (err) {
                    console.log('Gagal mengambil data user:', err.message);
                    process.exit(1);
                }
                if (data.length === 0) {
                    console.log('Username tidak terdaftar.');
                    users.username(); // Mengulangi input username jika tidak ditemukan
                } else {
                    users.password(data[0]); // Jika user ditemukan, lanjutkan ke password
                }
            });
        });
    }

    static password(user) {
        rl.question('password : ', (password) => {
            if (password === user.password) {
                ViewLogin.line();
                console.log(`Welcome, ${user.username}. Your access level is: ${user.role.toUpperCase()}`);
                Utama.home(); // Kembali ke home setelah login berhasil
            } else {
                console.log('Password salah.');
                users.password(user); // Mengulangi input password jika salah
            }
        });
    }
}
