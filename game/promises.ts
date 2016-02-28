import DBTypes = require('./dbtypes');
import Message = require('./message');
import RequestTypes = require('./requesttypes');

export function createPromiseFactories (
        send: RequestTypes.SendRequest,
        dbCalls: DBTypes.DBCalls)
{
        return {
                sendMessage: promiseFactory(send),
                addMessage: promiseFactory(dbCalls.storeMessage),
                updateMessage: promiseFactory(dbCalls.updateMessage),
                deleteMessage: promiseFactory(dbCalls.deleteMessage),
                deleteAllMessages: promiseFactory(dbCalls.deleteAllMessages),
                addPlayer: promiseFactory(dbCalls.addPlayer),
                updatePlayer: promiseFactory(dbCalls.updatePlayer),
                deletePlayer: promiseFactory(dbCalls.removePlayer),
        };
}

export function promiseFactory<T, U> (requestFn: RequestTypes.RequestFunc<T, U>)
{
        return (data: T) => requestPromise(requestFn, data);
}

export function requestPromise<T, U> (
        requestFn: RequestTypes.RequestFunc<T, U>,
        data: T)
{
        return new Promise<U>((resolve, reject) =>
                requestFn(data, (error, result) =>
                        error ? reject(error) : resolve(result))
        );
}
