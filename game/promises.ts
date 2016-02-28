import DBTypes = require('./dbtypes');
import Helpers = require('./utils/helpers');
import Message = require('./message');
import Player = require('./player');
import RequestTypes = require('./requesttypes');

export interface UpdateInfo {
        message: Message.MessageState;
        player: Player.PlayerState;
}

export function createPromiseFactories (
        send: RequestTypes.SendRequest,
        dbCalls: DBTypes.DBCalls)
{
        return {
                sendMessage: sendPromiseFactory(send),
                addMessage: promiseFactory(dbCalls.storeMessage, messagePromise),
                updateMessage: promiseFactory(dbCalls.updateMessage, messagePromise),
                deleteMessage: promiseFactory(dbCalls.deleteMessage, messagePromise),
                addPlayer: promiseFactory(dbCalls.addPlayer, playerPromise),
                updatePlayer: promiseFactory(dbCalls.updatePlayer, playerPromise),
                deletePlayer: promiseFactory(dbCalls.removePlayer, playerPromise),
        };
}

export function sendPromiseFactory (requestFn: RequestTypes.SendRequest)
{
        return (state: UpdateInfo, data: Message.MessageData) =>
                sendPromise(requestFn, state, data);
}

export function sendPromise (
        requestFn: RequestTypes.RequestFunc<Message.MessageData, string>,
        state: UpdateInfo,
        messageData: Message.MessageData)
{
        return new Promise<UpdateInfo>((resolve, reject) =>
                requestFn(messageData, (error, player) => {
                        error ? reject(error) : resolve(state);
                })
        );
}

export function playerPromise (
        requestFn: RequestTypes.RequestFunc<Player.PlayerState, Player.PlayerState>,
        state: UpdateInfo)
{
        return new Promise<UpdateInfo>((resolve, reject) =>
                requestFn(state.player, (error, player) => {
                        const newState = Helpers.assign(state, { player });
                        error ? reject(error) : resolve(newState);
                })
        );
}

export function messagePromise (
        requestFn: RequestTypes.RequestFunc<Message.MessageState, Message.MessageState>,
        state: UpdateInfo)
{
        return new Promise<UpdateInfo>((resolve, reject) =>
                requestFn(state.message, (error, message) => {
                        const newState = Helpers.assign(state, { message });
                        error ? reject(error) : resolve(newState);
                })
        );
}

type PromiseCtor = <T, U>(
        requestFn: RequestTypes.RequestFunc<T, U>, data: T) => Promise<U>;

export function promiseFactory<T, U> (
        requestFn: RequestTypes.RequestFunc<T, U>,
        promiseCtor: PromiseCtor)
{
        return (data: T) => promiseCtor(requestFn, data);
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
