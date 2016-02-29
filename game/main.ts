/// <reference path="global.d.ts"/>

import Arr = require('./utils/array');
import Fun = require('./utils/function');
import Message = require('./message');
import MessageHelpers = require('./messagehelpers');
import Player = require('./player');
import Promises = require('./promises');
import Request = require('./requesttypes');
import State = require('./state');

interface UpdateInfo {
        message: Message.MessageState;
        player: Player.PlayerState;
}

type PromiseFactoryList = Promises.PromiseFactory<UpdateInfo, UpdateInfo>[];

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

        const children = hasPendingChildren(message) ?
                pendingChildren(app, groupData, state, timestampMs, requests) :
                [];
        const response = hasSentReply(message) ?
                        <PromiseFactoryList>[] :
                        hasReply(message) ?
                                [pendingReply(
                                        app,
                                        groupData,
                                        state,
                                        timestampMs,
                                        requests)] :
                                (hasFallback(messageData) ?
                                        [pendingFallback(
                                                app,
                                                groupData,
                                                state,
                                                timestampMs,
                                                requests)] :
                                        <PromiseFactoryList>[]);
        const promiseFactories = children.concat(response);

        executeSequentially(promiseFactories, state).then(state =>
                isExpired(state.message, messageData) ?
                        expired(groupData, state, requests) :
                        update(state, requests)
        ).then(state =>
                callback(null)
        ).catch(error => callback(error));
}

export function isExpiredThreadDelay (
        threadDelay: Message.ThreadDelay, delayMs: number): boolean
{
        var requiredDelayMs = (threadDelay.delayMins * 1000 * 60);
        return (delayMs > requiredDelayMs);
}

function pendingChildren (
        app: State.State,
        groupData: State.GameData,
        state: UpdateInfo,
        timestampMs: number,
        promises: Promises.PromiseFactories)
{
        const message = state.message;
        const player = state.player;

        const messageName = message.name;
        const messageData = groupData.threadData[messageName];
        const children = messageData.children;

        const timeDelayMs = getTimeDelayMs(timestampMs, app.timeFactor, message);

        const indices = children.map((child, index) => index);
        const unsent = indices.filter(index => message.childrenSent[index]);
        const expired = unsent.filter(index =>
                isExpiredThreadDelay(children[index], timeDelayMs)
        );
        const childrenData = expired.map(index =>
                MessageHelpers.createMessageData(
                        groupData.threadData,
                        message.name,
                        message.threadStartName,
                        player.email,
                        app.emailDomain,
                        groupData.profiles,
                        groupData.strings,
                        player.vars)
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
                const from = groupData.keyManagers[data.from];
                const to = groupData.keyManagers[state.player.email];

                return promises.encrypt(from, to, data.body)
                .then(body => {
                        data.body = body;
                        return promises.send(data);
                })
                .then(messageId => {
                        const messageState = createMessageState(
                                groupData,
                                state.player.email,
                                messageId,
                                name,
                                state.message.threadStartName);
                        return promises.addMessage(messageState);
                })
                .then(message => {
                        state.message.childrenSent[childIndex] = true;
                        return state;
                })
        };
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

function pendingReply (
        app: State.State,
        groupData: State.GameData,
        state: UpdateInfo,
        timestampMs: number,
        promises: Promises.PromiseFactories)
{
        const message = state.message;
        const player = state.player;

        const messageName = message.name;
        const threadMessage = groupData.threadData[messageName];

        const playerEmail = player.email;
        const parentId = message.messageId;
        const replyState = message.reply;

        const timeDelayMs = getTimeDelayMs(timestampMs, app.timeFactor, message);

        const threadStartName = message.threadStartName;

        const replyIndex = replyState.replyIndex;
        const replyDelay = MessageHelpers.getReplyDelay(
                replyIndex, threadMessage);

        const replyData = MessageHelpers.createMessageData(
                groupData.threadData,
                replyDelay.name,
                message.threadStartName,
                player.email,
                app.emailDomain,
                groupData.profiles,
                groupData.strings,
                player.vars)

        return reply(groupData, replyData, promises);
}

function reply (
        groupData: State.GameData,
        data: Message.MessageData,
        promises: Promises.PromiseFactories)
{
        return (state: UpdateInfo) => {
                const from = groupData.keyManagers[data.from];
                const to = groupData.keyManagers[state.player.email];

                return promises.encrypt(from, to, data.body)
                .then(body => {
                        data.body = body;
                        return promises.send(data);
                })
                .then(messageId => {
                        const messageState = createMessageState(
                                groupData,
                                state.player.email,
                                messageId,
                                name,
                                state.message.threadStartName);
                        return promises.addMessage(messageState);
                })
                .then(message => {
                        state.message.replySent = true;
                        return state;
                })
        };
}

function pendingFallback (
        app: State.State,
        groupData: State.GameData,
        state: UpdateInfo,
        timestampMs: number,
        promises: Promises.PromiseFactories)
{
        const message = state.message;
        const player = state.player;

        const messageName = message.name;
        const threadMessage = groupData.threadData[messageName];

        const playerEmail = player.email;
        const parentId = message.messageId;
        const replyState = message.reply;

        const timeDelayMs = getTimeDelayMs(timestampMs, app.timeFactor, message);

        const threadStartName = message.threadStartName;
        const fallbackDelay = threadMessage.fallback;

        const fallbackData = MessageHelpers.createMessageData(
                groupData.threadData,
                fallbackDelay.name,
                message.threadStartName,
                player.email,
                app.emailDomain,
                groupData.profiles,
                groupData.strings,
                player.vars)

        return reply(groupData, fallbackData, promises);
}

function expired (
        groupData: State.GameData,
        state: UpdateInfo,
        promises: Promises.PromiseFactories)
{
        const { message, player } = state;
        const email = player.email;
        const messageName = message.name;
        const messageData = groupData.threadData[messageName];

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

function executeSequentially<T> (
        promiseFactories: ((data: T) => Promise<T>)[],
        value: T)
{
        let result = Promise.resolve<T>(value);
        promiseFactories.forEach(factory => {
                result = result.then(factory);
        });
        return result;
}

function promiseFactory<T> ()
{
        return (data: T) => new Promise<T>((resolve, reject) => resolve(data));
}

function getTimeDelayMs (
        timestampMs: number,
        timeFactor: number,
        message: Message.MessageState)
{
        const sentTimestampMs = message.sentTimestampMs;
        return ((timestampMs - sentTimestampMs) * timeFactor);
}
