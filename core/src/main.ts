import Arr = require('./utils/array');
import Clock = require('./clock');
import DBTypes = require('./dbtypes');
import Fun = require('./utils/function');
import Map = require('./utils/map');
import Message = require('./message');
import Player = require('./player');
import Prom = require('./utils/promise');
import Promises = require('./promises');
import ReplyOption = require('./replyoption');
import State = require('./state');

export function tick (
        app: State.State, clock: Clock.Clock, exclusiveStartKey: string)
{
        const maxResults = 1;
        const params = { exclusiveStartKey, maxResults };
        const promises = app.promises;

        return promises.getMessages(params).then(result => {
                const { messages, lastEvaluatedKey } = result;
                const message = messages.length ? messages[0] : null;

                return (message ?
                        promises.getPlayer(message.email).then(player =>
                                update(app, clock, message, player)
                        ) :
                        Promise.resolve(null)
                ).then(result => Promise.resolve(lastEvaluatedKey));
        });
}

export function update (
        app: State.State,
        clock: Clock.Clock,
        message: Message.MessageState,
        player: Player.PlayerState)
{
        const promises = app.promises;
        const groupData = app.data[player.version];
        const messageData = groupData.messages[message.name];
        const replyOptions = groupData.replyOptions;
        const timestampMs = Clock.gameTimeMs(clock);
        const state = { message, player, timestampMs };

        const children = pendingChildren(
                app, groupData, state, timestampMs, promises);
        const response = pendingResponse(
                app, groupData, state, timestampMs, promises);
        const sequence = children.concat(response);

        return Prom.executeSequentially(sequence, state).then(state =>
                Promises.updatePlayer(state, promises)
        ).then(state =>
                isExpired(state.message, messageData, replyOptions) ?
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
        const offsetHours = player.utcOffset;

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
        const offsetHours = player.utcOffset;
        const messageData = groupData.messages[message.name];
        const sentMs = message.sentTimestampMs;
        const hasReplyOptions = messageData.replyOptions;
        const replyOptions = groupData.replyOptions;
        const reply = message.reply;


        if (!hasReplyOptions) {
                return [];
        }

        if (reply) {
                const replyTimestampMs = reply.timestampMs;
                const replyIndex = reply.index;
                const messageReplyOptions = replyOptions[messageData.replyOptions];
                const options = messageReplyOptions[replyIndex].messageDelays;
                const sent = reply.sent;
                const indices = options.map((option, index) => index);
                const unsent = indices.filter(index =>
                        sent.indexOf(index) === -1);
                const ready = unsent.filter(index => isExpiredThreadDelay(
                        options[index], offsetHours, replyTimestampMs, currentMs));

                return ready.map(index => pendingReply(
                        groupData, state, index, promises));
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
                        return [pendingFallback(groupData, state, promises)];
                }
        }

        return [];
}

function pendingReply (
        groupData: State.GameData,
        state: Promises.UpdateInfo,
        index: number,
        promises: DBTypes.PromiseFactories)
{
        const { message, player } = state;

        const messageName = message.name;
        const threadMessage = groupData.messages[messageName];

        return (state: Promises.UpdateInfo) =>
                Promises.reply(
                        state,
                        index,
                        groupData,
                        promises);
}

function pendingFallback (
        groupData: State.GameData,
        state: Promises.UpdateInfo,
        promises: DBTypes.PromiseFactories)
{
        return (state: Promises.UpdateInfo) =>
                Promises.fallback(
                        state,
                        groupData,
                        promises);
}

function hasPendingChildren (message: Message.MessageState)
{
        return Arr.some(message.childrenSent, sent => !sent);
}

function hasUnsentReplies (
        message: Message.MessageState,
        messageData: Message.ThreadMessage,
        replyOptions: Map.Map<ReplyOption.ReplyOptions>)
{
        const options = replyOptions[messageData.replyOptions];
        const hasReplyOptions = options && options.length > 0;
        const reply = message.reply;
        const unsentReplies = !reply ||
                (reply.sent.length < options[reply.index].messageDelays.length);
        return hasReplyOptions && unsentReplies;
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
        messageData: Message.ThreadMessage,
        replyOptions: Map.Map<ReplyOption.ReplyOptions>)
{
        return !hasPendingChildren(message) &&
                !hasUnsentFallback(message, messageData) &&
                (message.fallbackSent ||
                        !hasUnsentReplies(message, messageData, replyOptions));
}

export function isExpiredThreadDelay (
        threadDelay: Message.ReplyThreadDelay,
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
        threadDelay: Message.ReplyThreadDelay, sentMs: number, currentMs: number)
{
        const [days, hours, mins] = threadDelay.delay;
        const requiredMs = (mins * 60 * 1000) + (hours * 3600 * 1000);
        const delayMs = currentMs - sentMs;
        return (delayMs > requiredMs);
}

export function isExpiredThreadDelayAbsolute (
        threadDelay: Message.ReplyThreadDelay,
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
        inReplyToId: string)
{
        const quotedReply = '';
        return Message.createMessageData(
                messageName,
                threadStartName,
                inReplyToId,
                quotedReply,
                email,
                groupData,
                null);
}

export function createMessageData (
        groupData: State.GameData,
        player: Player.PlayerState,
        messageName: string,
        threadStartName: string,
        inReplyToId: string,
        quotedReply: string)
{
        return Message.createMessageData(
                messageName,
                threadStartName,
                inReplyToId,
                quotedReply,
                player.email,
                groupData,
                player.vars);
}
