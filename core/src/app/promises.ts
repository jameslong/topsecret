import DBTypes = require('./dbtypes');
import KbpgpHelpers = require('./kbpgp');
import Main = require('./main');
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
        state: UpdateInfo,
        name: string,
        childIndex: number,
        domain: string,
        groupData: State.GameData,
        promises: DBTypes.PromiseFactories)
{
        const { message, player } = state;
        const threadStartName = message.threadStartName;

        return encryptSendStoreChild(
                name,
                threadStartName,
                player,
                domain,
                groupData,
                promises).then(result => {
                        message.childrenSent[childIndex] = true;
                        return state;
                });
}

export function reply (
        state: UpdateInfo,
        name: string,
        domain: string,
        groupData: State.GameData,
        promises: DBTypes.PromiseFactories)
{
        const { message, player } = state;
        const threadStartName = message.threadStartName;

        return encryptSendStoreChild(
                name,
                threadStartName,
                player,
                domain,
                groupData,
                promises).then(result => {
                        message.replySent = true;
                        return state;
                });
}

export function encryptSendStoreChild (
        name: string,
        threadStartName: string,
        player: Player.PlayerState,
        domain: string,
        groupData: State.GameData,
        promises: DBTypes.PromiseFactories)
{
        const data = Main.createMessageData(
                groupData,
                player,
                name,
                threadStartName,
                domain);

        const messageData = groupData.messages[name];
        const from = groupData.keyManagers[messageData.message.from];

        return KbpgpHelpers.loadKey(player.publicKey).then(to => {
                const encryptData = { from, to, text: data.body };
                return KbpgpHelpers.signEncrypt(encryptData);
        }).then(body => {
                        data.body = body;
                        return promises.send(data);
        }).then(id => {
                const messageState = createMessageState(
                        groupData,
                        player.email,
                        id,
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
        const messageData = groupData.messages[message.name];

        return messageData.endGame ?
                endGame(email, promises) :
                promises.deleteMessage(state.message.id);
}

export function endGame (
        email: string,
        promises: DBTypes.PromiseFactories): Promise<any>
{
        return promises.deleteAllMessages(email).then(result =>
                promises.deletePlayer(email));
}

export function beginGame (
        name: string,
        player: Player.PlayerState,
        domain: string,
        groupData: State.GameData,
        promises: DBTypes.PromiseFactories)
{
        return promises.addPlayer(player).then(result =>
                encryptSendStoreChild(
                        name,
                        null,
                        player,
                        domain,
                        groupData,
                        promises));
}

export function resign (
        name: string,
        email: string,
        domain: string,
        groupData: State.GameData,
        promises: DBTypes.PromiseFactories)
{
        const data = Main.createPlayerlessMessageData(
                groupData, email, name, null, domain);

        return promises.send(data).then(id =>
                endGame(email, promises));
}

function createMessageState (
        groupData: State.GameData,
        playerEmail: string,
        id: string,
        name: string,
        threadStartName: string)
{
        const newThreadMessage = groupData.messages[name];
        const numberOfChildren = newThreadMessage.children.length;
        const newThreadStartName = newThreadMessage.threadSubject ?
                newThreadMessage.name : threadStartName;

        return MessageHelpers.createMessageState(
                playerEmail,
                id,
                name,
                newThreadStartName,
                numberOfChildren);
}
