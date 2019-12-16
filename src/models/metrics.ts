import {Leveldb} from './leveldb';
import WriteStream from 'level-ws';

export class Metric {
    public timestamp: string;
    public value: number;

    constructor(ts: string, v: number) {
        this.timestamp = ts;
        this.value = v;
    }
}

export class MetricsHandler {
    private db: any;

    constructor(dbPath: string) {
        this.db = Leveldb.open(dbPath)
    }

    public closeDB() {
        this.db.close();
    }

    public save(
        username: string,
        metrics: Metric[],
        callback: (error: Error | null) => void) {
        const stream = WriteStream(this.db);
        stream.on('error', callback);
        stream.on('close', callback);
        metrics.forEach((m: Metric) => {
            stream.write({key: `metric:${username}:${m.timestamp}`, value: m.value})
        });
        stream.end()
    }

    public get(
        username: string,
        metricId: string | null,
        callback: (error: Error | null, result?: Metric[]) => void) {
        let metrics: Metric[] = [];
        const rs = this.db.createReadStream()
            .on('data', function (data) {
                let timestamp: string = data.key.split(':')[2];
                let id: string = data.key.split(':')[1];
                if (id === username && (timestamp === metricId || metricId === null)) {
                    let metric: Metric = new Metric(timestamp, data.value);
                    metrics.push(metric);
                }
            })
            .on('error', function (err) {
                callback(err);
            })
            .on('close', function () {
                callback(null, metrics);
            });
    }

    public delete(
        username: string,
        timestampId: string,
        callback: (error: Error | null) => void) {
        let key: string = `metric:${username}:${timestampId}`;
        this.db.del(key, function (err) {
            callback(err);
        });
    }
}