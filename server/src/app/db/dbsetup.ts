import Config = require('../config');
import DBTypes = require('../../../../core/src/app/dbtypes');
import Kbpgp = require('../../../../core/src/app/kbpgp');
import Log = require('../../../../core/src/app/log/log');
import Message = require('../../../../core/src/app/message');
import Prom = require('../../../../core/src/app/utils/promise');
import Request = require('../../../../core/src/app/requesttypes');
import DynamoDB = require('./dynamodb');
import LocalDB = require('./localdb');

export function createPromiseFactories (
        config: Config.ConfigState,
        send: Prom.Factory<Message.MessageData, string>,
        encrypt: Prom.Factory<Kbpgp.EncryptData, string>)
{
        const mode = config.mode;
        const calls = mode === Config.AppMode.Local ?
                LocalDB.createLocalDBCalls(config.debugDBTimeoutMs) :
                DynamoDB.createDynamoDBCalls(config.dynamoDBConfig);
        return createPromiseFactoriesFromCalls(calls, send, encrypt);
}

export function createPromiseFactoriesFromCalls (
        calls: DBTypes.DBCalls,
        send: Prom.Factory<Message.MessageData, string>,
        encrypt: Prom.Factory<Kbpgp.EncryptData, string>)
{
        return {
                send,
                encrypt,
                createPlayerTable: calls.createPlayerTable,
                createMessageTable: calls.createMessageTable,
                deleteTable: calls.deleteTable,
                addPlayer: calls.addPlayer,
                updatePlayer: calls.updatePlayer,
                deletePlayer: calls.deletePlayer,
                deleteAllMessages: calls.deleteAllMessages,
                addMessage: calls.addMessage,
                updateMessage: calls.updateMessage,
                deleteMessage: calls.deleteMessage,
                getMessage: calls.getMessage,
                getMessages: calls.getMessages,
                getPlayer: calls.getPlayer,

        };
}
