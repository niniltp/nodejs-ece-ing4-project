"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var metrics_1 = require("../metrics");
var leveldb_1 = require("../leveldb");
var dbPath = './db/test';
var dbMet;
describe('Metrics', function () {
    before(function () {
        leveldb_1.Leveldb.clear(dbPath);
        dbMet = new metrics_1.MetricsHandler(dbPath);
    });
    describe('#get', function () {
        it('should get empty array on non existing group', function (done) {
            dbMet.get("0", "0", function (err, result) {
                chai_1.expect(err).to.be.null;
                chai_1.expect(result).to.not.be.undefined;
                chai_1.expect(result).to.be.empty;
                done();
            });
        });
        it('should save and get', function (done) {
            var metrics = [];
            var username = "johny";
            var timestamp = "123456789";
            var value = 5;
            metrics.push(new metrics_1.Metric(timestamp, value));
            dbMet.save(username, metrics, function (err, result) {
                dbMet.get(username, timestamp, function (err, result) {
                    chai_1.expect(err).to.be.null;
                    chai_1.expect(result).to.not.be.undefined;
                    chai_1.expect(result).to.not.be.empty;
                    chai_1.expect(result).to.deep.include.members([{
                            timestamp: timestamp,
                            value: value
                        }]);
                    done();
                });
            });
        });
    });
    describe('#delete', function () {
        it('delete the data', function (done) {
            var metrics = [];
            metrics.push(new metrics_1.Metric('123456711', 10));
            dbMet.save('1', metrics, function (err, result) {
                dbMet.delete('1', metrics[0].timestamp, function (err) {
                    dbMet.get('1', null, function (err, result) {
                        chai_1.expect(err).to.be.null;
                        chai_1.expect(result).to.not.be.undefined;
                        chai_1.expect(result).to.be.empty;
                        done();
                    });
                });
            });
        });
        it('should not fail when data does not exist', function (done) {
            dbMet.delete('1', '9998', function (err) {
                chai_1.expect(err).to.not.be.null;
                done();
            });
        });
    });
    after(function () {
        dbMet.closeDB();
    });
});
