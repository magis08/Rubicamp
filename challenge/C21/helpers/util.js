const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    hashPassword: function (password) {
        return bcrypt.hashSync(password, saltRounds);
    },
    comparePassword: function (password, hash) {
        return bcrypt.hashSync(password, hash);
    },
    isLoggedIn: function (req, res, next) {
        if (req.session.user) {
            next()
        } else {
            res.redirect('/')
        }
    }
}