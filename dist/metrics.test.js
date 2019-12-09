"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var metrics_1 = require("./metrics");
var leveldb_1 = require("./leveldb");
var dbPath = './db/test';
var dbMet;
describe('Metrics', function () {
    before(function () {
        leveldb_1.Leveldb.clear(dbPath);
        dbMet = new metrics_1.MetricsHandler(dbPath);
    });
    var a = 0;
    describe('Metrics', function () {
        it('should save and get', function () {
            chai_1.expect(a).to.equal(0);
        });
    });
    describe('#get', function () {
        it('should get empty array on non existing group', function () {
            dbMet.get("0", "0", function (err, result) {
                chai_1.expect(err).to.be.null;
                chai_1.expect(result).to.not.be.undefined;
                chai_1.expect(result).to.be.empty;
            });
        });
    });
    after(function () {
        dbMet.closeDB();
    });
});
