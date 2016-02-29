import DBTypes = require('./dbtypes');
import Kbpgp = require('kbpgp');
import KbpgpHelpers = require('./kbpgp');
import Message = require('./message');
import Player = require('./player');
import Prom = require('./utils/promise');
import Request = require('./requesttypes');

export interface PromiseFactories {
        send: Prom.Factory<Message.MessageData, string>;
        encrypt: (
                from: Kbpgp.KeyManagerInstance,
                to: Kbpgp.KeyManagerInstance,
                text: string) => Promise<string>;
        addMessage: Prom.Factory<Message.MessageState, Message.MessageState>;
        updateMessage: Prom.Factory<Message.MessageState, Message.MessageState>;
        deleteMessage: Prom.Factory<Message.MessageState, Message.MessageState>;
        deleteAllMessages: Prom.Factory<Request.DeleteAllMessagesParams, {}>;
        addPlayer: Prom.Factory<Player.PlayerState, Player.PlayerState>;
        updatePlayer: Prom.Factory<Player.PlayerState, Player.PlayerState>;
        deletePlayer: Prom.Factory<Request.RemovePlayerParams, Player.PlayerState>;
}

export function createPromiseFactories (
        send: Request.SendRequest,
        dbCalls: DBTypes.DBCalls)
{
        return {
                send: promiseFactory(send),
                encrypt: (
                        from: Kbpgp.KeyManagerInstance,
                        to: Kbpgp.KeyManagerInstance,
                        text: string) => KbpgpHelpers.signEncrypt(from, to, text),
                addMessage: promiseFactory(dbCalls.storeMessage),
                updateMessage: promiseFactory(dbCalls.updateMessage),
                deleteMessage: promiseFactory(dbCalls.deleteMessage),
                deleteAllMessages: promiseFactory(dbCalls.deleteAllMessages),
                addPlayer: promiseFactory(dbCalls.addPlayer),
                updatePlayer: promiseFactory(dbCalls.updatePlayer),
                deletePlayer: promiseFactory(dbCalls.removePlayer),
        };
}

export function promiseFactory<T, U> (requestFn: Request.RequestFunc<T, U>)
{
        return (data: T) => requestPromise(requestFn, data);
}

export function requestPromise<T, U> (
        requestFn: Request.RequestFunc<T, U>,
        data: T)
{
        return new Promise<U>((resolve, reject) =>
                requestFn(data, (error, result) =>
                        error ? reject(error) : resolve(result))
        );
}
