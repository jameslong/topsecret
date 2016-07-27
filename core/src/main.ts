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
import State = require('./gamestate');

export function tick (
        app: State.GameState, clock: Clock.Clock, exclusiveStartKey: string)
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
        app: State.GameState,
        clock: Clock.Clock,
        message: Message.MessageState,
        player: Player.PlayerState)
{
        const narrative = app.narratives[player.version];
        const timestampMs = Clock.gameTimeMs(clock);
        const promises = app.promises;
        const state = { message, player, timestampMs, promises, narrative };

        return handleChildren(state).then(handleResponse).then(updateMessage);
}

function handleChildren (state: Promises.UpdateState)
{
        const { message, player, narrative, timestampMs, promises } = state;
        const offsetHours = player.utcOffset;
        const messageData = narrative.messages[message.name];
        const children = messageData.children;
        const sentMs = message.sentTimestampMs;

        const indices = children.map((child, index) => index);
        const pending = indices.filter(index =>
                !message.childrenSent[index] &&
                isExpiredThreadDelay(children[index], offsetHours, sentMs, timestampMs));
        const pendingPromises = pending.map((child, index) =>
                (state: Promises.UpdateState) => Promises.child(state, index)
        );

        return Prom.executeSequentially(pendingPromises, state);
}

function handleResponse (state: Promises.UpdateState)
{
        const { message, narrative } = state;
        const messageData = narrative.messages[message.name];
        const hasReplyOptions = messageData.replyOptions;
        const hasReply = message.reply !== null;
        const hasFallback = messageData.fallback !== null;

        if (hasReplyOptions) {
                if (hasReply) {
                        return handleReply(state);
                } else if (hasFallback) {
                        return handleFallback(state);
                }
        }

        return Promise.resolve(state);
}

function handleReply (state: Promises.UpdateState)
{
        const { message, player, narrative, timestampMs, promises } = state;
        const utcOffset = player.utcOffset;
        const reply = message.reply;
        const replyTimestampMs = reply.timestampMs;
        const replyIndex = reply.index;
        const messageData = narrative.messages[message.name];
        const replyOptions = narrative.replyOptions[messageData.replyOptions];
        const options = replyOptions[replyIndex].messageDelays;
        const sent = reply.sent;
        const indices = options.map((option, index) => index);
        const pending = indices.filter(index =>
                sent.indexOf(index) === -1 && isExpiredThreadDelay(
                        options[index], utcOffset, replyTimestampMs, timestampMs));

        const pendingPromises = pending.map(index =>
                (state: Promises.UpdateState) => Promises.reply(state, index));

        return Prom.executeSequentially(pendingPromises, state);
}

function handleFallback (state: Promises.UpdateState)
{
        const { message, player, narrative, timestampMs, promises } = state;
        const utcOffset = player.utcOffset;
        const messageData = narrative.messages[message.name];
        const sentMs = message.sentTimestampMs;
        const expired = hasExpiredFallback(
                message, messageData, utcOffset, sentMs, timestampMs);

        return expired ?
                Promises.fallback(state) :
                Promise.resolve(state);
}

function updateMessage (state: Promises.UpdateState)
{
        const { message, player, narrative, timestampMs, promises } = state;
        const messageData = narrative.messages[message.name];
        const replyOptions = narrative.replyOptions;

        return isExpired(state.message, messageData, replyOptions) ?
                Promises.expired(state) :
                Promises.update(state);
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
        const resolvedChildren = !hasPendingChildren(message);
        const resolvedReplies = !hasUnsentReplies(
                message, messageData, replyOptions);
        const resolvedFallback = !hasUnsentFallback(message, messageData);
        const resolvedResponse = messageData.fallback ?
                resolvedReplies || resolvedFallback :
                resolvedReplies;

        return (resolvedChildren && resolvedResponse);
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
        groupData: State.NarrativeState,
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
        groupData: State.NarrativeState,
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
