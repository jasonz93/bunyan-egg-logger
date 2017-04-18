/**
 * Created by zhangsihao on 17-4-18.
 */
const BunyanEggLogger = require('../');
const EggConsoleLogger = require('egg-logger').EggConsoleLogger;

describe('Test logger adapter', function () {
    let eggLogger = new EggConsoleLogger({
        level: 'debug'
    });
    let logger = BunyanEggLogger.createLogger(eggLogger, {
        name: 'bunyan'
    });

    it('Test log', function () {
        logger.trace('hahaha');
        logger.info('haha %d', 1);
        logger.info({
            foo: 'bar'
        });
        logger.error(new Error('some err'));
        logger.error(new Error('another err'), {
            foo: 'bar'
        })
    })
});
