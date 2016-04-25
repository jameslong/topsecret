import Arr = require('./utils/array');
import Clock = require('./clock');
import DBTypes = require('./dbtypes');
import Fun = require('./utils/function');
import Message = require('./message');
import MessageHelpers = require('./messagehelpers');
import Player = require('./player');
import Prom = require('./utils/promise');
import Promises = require('./promises');
import Request = require('./requesttypes');
import State = require('./state');

export function tick (app: State.State, exclusiveStartKey: string)
{
        const maxResults = 1;
        const params = { exclusiveStartKey, maxResults };
        const promises = app.promises;

        return promises.getMessages(params).then(result => {
                const { messages, lastEvaluatedKey } = result;
                const message = messages.length ? messages[0] : null;

                return (message ?
                        promises.getPlayer(message.email).then(player =>
                                update(app, message, player)
                        ) :
                        Promise.resolve(null)
                ).then(result => Promise.resolve(lastEvaluatedKey));
        });
}

export function update (
        app: State.State,
        message: Message.MessageState,
        player: Player.PlayerState)
{
        const promises = app.promises;
        const groupData = app.data[player.version];
        const messageData = groupData.messages[message.name];
        const timestampMs = Clock.gameTimeMs(app.clock);
        const state = { message, player, timestampMs };

        const children = pendingChildren(
                app, groupData, state, timestampMs, promises);
        const response = pendingResponse(
                app, groupData, state, timestampMs, promises);
        const sequence = children.concat(response);

        return Prom.executeSequentially(sequence, state).then(state =>
                Promises.updatePlayer(state, promises)
        ).then(state =>
                isExpired(state.message, messageData) ?
                        Promises.expired(groupData, state, promises) :
                        Promises.update(state, promises)
        );
}

function pendingChildren (
        app: State.State,
        groupData: State.GameData,
        state: Promises.UpdateInfo,
        currentMs: number,
        promises: DBTypes.PromiseFactories)
{
        const { message, player } = state;
        const offsetHours = player.timezoneOffset;
        const domain = app.emailDomain;

        const messageData = groupData.messages[message.name];
        const children = messageData.children;
        const sentMs = message.sentTimestampMs;

        const indices = children.map((child, index) => index);
        const unsent = indices.filter(index => !message.childrenSent[index]);
        const expired = unsent.filter(index =>
                isExpiredThreadDelay(children[index], offsetHours, sentMs, currentMs)
        );

        return expired.map(index =>
                (state: Promises.UpdateInfo) =>
                        Promises.child(
                                state,
                                index,
                                domain,
                                groupData,
                                promises)
        );
}

function pendingResponse (
        app: State.State,
        groupData: State.GameData,
        state: Promises.UpdateInfo,
        currentMs: number,
        promises: DBTypes.PromiseFactories)
{
        const { message, player } = state;
        const offsetHours = player.timezoneOffset;
        const messageData = groupData.messages[message.name];
        const sentMs = message.sentTimestampMs;
        const fallback = hasFallback(messageData);
        const replyOptions = hasReplyOptions(messageData);

        if (!hasSentReply(message)) {
                const readyReply = replyOptions &&
                        hasExpiredReply(
                                message,
                                messageData,
                                offsetHours,
                                sentMs,
                                currentMs);
                if (replyOptions && hasExpiredReply(message, messageData, offsetHours, sentMs, currentMs)) {
                        return [pendingReply(
                                groupData,
                                state,
                                promises,
                                app.emailDomain)];
                }

                const readyFallback = !message.reply &&
                        fallback &&
                        hasExpiredFallback(
                                message,
                                messageData,
                                offsetHours,
                                sentMs,
                                currentMs);
                if (readyFallback) {
                        return [pendingFallback(
                                groupData,
                                state,
                                promises,
                                app.emailDomain)];
                }
        }

        return [];
}

function pendingReply (
        groupData: State.GameData,
        state: Promises.UpdateInfo,
        promises: DBTypes.PromiseFactories,
        emailDomain: string)
{
        const { message, player } = state;

        const messageName = message.name;
        const threadMessage = groupData.messages[messageName];
        const replyIndex = message.reply.replyIndex;

        return (state: Promises.UpdateInfo) =>
                Promises.reply(
                        state,
                        replyIndex,
                        emailDomain,
                        groupData,
                        promises);
}

