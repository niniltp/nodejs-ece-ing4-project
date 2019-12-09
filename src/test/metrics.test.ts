import {expect} from 'chai'
import {Metric, MetricsHandler} from '../metrics'
import {Leveldb} from "../leveldb"

const dbPath: string = './db/test';
var dbMet: MetricsHandler;

describe('Metrics', function () {
    before(function () {
        Leveldb.clear(dbPath);
        dbMet = new MetricsHandler(dbPath)
    });

    describe('#get', function () {
        it('should get empty array on non existing group', function (done) {
            dbMet.get("0", "0", function (err: Error | null, result?: Metric[]) {
                expect(err).to.be.null;
                expect(result).to.not.be.undefined;
                expect(result).to.be.empty;
                done()
            })
        });

        it('should save and get', function (done) {
            let metrics: Metric[] = [];
            const username: string = "johny";
            const timestamp: string = "123456789";
            const value: number = 5;
            metrics.push(new Metric(timestamp, value));
            dbMet.save(username, metrics, function (err: Error | null, result?: Metric[]) {
                dbMet.get(username, timestamp, function (err: Error | null, result?: Metric[]) {
                    expect(err).to.be.null;
                    expect(result).to.not.be.undefined;
                    expect(result).to.not.be.empty;
                    expect(result).to.deep.include.members([{
                        timestamp: timestamp,
                        value: value
                    }]);
                    done()
                })
            })
        })
    });

    describe('#delete', function () {
        it('delete the data', function (done) {
            let metrics: Metric[] = [];
            metrics.push(new Metric('123456711', 10));
            dbMet.save('1', metrics, function (err: Error | null, result?: Metric[]) {
                dbMet.delete('1', metrics[0].timestamp, function (err: Error | null) {
                    dbMet.get('1', null, function (err: Error | null, result?: Metric[]) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.undefined;
                        expect(result).to.be.empty;
                        done()
                    })
                })
            })
        })

        it('should not fail when data does not exist', function (done) {
            dbMet.delete('1', '9998', function (err: Error | null) {
                expect(err).to.not.be.null;
                done()
            })
        })
    });

    after(function () {
        dbMet.closeDB()
    })
});
