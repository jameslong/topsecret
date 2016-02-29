import DBTypes = require('./dbtypes');
import Kbpgp = require('kbpgp');
import KbpgpHelpers = require('./kbpgp');
import Message = require('./message');
import MessageHelpers = require('./messagehelpers');
import Player = require('./player');
import Prom = require('./utils/promise');
import Request = require('./requesttypes');
import State = require('./state');

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

export interface UpdateInfo {
        message: Message.MessageState;
        player: Player.PlayerState;
}

export function child (
        groupData: State.GameData,
        data: Message.MessageData,
        childIndex: number,
        promises: PromiseFactories)
{
        return (state: UpdateInfo) => {
                const { message, player } = state;
                const threadStartName = message.threadStartName;

                return encryptSendStoreChild(
                        groupData,
                        data,
                        player,
                        threadStartName,
                        promises).then(message => {
                                message.childrenSent[childIndex] = true;
                                state.message = message;
                                return state;
                        });
        };
}

export function reply (
        groupData: State.GameData,
        data: Message.MessageData,
        promises: PromiseFactories)
{
        return (state: UpdateInfo) => {
                const { message, player } = state;
                const threadStartName = message.threadStartName;

                return encryptSendStoreChild(
                        groupData,
                        data,
                        player,
                        threadStartName,
                        promises).then(message => {
                                message.replySent = true;
                                state.message = message;
                                return state;
                })
        };
}

export function encryptSendStoreChild (
        groupData: State.GameData,
        data: Message.MessageData,
        player: Player.PlayerState,
        threadStartName: string,
        promises: PromiseFactories)
{
        const from = groupData.keyManagers[data.from];
        const to = groupData.keyManagers[player.email];

        return promises.encrypt(from, to, data.body).then(body => {
                data.body = body;
                return promises.send(data);
        }).then(messageId => {
                const messageState = createMessageState(
                        groupData,
                        player.email,
                        messageId,
                        name,
                        threadStartName);
                return promises.addMessage(messageState);
        });
}

export function update (state: UpdateInfo, promises: PromiseFactories)
{
        return promises.updateMessage(state.message);
}

export function expired (
        groupData: State.GameData,
        state: UpdateInfo,
        promises: PromiseFactories): Promise<any>
{
        const { message, player } = state;
        const email = player.email;
        const messageData = groupData.threadData[message.name];

        return messageData.endGame ?
                endGame(player, promises) :
                promises.deleteMessage(state.message);
}

export function endGame (
        player: Player.PlayerState,
        promises: PromiseFactories): Promise<any>
{
        const email = player.email;

        return promises.deleteAllMessages({ email }).then(result =>
                promises.deletePlayer({ email }));
}

export function beginGame (
        groupData: State.GameData,
        player: Player.PlayerState,
        data: Message.MessageData,
        promises: PromiseFactories)
{
        return promises.addPlayer(player).then(player =>
                encryptSendStoreChild(groupData, data, player, null, promises));
}

export function resign (
        data: Message.MessageData,
        player: Player.PlayerState,
        promises: PromiseFactories)
{
        return promises.send(data).then(messageId =>
                endGame(player, promises));
}

function createMessageState (
        groupData: State.GameData,
        playerEmail: string,
        messageId: string,
        name: string,
        threadStartName: string)
{
        const newThreadMessage = groupData.threadData[name];
        const numberOfChildren = newThreadMessage.children.length;
        const newThreadStartName = newThreadMessage.threadSubject ?
                newThreadMessage.name : threadStartName;

        return MessageHelpers.createMessageState(
                playerEmail,
                groupData.name,
                messageId,
                name,
                newThreadStartName,
                numberOfChildren);
}
