"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var level_ws_1 = __importDefault(require("level-ws"));
var leveldb_1 = require("./leveldb");
var Metric = /** @class */ (function () {
    function Metric(ts, v) {
        this.timestamp = ts;
        this.value = v;
    }
    return Metric;
}());
exports.Metric = Metric;
//   export class MetricsHandler {
//     static get(callback: (error: Error | null, result?: Metric[]) => void) {
//       const result = [
//         new Metric('2013-11-04 14:00 UTC', 12),
//         new Metric('2013-11-04 14:30 UTC', 15)
//       ]
//       callback(null, result)
//     }
//   }
var MetricsHandler = /** @class */ (function () {
    function MetricsHandler(dbPath) {
        this.db = leveldb_1.LevelDB.open(dbPath);
    }
    MetricsHandler.prototype.save = function (key, metrics, callback) {
        console.log('key: ', key);
        // console.log('Metrics: ',metrics);
        var stream = level_ws_1.default(this.db);
        stream.on('error', callback);
        stream.on('close', callback);
        metrics.forEach(function (m) {
            stream.write({ key: "metric:" + key + ":" + m.timestamp, value: m.value });
        });
        stream.end();
    };
    MetricsHandler.prototype.getAll = function (callback) {
        var metrics = [];
        this.db.createReadStream()
            .on('data', function (data) {
            // console.log(data.key, '=', data.value)
            // callback(null, data);
            var timestamp = data.key.split(':')[1];
            var metric = new Metric(timestamp, data.value);
            // let metric: Metric = new Metric(data.key, data.value);
            metrics.push(metric);
            console.log(metrics);
            // metrics.push(data)
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
    MetricsHandler.prototype.getById = function (key, callback) {
        var metrics = [];
        this.db.createReadStream()
            .on('data', function (data) {
            console.log(key);
            console.log(data.value);
            if (data.value === key) {
                var timestamp = data.key.split(':')[1];
                var metric = new Metric(timestamp, data.value);
                // let metric: Metric = new Metric(data.key, data.value);
                console.log(metric);
                console.log(data.key);
                metrics.push(metric);
                // metrics.push(data)
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
    MetricsHandler.prototype.deleteById = function (key, callback) {
        // console.log('m: ',metrics);
        var ws = level_ws_1.default(this.db);
        // console.log(ws);
        ws.on('error', function (err) {
            console.log('Oh my!', err);
        });
        ws.on('close', function () {
            console.log('Stream closed');
        });
        ws.write({ type: 'del', key: 'Metric { timestamp: 1, value: 85 }' });
        // key: `metric:${key}:${m.timestamp}`, value: m.value }
        // ws.write({ type: 'del', key: ourKey })
        // metrics.forEach((m: Metric) => {
        //   console.log('m: ',metrics);
        //   ws.write({ type: 'del', key: '10'})
        //   // stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value })
        // })
        ws.on('end', function () {
            console.log('Stream closed2');
            callback(null, null);
        });
        this.db.del('metrics', function (err) {
            console.log("Hello");
        });
    };
    return MetricsHandler;
}());
exports.MetricsHandler = MetricsHandler;
