import Config = require('../config');
import DBTypes = require('../../../../core/src/app/dbtypes');
import Kbpgp = require('../../../../core/src/app/kbpgp');
import Log = require('../../../../core/src/app/log');
import Message = require('../../../../core/src/app/message');
import Prom = require('../../../../core/src/app/utils/promise');
import Request = require('../../../../core/src/app/requesttypes');
import DynamoDB = require('./dynamodb');
import LocalDB = require('../../../../core/src/app/localdb');

export function createPromiseFactories (
        config: Config.ConfigState,
        send: Prom.Factory<Message.MessageData, string>)
{
        const mode = config.mode;

        let calls: DBTypes.DBCalls = null;
        if (mode === Config.AppMode.Local) {
                const db = LocalDB.createDB();
                calls = LocalDB.createLocalDBCalls(db, config.debugDBTimeoutMs);
        } else {
                calls = DynamoDB.createDynamoDBCalls(config.aws);
        }
        return DBTypes.createPromiseFactories(calls, send);
}
