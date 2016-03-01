/// <reference path="global.d.ts"/>

import Arr = require('./utils/array');
import Fun = require('./utils/function');
import Message = require('./message');
import MessageHelpers = require('./messagehelpers');
import Player = require('./player');
import Prom = require('./utils/promise');
import Promises = require('./promises');
import Request = require('./requesttypes');
import State = require('./state');

export function update (
        app: State.State,
        timestampMs: number,
        message: Message.MessageState,
        player: Player.PlayerState,
        callback: (error: Request.Error) => void)
{
        const promises = Promises.createPromiseFactories(app.send, app.db);
        const groupData = app.data[message.version];
        const messageData = groupData.threadData[message.name];
        const state = { message, player };

        const children = pendingChildren(
                app, groupData, state, timestampMs, promises);
        const response = pendingResponse(
                app, groupData, state, timestampMs, promises);
        const sequence = children.concat(response);

        Prom.executeSequentially(sequence, state).then(state =>
                isExpired(state.message, messageData) ?
                        Promises.expired(groupData, state, promises) :
                        Promises.update(state, promises)
        ).then(result => callback(null)
        ).catch(error => callback(error));
}

function pendingChildren (
        app: State.State,
        groupData: State.GameData,
        state: Promises.UpdateInfo,
        timestampMs: number,
        promises: Promises.PromiseFactories)
{
        const { message, player } = state;

        const messageData = groupData.threadData[message.name];
        const children = messageData.children;

        const timeDelayMs = getTimeDelayMs(
                timestampMs, app.timeFactor, message);

        const indices = children.map((child, index) => index);
        const unsent = indices.filter(index => message.childrenSent[index]);
        const expired = unsent.filter(index =>
                isExpiredThreadDelay(children[index], timeDelayMs)
        );
        const childrenData = expired.map(index =>
                createMessageData(
                        groupData,
                        player,
                        message.name,
                        message.threadStartName,
                        app.emailDomain)
        );
        return childrenData.map((data, index) =>
                Promises.child(groupData, data, expired[index], promises)
        );
}

function pendingResponse (
        app: State.State,
        groupData: State.GameData,
        state: Promises.UpdateInfo,
        timestampMs: number,
        promises: Promises.PromiseFactories)
{
        const message = state.message;
        const messageData = groupData.threadData[message.name];
        const delayMs = getTimeDelayMs(timestampMs, app.timeFactor, message);

        if (hasReply(message) && !hasSentReply(message)) {
                if (hasPendingReply(message, messageData, delayMs)) {
                        return [pendingReply(
                                groupData,
                                state,
                                promises,
                                app.emailDomain)];
                } else if (hasPendingFallback(message, messageData, delayMs)) {
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
        promises: Promises.PromiseFactories,
        emailDomain: string)
{
        const { message, player } = state;

        const messageName = message.name;
        const threadMessage = groupData.threadData[messageName];
        const replyDelay = getReplyDelay(message, threadMessage);

        const replyData = createMessageData(
                groupData,
                player,
                replyDelay.name,
                message.threadStartName,
                emailDomain);

        return Promises.reply(groupData, replyData, promises);
}

function pendingFallback (
        groupData: State.GameData,
        state: Promises.UpdateInfo,
        promises: Promises.PromiseFactories,
        emailDomain: string)
{
        const { message, player } = state;

        const messageName = message.name;
        const threadMessage = groupData.threadData[messageName];

        const fallbackData = createMessageData(
                groupData,
                player,
                threadMessage.fallback.name,
                message.threadStartName,
                emailDomain);

        return Promises.reply(groupData, fallbackData, promises);
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

function createMessageData (
        groupData: State.GameData,
        player: Player.PlayerState,
        messageName: string,
        threadStartName: string,
        emailDomain: string)
{
        return MessageHelpers.createMessageData(
                groupData.threadData,
                messageName,
                threadStartName,
                player.email,
                emailDomain,
                groupData.profiles,
                groupData.strings,
                player.vars)
}