function pendingFallback (
        groupData: State.GameData,
        state: Promises.UpdateInfo,
        promises: DBTypes.PromiseFactories,
        emailDomain: string)
{
        return (state: Promises.UpdateInfo) =>
                Promises.fallback(
                        state,
                        emailDomain,
                        groupData,
                        promises);
}

function hasPendingChildren (message: Message.MessageState)
{
        return Arr.some(message.childrenSent, sent => !sent);
}

function hasPendingReply (
        message: Message.MessageState,
        messageData: Message.ThreadMessage)
{
        const hasReplyOptions = messageData.replyOptions.length > 0;
        return !message.replySent && hasReplyOptions;
}

function hasExpiredReply (
        message: Message.MessageState,
        messageData: Message.ThreadMessage,
        offsetHours: number,
        sentMs: number,
        currentMs: number)
{
        const reply = message.reply;
        if (reply) {
                const replyIndex = reply.replyIndex;
                const replyDelay = MessageHelpers.getReplyDelay(
                        replyIndex, messageData);
                return isExpiredThreadDelay(
                        replyDelay, offsetHours, sentMs, currentMs);
        } else {
                return false;
        }
}

function hasPendingFallback (
        message: Message.MessageState,
        messageData: Message.ThreadMessage)
{
        return !message.replySent && messageData.fallback;
}

function hasExpiredFallback (
        message: Message.MessageState,
        messageData: Message.ThreadMessage,
        offsetHours: number,
        sentMs: number,
        currentMs: number)
{
        const fallback = messageData.fallback;
        return hasPendingFallback(message, messageData) &&
                isExpiredThreadDelay(fallback, offsetHours, sentMs, currentMs);
}

function hasSentReply (message: Message.MessageState)
{
        return (message.replySent);
}

function hasReply (message: Message.MessageState)
{
        return (message.reply);
}

function hasFallback (messageData: Message.ThreadMessage)
{
        return messageData.fallback !== null;
}

function hasReplyOptions (messageData: Message.ThreadMessage)
{
        return messageData.replyOptions.length !== 0;
}

function isExpired (
        message: Message.MessageState,
        messageData: Message.ThreadMessage)
{
        return !hasPendingChildren(message) &&
                !hasPendingReply(message, messageData) &&
                !hasPendingFallback(message, messageData);
}

export function isExpiredThreadDelay (
        threadDelay: Message.ThreadDelay,
        offsetHours: number,
        sentMs: number,
        currentMs: number)
{
        const relative = threadDelay.delay[0] === 0;

        return relative ?
                isExpiredThreadDelayRelative(threadDelay, sentMs, currentMs) :
                isExpiredThreadDelayAbsolute(
                        threadDelay, offsetHours, sentMs, currentMs);
}

export function isExpiredThreadDelayRelative (
        threadDelay: Message.ThreadDelay, sentMs: number, currentMs: number)
{
        const [days, hours, mins] = threadDelay.delay;
        const requiredMs = (mins * 60 * 1000) + (hours * 3600 * 1000);
        const delayMs = currentMs - sentMs;
        return (delayMs > requiredMs);
}

export function isExpiredThreadDelayAbsolute (
        threadDelay: Message.ThreadDelay,
        offsetHours: number,
        sentMs: number,
        currentMs: number)
{
        const [days, hours, mins] = threadDelay.delay;
        const sent = new Date(sentMs);
        const required = new Date();
        required.setUTCDate(sent.getUTCDate() + days);
        required.setUTCHours(hours);
        required.setUTCMinutes(mins);
        const requiredMs = required.getTime() - (offsetHours * 3600 * 1000);

        return (currentMs > requiredMs);
}

function getReplyDelay (
        message: Message.MessageState,
        threadMessage: Message.ThreadMessage)
{
        const replyState = message.reply;
        const replyIndex = replyState.replyIndex;
        return MessageHelpers.getReplyDelay(
                replyIndex, threadMessage);
}

export function createPlayerlessMessageData (
        groupData: State.GameData,
        email: string,
        messageName: string,
        threadStartName: string,
        inReplyToId: string,
        emailDomain: string)
{
        return MessageHelpers.createMessageData(
                messageName,
                threadStartName,
                inReplyToId,
                email,
                emailDomain,
                groupData,
                null);
}

export function createMessageData (
        groupData: State.GameData,
        player: Player.PlayerState,
        messageName: string,
        threadStartName: string,
        inReplyToId: string,
        emailDomain: string)
{
        return MessageHelpers.createMessageData(
                messageName,
                threadStartName,
                inReplyToId,
                player.email,
                emailDomain,
                groupData,
                player.vars);
}
