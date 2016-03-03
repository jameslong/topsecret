import DBTypes = require('./dbtypes');
import Message = require('./message');
import MessageHelpers = require('./messagehelpers');
import Player = require('./player');
import Prom = require('./utils/promise');
import Request = require('./requesttypes');
import State = require('./state');

export interface UpdateInfo {
        message: Message.MessageState;
        player: Player.PlayerState;
}

export function child (
        groupData: State.GameData,
        data: Message.MessageData,
        childIndex: number,
        promises: DBTypes.PromiseFactories)
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
        promises: DBTypes.PromiseFactories)
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
        promises: DBTypes.PromiseFactories)
{
        const from = groupData.keyManagers[data.from];
        const to = groupData.keyManagers[player.email];
        const encryptData = { from, to, text: data.body };

        return promises.encrypt(encryptData).then(body => {
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

export function update (state: UpdateInfo, promises: DBTypes.PromiseFactories)
{
        return promises.updateMessage(state.message);
}

export function expired (
        groupData: State.GameData,
        state: UpdateInfo,
        promises: DBTypes.PromiseFactories): Promise<any>
{
        const { message, player } = state;
        const email = player.email;
        const messageData = groupData.threadData[message.name];

        return messageData.endGame ?
                endGame(email, promises) :
                promises.deleteMessage(state.message);
}

export function endGame (
        email: string,
        promises: DBTypes.PromiseFactories): Promise<any>
{
        return promises.deleteAllMessages({ email }).then(result =>
                promises.deletePlayer(email));
}

export function beginGame (
        groupData: State.GameData,
        player: Player.PlayerState,
        data: Message.MessageData,
        promises: DBTypes.PromiseFactories)
{
        return promises.addPlayer(player).then(result =>
                encryptSendStoreChild(groupData, data, player, null, promises));
}

export function resign (
        data: Message.MessageData,
        email: string,
        promises: DBTypes.PromiseFactories)
{
        return promises.send(data).then(messageId =>
                endGame(email, promises));
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
