import {Metric, MetricsHandler} from "../models/metrics";
const config = require('../helpers/_config');

const dbPath = process.env.NODE_ENV === 'test' ? config.dbPath['test'] : config.dbPath['development'];
const {createFile} = require('../helpers/files');
createFile(dbPath + '/metrics');
const dbMet: MetricsHandler = new MetricsHandler(dbPath + '/metrics');

/* Metric CRUD */
exports.create = (req: any, res: any) => {
    dbMet.save(req.params.username, req.body, (err: Error | null) => {
        if (err) throw err;
        res.status(200).json(req.body);
    });
};

exports.getAll = (req: any, res: any) => {
    dbMet.get(req.params.username, null, (err: Error | null, result?: Metric[] | null) => {
        if (err) throw err;
        res.status(200).send(result);
    })
};

exports.getOne = (req: any, res: any) => {
    dbMet.get(req.params.username, req.params.metricId, (err: Error | null, result?: Metric[] | null) => {
        if (err) throw err;
        res.status(200).send(result);
    })
};

exports.delete = (req: any, res: any) => {
    dbMet.delete(req.params.username, req.params.metricId, (err: Error | null) => {
        if (err) throw err;
        res.status(200).send("Delete successful !");
    })
};

exports.closeDB = () => {
  dbMet.closeDB();
};