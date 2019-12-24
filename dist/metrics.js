"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var leveldb_1 = require("./leveldb");
var assert_1 = require("assert");
var Metric = /** @class */ (function () {
    function Metric(u, ts, v) {
        this.username = u;
        this.timestamp = ts;
        this.value = v;
    }
    Metric.fromDb = function (username, values) {
        console.log('values fromDb: ', values);
        var _a = values.split(":"), timestamp = _a[0], value = _a[1];
        console.log([username, value]);
        return new Metric(username, timestamp, value);
    };
    return Metric;
}());
exports.Metric = Metric;
var MetricsHandler = /** @class */ (function () {
    function MetricsHandler(dbPath) {
        this.db = leveldb_1.LevelDB.open(dbPath);
    }
    MetricsHandler.prototype.save = function (metrics, callback) {
        var _this = this;
        metrics.forEach(function (m) {
            _this.db.put(m.username + ":" + m.timestamp, "" + m.value, function (err, result) {
                callback(err, assert_1.ok);
            });
        });
    };
    MetricsHandler.prototype.getAll = function (callback) {
        var metrics = [];
        this.db.createReadStream()
            .on('data', function (data) {
            console.log('data', data);
            var username = data.key.split(':')[0];
            var timestamp = data.key.split(':')[1];
            var metric = new Metric(username, timestamp, data.value);
            metrics.push(metric);
            console.log(metrics);
        })
            .on('error', function (err) {
            callback(err, null);
            console.log('Oh my!', err);
        })
            .on('close', function () {
            console.log('Stream closed');
        })
            .on('end', function () {
            // callback(null, metrics);
            callback(null, metrics);
            console.log('Stream ended');
        });
    };
    MetricsHandler.prototype.getByUsername = function (username, callback) {
        var metrics = [];
        this.db.createReadStream()
            .on('data', function (data) {
            if (data.key.split(':')[0] === username) {
                var username_1 = data.key.split(':')[0];
                var timestamp = data.key.split(':')[1];
                var metric = new Metric(username_1, timestamp, data.value);
                metrics.push(metric);
                console.log(metrics);
            }
        })
            .on('error', function (err) {
            callback(err, null);
            console.log('Oh my!', err);
        })
            .on('close', function () {
            console.log('Stream closed');
        })
            .on('end', function () {
            callback(null, metrics);
            console.log('Stream ended');
        });
    };
    MetricsHandler.prototype.deleteById = function (username, timestamp, value, callback) {
        this.db.del(username + ':' + timestamp, function (err) {
            callback(err, 'ok');
        });
    };
    return MetricsHandler;
}());
exports.MetricsHandler = MetricsHandler;
//# sourceMappingURL=metrics.js.map