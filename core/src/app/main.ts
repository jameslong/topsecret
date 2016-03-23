/// <reference path="global.d.ts"/>

import Arr = require('./utils/array');
import DBTypes = require('./dbtypes');
import Fun = require('./utils/function');
import Message = require('./message');
import MessageHelpers = require('./messagehelpers');
import Player = require('./player');
import Prom = require('./utils/promise');
import Promises = require('./promises');
import Request = require('./requesttypes');
import State = require('./state');

export function tick (
        app: State.State,
        exclusiveStartKey: string,
        timestampMs: number)
{
        const maxResults = 1;
        const params = { exclusiveStartKey, maxResults };
        const promises = app.promises;

        return promises.getMessages(params).then(result => {
                const { messages, lastEvaluatedKey } = result;
                const message = messages.length ? messages[0] : null;

                return (message ?
                        promises.getPlayer(message.email).then(player =>
                                update(app, timestampMs, message, player)
                        ) :
                        Promise.resolve(null)
                ).then(result => Promise.resolve(lastEvaluatedKey));
        });
}

export function update (
        app: State.State,
        timestampMs: number,
        message: Message.MessageState,
        player: Player.PlayerState)
{
        const promises = app.promises;
        const groupData = app.data[player.version];
        const messageData = groupData.messages[message.name];
        const state = { message, player };

        const children = pendingChildren(
                app, groupData, state, timestampMs, promises);
        const response = pendingResponse(
                app, groupData, state, timestampMs, promises);
        const sequence = children.concat(response);

        return Prom.executeSequentially(sequence, state).then(state =>
                isExpired(state.message, messageData) ?
                        Promises.expired(groupData, state, promises) :
                        Promises.update(state, promises)
        );
}

function pendingChildren (
        app: State.State,
        groupData: State.GameData,
        state: Promises.UpdateInfo,
        timestampMs: number,
        promises: DBTypes.PromiseFactories)
{
        const { message, player } = state;
        const domain = app.emailDomain;

        const messageData = groupData.messages[message.name];
        const children = messageData.children;

        const timeDelayMs = getTimeDelayMs(
                timestampMs, app.timeFactor, message);

        const indices = children.map((child, index) => index);
        const unsent = indices.filter(index => message.childrenSent[index]);
        const expired = unsent.filter(index =>
                isExpiredThreadDelay(children[index], timeDelayMs)
        );

        return expired.map(index =>
                (state: Promises.UpdateInfo) =>
                        Promises.child(
                                state,
                                children[index].name,
                                expired[index],
                                domain,
                                groupData,
                                promises)
        );
}

function pendingResponse (
        app: State.State,
        groupData: State.GameData,
        state: Promises.UpdateInfo,
        timestampMs: number,
        promises: DBTypes.PromiseFactories)
{
        const message = state.message;
        const messageData = groupData.messages[message.name];
        const delayMs = getTimeDelayMs(timestampMs, app.timeFactor, message);
        const fallback = hasFallback(messageData);
        const replyOptions = hasReplyOptions(messageData);

        if (!hasSentReply(message)) {
                if (replyOptions && hasPendingReply(message, messageData, delayMs)) {
                        return [pendingReply(
                                groupData,
                                state,
                                promises,
                                app.emailDomain)];
                }

                if (fallback && hasPendingFallback(message, messageData, delayMs)) {
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
        const replyDelay = getReplyDelay(message, threadMessage);

        return (state: Promises.UpdateInfo) =>
                Promises.reply(
                        state,
                        replyDelay.name,
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
        const { message, player } = state;

        const messageName = message.name;
        const threadMessage = groupData.messages[messageName];
        const fallbackName = threadMessage.fallback.name;

        return (state: Promises.UpdateInfo) =>
                Promises.reply(
                        state,
                        fallbackName,
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
        messageData: Message.ThreadMessage,
        delayMs: number)
{
        const reply = message.reply;
        const replyIndex = reply.replyIndex;
        const replyDelay = MessageHelpers.getReplyDelay(
                replyIndex, messageData);

        return isExpiredThreadDelay(replyDelay, delayMs);
}

function hasPendingFallback (
        message: Message.MessageState,
        messageData: Message.ThreadMessage,
        delayMs: number)
{
        return isExpiredThreadDelay(messageData.fallback, delayMs);
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
                (hasSentReply(message) || !hasFallback(messageData));
}

function getTimeDelayMs (
        timestampMs: number,
        timeFactor: number,
        message: Message.MessageState)
{
        const sentTimestampMs = message.sentTimestampMs;
        return ((timestampMs - sentTimestampMs) * timeFactor);
}

export function isExpiredThreadDelay (
        threadDelay: Message.ThreadDelay, delayMs: number): boolean
{
        const requiredDelayMs = (threadDelay.delayMins * 1000 * 60);
        return (delayMs > requiredDelayMs);
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
        emailDomain: string)
{
        return MessageHelpers.createMessageData(
                messageName,
                threadStartName,
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
        emailDomain: string)
{
        return MessageHelpers.createMessageData(
                messageName,
                threadStartName,
                player.email,
                emailDomain,
                groupData,
                player.vars);
}
