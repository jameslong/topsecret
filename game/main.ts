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

interface UpdateInfo {
        message: Message.MessageState;
        player: Player.PlayerState;
}

type PromiseFactoryList = Prom.Factory<UpdateInfo, UpdateInfo>[];

export function updateMessage (
        app: State.State,
        timestampMs: number,
        message: Message.MessageState,
        player: Player.PlayerState,
        callback: (error: Request.Error) => void)
{
        const requests = Promises.createPromiseFactories(app.send, app.db);

        const groupName = MessageHelpers.getMessageGroup(message);
        const groupData = app.data[groupName];
        const threadData = groupData.threadData;
        const messageData = threadData[message.name];

        const state = { message, player };

        const children = pendingChildren(
                app, groupData, state, timestampMs, requests);
        const response = pendingResponse(
                app, groupData, state, timestampMs, requests);
        const promiseFactories = children.concat(response);

        Prom.executeSequentially(promiseFactories, state).then(state =>
                isExpired(state.message, messageData) ?
                        expired(groupData, state, requests) :
                        update(state, requests)
        ).then(state => callback(null)
        ).catch(error => callback(error));
}

function pendingChildren (
        app: State.State,
        groupData: State.GameData,
        state: UpdateInfo,
        timestampMs: number,
        promises: Promises.PromiseFactories)
{
        const { message, player } = state;

        const messageData = groupData.threadData[message.name];
        const children = messageData.children;

        const timeDelayMs = getTimeDelayMs(timestampMs, app.timeFactor, message);

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
                pendingChild(groupData, data, expired[index], promises)
        );
}

function pendingChild (
        groupData: State.GameData,
        data: Message.MessageData,
        childIndex: number,
        promises: Promises.PromiseFactories)
{
        return (state: UpdateInfo) => {
                return (encryptSendStoreChild(groupData, data, state, promises)
                ).then(state => {
                        state.message.childrenSent[childIndex] = true;
                        return state;
                })
        };
}

function pendingResponse (
        app: State.State,
        groupData: State.GameData,
        state: UpdateInfo,
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

function encryptSendStoreChild (
        groupData: State.GameData,
        data: Message.MessageData,
        state: UpdateInfo,
        promises: Promises.PromiseFactories)
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

function pendingReply (
        groupData: State.GameData,
        state: UpdateInfo,
        promises: Promises.PromiseFactories,
        emailDomain: string)
{
        const { message, player } = state;

        const messageName = message.name;
        const threadMessage = groupData.threadData[messageName];

        const replyState = message.reply;
        const replyIndex = replyState.replyIndex;
        const replyDelay = MessageHelpers.getReplyDelay(
                replyIndex, threadMessage);

        const replyData = createMessageData(
                groupData,
                player,
                replyDelay.name,
                message.threadStartName,
                emailDomain);

        return reply(groupData, replyData, promises);
}

function reply (
        groupData: State.GameData,
        data: Message.MessageData,
        promises: Promises.PromiseFactories)
{
        return (state: UpdateInfo) => {
                return (encryptSendStoreChild(groupData, data, state, promises)
                ).then(state => {
                        state.message.replySent = true;
                        return state;
                })
        };
}

function pendingFallback (
        groupData: State.GameData,
        state: UpdateInfo,
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

        return reply(groupData, fallbackData, promises);
}

function expired (
        groupData: State.GameData,
        state: UpdateInfo,
        promises: Promises.PromiseFactories)
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

function update (state: UpdateInfo, promises: Promises.PromiseFactories)
{
        return (state: UpdateInfo) => {
                return promises.updateMessage(state.message);
        };
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
