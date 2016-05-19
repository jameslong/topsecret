import Arr = require('./utils/array');
import Clock = require('./clock');
import DBTypes = require('./dbtypes');
import Fun = require('./utils/function');
import Map = require('./utils/map');
import Message = require('./message');
import MessageHelpers = require('./messagehelpers');
import Player = require('./player');
import Prom = require('./utils/promise');
import Promises = require('./promises');
import ReplyOption = require('./replyoption');
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
        const hasReplyOptions = messageData.replyOptions.length > 0;
        const replyOptions = groupData.replyOptions;
        const reply = message.reply;

        if (!hasReplyOptions) {
                return [];
        }

        if (reply) {
                const indices = reply.indices;
                const sent = reply.sent;
                const unsent = indices.filter(
                        index => sent.indexOf(index) === -1);
                const ready = unsent.filter(index => hasExpiredReply(
                        messageData,
                        replyOptions,
                        index,
                        offsetHours,
                        sentMs,
                        currentMs)
                );

                return ready.map(index => pendingReply(
                        groupData, state, index, promises, app.emailDomain));
        } else {
                const readyFallback =
                        messageData.fallback &&
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
        index: number,
        promises: DBTypes.PromiseFactories,
        emailDomain: string)
{
        const { message, player } = state;

        const messageName = message.name;
        const threadMessage = groupData.messages[messageName];

        return (state: Promises.UpdateInfo) =>
                Promises.reply(
                        state,
                        index,
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

function hasUnsentReplies (
        message: Message.MessageState,
        messageData: Message.ThreadMessage)
{
        const hasReplyOptions = messageData.replyOptions.length > 0;
        const reply = message.reply;
        const unsentReplies = !reply ||
                (reply.sent.length < reply.indices.length);
        return hasReplyOptions && unsentReplies;
}

function hasExpiredReply (
        messageData: Message.ThreadMessage,
        replyOptions: Map.Map<ReplyOption.ReplyOption[]>,
        index: number,
        offsetHours: number,
        sentMs: number,
        currentMs: number)
{
        const replyDelay = MessageHelpers.getReplyDelay(
                index, messageData, replyOptions);
        return isExpiredThreadDelay(
                replyDelay, offsetHours, sentMs, currentMs);
}

function hasUnsentFallback (
        message: Message.MessageState,
        messageData: Message.ThreadMessage)
{
        return messageData.fallback && !message.fallbackSent;
}

function hasExpiredFallback (
        message: Message.MessageState,
        messageData: Message.ThreadMessage,
        offsetHours: number,
        sentMs: number,
        currentMs: number)
{
        const fallback = messageData.fallback;
        return hasUnsentFallback(message, messageData) &&
                isExpiredThreadDelay(fallback, offsetHours, sentMs, currentMs);
}

function isExpired (
        message: Message.MessageState,
        messageData: Message.ThreadMessage)
{
        return !hasPendingChildren(message) &&
                !hasUnsentFallback(message, messageData) &&
                (message.fallbackSent || !hasUnsentReplies(message, messageData));
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
