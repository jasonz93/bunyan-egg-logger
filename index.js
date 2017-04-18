/**
 * Created by zhangsihao on 17-4-18.
 */
const bunyan = require('bunyan');
const util = require('util');
const stream = require('stream');
const _ = require('lodash');

function EggLoggerStream(eggLogger) {
    stream.Writable.call(this, {
        objectMode: true
    });
    this.eggLogger = eggLogger;
}

util.inherits(EggLoggerStream, stream.Writable);

EggLoggerStream.prototype._write = function (record, _enc, cb) {
    let args = [];
    let msg = '';
    if (record.err) {
        args.push(record.err);
        delete record.err;
    } else {
        msg = record.msg;
        delete record.msg;
    }
    let level = record.level;
    delete record.level;
    delete record.name;
    delete record.time;
    delete record.v;
    delete record.pid;
    delete record.hostname;
    if (Object.getOwnPropertyNames(record).length) {
        msg += " meta: " + util.inspect(record);
    }
    if (msg) {
        args.push(msg);
    }
    switch (level) {
        case bunyan.TRACE:
        case bunyan.DEBUG:
            this.eggLogger.debug.apply(this.eggLogger, args);
            break;
        case bunyan.INFO:
        default:
            this.eggLogger.info.apply(this.eggLogger, args);
            break;
        case bunyan.WARN:
            this.eggLogger.warn.apply(this.eggLogger, args);
            break;
        case bunyan.ERROR:
        case bunyan.FATAL:
            this.eggLogger.error.apply(this.eggLogger, args);
            break;
    }
    cb();
};

exports.createLogger = function (eggLogger, options) {
    return bunyan.createLogger(_.merge(options, {
        streams: [
            {
                type: 'raw',
                stream: new EggLoggerStream(eggLogger)
            }
        ]
    }));
};