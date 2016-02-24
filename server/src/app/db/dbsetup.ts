import Config = require('../config');
import DBTypes = require('../game/dbtypes');
import Log = require('../game/log/log');
import Request = require('../game/requesttypes');
import DynamoDB = require('./dynamodb');
import LocalDB = require('./localdb');

export function createDBCalls (config: Config.ConfigState): DBTypes.DBCalls
{
        const mode = config.mode;
        const calls = mode === Config.AppMode.Local ?
                LocalDB.createLocalDBCalls(config) :
                DynamoDB.createDynamoDBCalls(config);

        return addLogs(calls);
}

function addLogs(calls: DBTypes.DBCalls): DBTypes.DBCalls
{
        return {
                createPlayerTable: addLog(calls.createPlayerTable, 'createPlayerTable'),
                createMessageTable: addLog(calls.createMessageTable, 'createMessageTable'),
                deleteTable: addLog(calls.deleteTable, 'deleteTable'),
                addPlayer: addLog(calls.addPlayer, 'addPlayer'),
                removePlayer: addLog(calls.removePlayer, 'removePlayer'),
                deleteAllMessages: addLog(calls.deleteAllMessages, 'deleteAllMessages'),
                getMessageUID: addLog(calls.getMessageUID, 'getMessageUID'),
                storeMessage: addLog(calls.storeMessage, 'storeMessage'),
                deleteMessage: addLog(calls.deleteMessage, 'deleteMessage'),
                getMessage: addLog(calls.getMessage, 'getMessage'),
                getMessages: addLog(calls.getMessages, 'getMessages'),
                storeReply: addLog(calls.storeReply, 'storeReply'),
                storePublicKey: addLog(calls.storePublicKey, 'storePublicKey'),
                getPublicKey: addLog(calls.getPublicKey, 'getPublicKey'),
                storeEmptyMessageId: addLog(calls.storeEmptyMessageId, 'storeEmptyMessageId'),
                getEmptyMessageId: addLog(calls.getEmptyMessageId, 'getEmptyMessageId'),
                deleteEmptyMessageId: addLog(calls.deleteEmptyMessageId, 'deleteEmptyMessageId'),
                getPlayerState: addLog(calls.getPlayerState, 'getPlayerState'),
                markChildSent: addLog(calls.markChildSent, 'markChildSent'),
                markReplySent: addLog(calls.markReplySent, 'markReplySent'),
        };

}

export function addLog<T, U> (
        requestFn: Request.RequestFunc<T, U>, desc: string)
        : Request.RequestFunc<T, U>
{
        return (params: T, callback: Request.Callback<U>) =>
                requestFn(params, (error, data) => {
                        error ?
                                Log.info('awsRequestError', { desc, error }) :
                                Log.debug(`request success: ${desc}`);

                        callback(error, data);
                });
}
