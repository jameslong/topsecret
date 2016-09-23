import DBTypes = require('./dbtypes');
import KbpgpHelpers = require('./kbpgp');
import Log = require('./log');
import Main = require('./main');
import Message = require('./message');
import Player = require('./player');
import Prom = require('./utils/promise');
import Script = require('./script');
import State = require('./gamestate');

export interface UpdateState {
        message: Message.MessageState;
        player: Player.PlayerState;
        timestampMs: number;
        promises: DBTypes.PromiseFactories;
        narrative: State.NarrativeState;
}

export function child (state: UpdateState, childIndex: number)
{
        const { message, player, narrative, timestampMs, promises } = state;
        const threadStartName = message.threadStartName;
        const inReplyToId = message.id;

        const messageData = narrative.messages[message.name];
        const child = messageData.children[childIndex];
        const name = child.name;
        const condition = child.condition;
        const quotedReply = '';

        const send = !condition || Script.executeScript(condition, player, timestampMs) ?
                encryptSendStoreChild(
                        name,
                        threadStartName,
                        inReplyToId,
                        quotedReply,
                        player,
                        timestampMs,
                        narrative,
                        promises) :
                Promise.resolve(message);

        return send.then(result => {
                message.childrenSent[childIndex] = true;
                return state;
        });
}

export function reply (state: UpdateState, index: number)
{
        const { message, player, narrative, timestampMs, promises } = state;
        const threadStartName = message.threadStartName;
        const inReplyToId = message.id;
        const quotedReply = message.reply.body;

        const messageData = narrative.messages[message.name];
        const replyOptions = narrative.replyOptions[messageData.replyOptions];
        const replyDelay = replyOptions[message.reply.index].messageDelays[index];
        const name = replyDelay.name;

        const send = encryptSendStoreChild(
                name,
                threadStartName,
                inReplyToId,
                quotedReply,
                player,
                timestampMs,
                narrative,
                promises);

        return send.then(result => {
                message.reply.sent.push(index);
                return state;
        });
}

export function fallback (state: UpdateState)
{
        const { message, player, narrative, timestampMs, promises } = state;
        const threadStartName = message.threadStartName;
        const inReplyToId = message.id;

        const messageData = narrative.messages[message.name];
        const fallback = messageData.fallback;
        const name = fallback.name;
        const condition = fallback.condition;
        const quotedReply = '';

        const send = !condition || Script.executeScript(condition, player, timestampMs) ?
                encryptSendStoreChild(
                        name,
                        threadStartName,
                        inReplyToId,
                        quotedReply,
                        player,
                        timestampMs,
                        narrative,
                        promises) :
                Promise.resolve(message);

        return send.then(result => {
                message.fallbackSent = true;
                return state;
        });
}

export function encryptSendStoreChild (
        name: string,
        threadStartName: string,
        inReplyToId: string,
        quotedReply: string,
        player: Player.PlayerState,
        timestampMs: number,
        groupData: State.NarrativeState,
        promises: DBTypes.PromiseFactories)
{
        const data = Main.createMessageData(
                groupData,
                player,
                name,
                threadStartName,
                inReplyToId,
                quotedReply);

        const messageData = groupData.messages[name];
        const from = groupData.keyManagers[messageData.message.from];

        const encrypt = player.publicKey && messageData.encrypted ?
                KbpgpHelpers.loadKey(player.publicKey).then(to => {
                        const encryptData = { from, to, text: data.body };
                        return KbpgpHelpers.signEncrypt(encryptData);
                }) :
                Promise.resolve(data.body);

        return encrypt.then(body => {
                data.body = body;
                return promises.send(data);
        }).then(id => {
                const messageState = createMessageState(
                        groupData,
                        player.email,
                        id,
                        name,
                        timestampMs,
                        threadStartName);
                return promises.addMessage(messageState);
        }).then(result => {
                const script = messageData.script;
                player.vars[result.name] = true;
                Script.executeScript(script, player, timestampMs);
                if (messageData.startGame) {
                        player.vars['utcStartDate'] = timestampMs;
                }
                return result;
        });
}

export function update (state: UpdateState)
{
        return state.promises.updateMessage(state.message).then(
                message => state);
}

export function updatePlayer (state: UpdateState)
{
        return state.promises.updatePlayer(state.player).then(
                player => state);
}

export function expired (state: UpdateState): Promise<any>
{
        const { message, player, narrative, promises } = state;
        const email = player.email;
        const messageData = narrative.messages[message.name];

        return messageData.endGame ?
                endGame(email, promises) :
                promises.deleteMessage(state.message.id);
}

export function endGame (
        email: string, promises: DBTypes.PromiseFactories): Promise<any>
{
        Log.metric({
                type: 'END_GAME',
                playerEmail: email,
        });

        return promises.deleteAllMessages(email).then(result =>
                promises.deletePlayer(email));
}

export function beginGame (
        name: string,
        player: Player.PlayerState,
        timestampMs: number,
        groupData: State.NarrativeState,
        promises: DBTypes.PromiseFactories)
{
        const threadStartName: string = null;
        const inReplyToId: string = null;
        const quotedReply = '';

        Log.metric({
                type: 'BEGIN_GAME',
                playerEmail: player.email,
                firstName: player.vars.firstName,
                lastName: player.vars.lastName,
                messageName: name,
                narrativeName: groupData.name,
                utcOffset: player.utcOffset,
        });

        return promises.addPlayer(player).then(result =>
                encryptSendStoreChild(
                        name,
                        threadStartName,
                        inReplyToId,
                        quotedReply,
                        player,
                        timestampMs,
                        groupData,
                        promises));
}

export function resign (
        name: string,
        email: string,
        groupData: State.NarrativeState,
        promises: DBTypes.PromiseFactories)
{
        const threadStartName: string = null;
        const inReplyToId: string = null;
        const data = Main.createPlayerlessMessageData(
                groupData, email, name, threadStartName, inReplyToId);

        return promises.send(data).then(id =>
                endGame(email, promises));
}

function createMessageState (
        groupData: State.NarrativeState,
        playerEmail: string,
        id: string,
        name: string,
        sentTimestampMs: number,
        threadStartName: string)
{
        const newThreadMessage = groupData.messages[name];
        const numberOfChildren = newThreadMessage.children.length;
        const newThreadStartName = newThreadMessage.threadSubject ?
                newThreadMessage.name : threadStartName;

        return Message.createMessageState(
                playerEmail,
                id,
                name,
                sentTimestampMs,
                newThreadStartName,
                numberOfChildren);
}
