"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var metrics_1 = require("./metrics");
var leveldb_1 = require("./leveldb");
// const dbPath: string = 'db_test'
var dbPath = 'db/test';
var dbMet;
describe('Metrics', function () {
    before(function () {
        try {
            leveldb_1.LevelDB.clear(dbPath);
        }
        catch (err) {
        }
        dbMet = new metrics_1.MetricsHandler(dbPath);
    });
    after(function () {
        dbMet.db.close();
    });
    describe('#get', function () {
        it('should get empty array on non existing group', function (next) {
            dbMet.getAll(function (err, result) {
                //   console.log();
                // expect(err).to.be.null
                // expect(result).to.not.be.undefined
                chai_1.expect(result).to.be.empty;
                // expect(result).to.be.true
                next()
            });
        });
    });
    //   describe('#post', function () {
    //     it('should save a new array in group', function () {
    //         var met: Metric[] = []
    //         met.push(new Metric('1235461', 12))
    //         dbMet.save('1', met, (err: Error | null, result?: Metric[]) => {
    //         // expect(err).to.be.null
    //                 // expect(result).to.not.be.undefined
    //                 // expect(result).to.be.empty
    //                 // expect(result).to.be.true
    //                 dbMet.getById(12,function (err: Error | null, result?: Metric[]) {
    //                     //   console.log();
    //                     // expect(err).to.be.null
    //                     // expect(result).to.not.be.undefined
    //                     // expect(result).to.be.empty
    //                     // expect(result).to.be.true
    //                     if(result)
    //                     expect(result[0].value).to.equal(12)
    //                 })
    //         })
    //     })
    //   })
});
// '#save' should save data
// '#save' should update existing data
// '#delete' should delete data
// '#delete' should not fail if data does not exist
