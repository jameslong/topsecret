import Config = require('../config');
import DBTypes = require('../../../../game/dbtypes');
import Kbpgp = require('../../../../game/kbpgp');
import Log = require('../../../../game/log/log');
import Message = require('../../../../game/message');
import Prom = require('../../../../game/utils/promise');
import Request = require('../../../../game/requesttypes');
import DynamoDB = require('./dynamodb');
import LocalDB = require('./localdb');

export function createPromiseFactories (
        config: Config.ConfigState,
        send: Prom.Factory<Message.MessageData, string>,
        encrypt: Prom.Factory<Kbpgp.EncryptData, string>)
{
        const mode = config.mode;
        const calls = mode === Config.AppMode.Local ?
                LocalDB.createLocalDBCalls(config) :
                DynamoDB.createDynamoDBCalls(config);

        return {
                send,
                encrypt,
                createPlayerTable: calls.createPlayerTable,
                createMessageTable: calls.createMessageTable,
                deleteTable: calls.deleteTable,
                addPlayer: calls.addPlayer,
                updatePlayer: calls.updatePlayer,
                removePlayer: calls.removePlayer,
                deleteAllMessages: calls.deleteAllMessages,
                storeMessage: calls.storeMessage,
                updateMessage: calls.updateMessage,
                deleteMessage: calls.deleteMessage,
                getMessage: calls.getMessage,
                getMessages: calls.getMessages,
                getPlayerState: calls.getPlayerState,

        };
}
