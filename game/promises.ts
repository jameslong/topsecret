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
                return (encryptSendStoreChild(groupData, data, state, promises)
                ).then(state => {
                        state.message.childrenSent[childIndex] = true;
                        return state;
                })
        };
}

export function reply (
        groupData: State.GameData,
        data: Message.MessageData,
        promises: PromiseFactories)
{
        return (state: UpdateInfo) => {
                return (encryptSendStoreChild(groupData, data, state, promises)
                ).then(state => {
                        state.message.replySent = true;
                        return state;
                })
        };
}

export function encryptSendStoreChild (
        groupData: State.GameData,
        data: Message.MessageData,
        state: UpdateInfo,
        promises: PromiseFactories)
{
        const from = groupData.keyManagers[data.from];
        const to = groupData.keyManagers[state.player.email];

        return promises.encrypt(from, to, data.body).then(body => {
                data.body = body;
                return promises.send(data);
        }).then(messageId => {
                const messageState = createMessageState(
                        groupData,
                        state.player.email,
                        messageId,
                        name,
                        state.message.threadStartName);
                return promises.addMessage(messageState);
        }).then(messageState => state);
}

export function expired (
        groupData: State.GameData,
        state: UpdateInfo,
        promises: PromiseFactories)
{
        const { message, player } = state;
        const email = player.email;
        const messageData = groupData.threadData[message.name];

        return (state: UpdateInfo) =>
                messageData.endGame ?
                        promises.deleteAllMessages({ email })
                                .then(result =>
                                        promises.deletePlayer({ email })) :
                        promises.deleteMessage(state.message);
}

export function update (state: UpdateInfo, promises: PromiseFactories)
{
        return (state: UpdateInfo) => {
                return promises.updateMessage(state.message);
        };
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
