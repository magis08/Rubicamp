import { db } from '../c18.js';

export default class ModelLogin {
    static findUser(username, callback) {
        db.all('SELECT * FROM users WHERE users.username = ?', [username], (err, data) => {
            if (err) {
                console.error('Error saat mengambil data user:', err.message);
                return callback(err, null);
            }
            if (data.length === 0) {
                return callback(null, []);
            }
            callback(null, data);
        });
    }
}
