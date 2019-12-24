"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var leveldb_1 = require("./leveldb");
var passwordHash = require('password-hash');
var User = /** @class */ (function () {
    function User(username, email, password, passwordHashed) {
        if (passwordHashed === void 0) { passwordHashed = false; }
        this.password = "";
        this.username = username;
        this.email = email;
        if (!passwordHashed) {
            this.setPassword(password);
        }
        else
            this.password = password;
    }
    User.fromDb = function (username, value) {
        var _a = value.split(":"), password = _a[0], email = _a[1];
        console.log([password, email]);
        return new User(username, email, password, true);
    };
    User.prototype.setPassword = function (toSet) {
        console.log('toSet', toSet);
        this.password = passwordHash.generate(toSet);
        console.log('Generated password: ', this.password);
    };
    User.prototype.getPassword = function () {
        return this.password;
    };
    User.prototype.validatePassword = function (toValidate) {
        // return comparison with hashed password
        var validate = passwordHash.verify(toValidate, this.password);
        console.log('validate: ', validate, toValidate, this.password);
        return validate;
    };
    return User;
}());
exports.User = User;
var UserHandler = /** @class */ (function () {
    function UserHandler(path) {
        this.db = leveldb_1.LevelDB.open(path);
    }
    UserHandler.prototype.get = function (username, callback) {
        this.db.get("user:" + username, function (err, data) {
            if (err)
                callback(err);
            else if (data === undefined)
                callback(null, data);
            else
                callback(null, User.fromDb(username, data));
        });
    };
    UserHandler.prototype.save = function (user, callback) {
        this.db.put("user:" + user.username, user.getPassword() + ":" + user.email, function (err, result) {
            callback(err, 'ok');
        });
    };
    UserHandler.prototype.delete = function (username, callback) {
        this.db.del("user:" + username, function (err) {
            callback(err, 'User ' + username + ' deleted');
        });
    };
    UserHandler.prototype.getAll = function (callback) {
        var user = [];
        this.db.createReadStream()
            .on('data', function (data) {
            console.log(data);
        })
            .on('error', function (err) {
            callback(err, null);
            console.log('Oh my!', err);
        })
            .on('close', function () {
            console.log('Stream closed');
        })
            .on('end', function () {
            callback(null, user);
            console.log('Stream ended');
        });
    };
    return UserHandler;
}());
exports.UserHandler = UserHandler;
//# sourceMappingURL=user.js.map