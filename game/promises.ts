import DBTypes = require('./dbtypes');
import Kbpgp = require('kbpgp');
import KbpgpHelpers = require('./kbpgp');
import Message = require('./message');
import Player = require('./player');
import Request = require('./requesttypes');

export interface PromiseFactories {
        send: PromiseFactory<Message.MessageData, string>;
        encrypt: (
                from: Kbpgp.KeyManagerInstance,
                to: Kbpgp.KeyManagerInstance,
                text: string) => Promise<string>;
        addMessage: PromiseFactory<Message.MessageState, Message.MessageState>;
        updateMessage: PromiseFactory<Message.MessageState, Message.MessageState>;
        deleteMessage: PromiseFactory<Message.MessageState, Message.MessageState>;
        deleteAllMessages: PromiseFactory<Request.DeleteAllMessagesParams, {}>;
        addPlayer: PromiseFactory<Player.PlayerState, Player.PlayerState>;
        updatePlayer: PromiseFactory<Player.PlayerState, Player.PlayerState>;
        deletePlayer: PromiseFactory<Request.RemovePlayerParams, Player.PlayerState>;
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

export type PromiseFactory<T, U> = (data: T) => Promise<U>;

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
