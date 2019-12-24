"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var metrics_1 = require("./metrics");
var user_1 = require("./user");
var leveldb_1 = require("./leveldb");
var dbPathMetrics = 'db/testmetrics';
var dbPathUser = 'db/testuser';
var dbUser = new user_1.UserHandler('./db/testuser');
var dbMet = new metrics_1.MetricsHandler('./db/testmetrics');
describe('Metrics', function () {
    before(function () {
        try {
            leveldb_1.LevelDB.clear(dbPathMetrics);
            leveldb_1.LevelDB.clear(dbPathUser);
        }
        catch (err) {
        }
    });
    after(function () {
        dbMet.db.close();
        dbUser.db.close();
    });
    describe('#Save user', function () {
        it('Save new user', function (done) {
            // this.timeout(10000);
            var user = new user_1.User("Mads", "Mads@hotmail.com", "Mads123", false);
            dbUser.save(user, function (err, result) {
                console.log('err', err);
                console.log("result", result);
                chai_1.expect(result).to.be.string;
                chai_1.expect(result).to.be.a('string', 'ok');
                done();
            });
        }).timeout(500);
    });
    describe('#Get user', function () {
        it('Get the created user', function (done) {
            // this.timeout(10000);
            var username = "Mads";
            dbUser.get(username, function (err, result) {
                var _a, _b;
                chai_1.expect(result).to.not.be.undefined;
                chai_1.expect(result).to.include.all.keys('username', 'password', 'email');
                chai_1.expect({ username: (_a = result) === null || _a === void 0 ? void 0 : _a.username, email: (_b = result) === null || _b === void 0 ? void 0 : _b.email }).to.deep.equal({ username: 'Mads', email: 'Mads@hotmail.com' });
                done();
            });
        }).timeout(500);
    });
    describe('#Edit user', function () {
        it('Edit existing user', function (done) {
            // this.timeout(10000);
            var user = new user_1.User("Balsam", "Balsam@hotmail.com", "Balsam", false);
            dbUser.save(user, function (err, result) {
                chai_1.expect(result).to.be.string;
                chai_1.expect(result).to.be.a('string', 'ok');
                done();
            });
        }).timeout(500);
    });
    describe('#Get the edited user', function () {
        it('Get the user', function (done) {
            // this.timeout(10000);
            var username = "Balsam";
            dbUser.get(username, function (err, result) {
                var _a, _b;
                chai_1.expect(result).to.not.be.undefined;
                chai_1.expect(result).to.include.all.keys('username', 'password', 'email');
                chai_1.expect({ username: (_a = result) === null || _a === void 0 ? void 0 : _a.username, email: (_b = result) === null || _b === void 0 ? void 0 : _b.email }).to.deep.equal({ username: 'Balsam', email: 'Balsam@hotmail.com' });
                done();
            });
        }).timeout(500);
    });
    describe('#Delete user', function () {
        it('Delete user', function (done) {
            // this.timeout(10000);
            var username = "Balsam";
            dbUser.delete(username, function (err, result) {
                chai_1.expect(result).to.not.be.undefined;
                chai_1.expect(result).to.be.a('string', 'User ' + username + ' deleted');
                done();
            });
        }).timeout(500);
    });
    describe('#Save metrics', function () {
        it('Should save a new metrics', function (done) {
            // this.timeout(10000);
            var metric1 = new metrics_1.Metric("Mad", "	1576662571", 12);
            var metricArray = [];
            metricArray.push(metric1);
            dbMet.save(metricArray, function (err, result) {
                chai_1.expect(result).to.not.be.undefined;
                chai_1.expect(result).to.be.ok;
                done();
            });
        }).timeout(500);
    });
    describe('#Get users metric', function () {
        it('Get metric by username', function (done) {
            // this.timeout(10000);
            var username = "Mad";
            dbMet.getByUsername(username, function (err, result) {
                chai_1.expect(result).to.not.be.undefined;
                chai_1.expect(result).to.not.be.empty;
                chai_1.expect(result).to.have.deep.members([{ username: 'Mad', timestamp: '\t1576662571', value: '12' }]);
                done();
            });
        }).timeout(500);
    });
    describe('#Delete metric', function () {
        it('Delete users metric by username and timestamp', function (done) {
            // this.timeout(10000);
            var username = "Mad";
            var timestamp = "\t1576662571";
            var value = "";
            dbMet.deleteById(username, timestamp, value, function (err, result) {
                chai_1.expect(result).to.not.be.undefined;
                chai_1.expect(result).to.be.ok;
                done();
            });
        }).timeout(500);
    });
});
//# sourceMappingURL=metrics.test.js.map