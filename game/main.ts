/// <reference path="global.d.ts"/>

import Arr = require('./utils/array');
import Fun = require('./utils/function');
import Message = require('./message');
import MessageHelpers = require('./messagehelpers');
import Player = require('./player');
import Promises = require('./promises');
import Request = require('./requesttypes');
import State = require('./state');
import Updater = require('./updater');

interface UpdateInfo {
        message: Message.MessageState;
        player: Player.PlayerState;
}

export function updateMessage (
        app: State.State,
        timestampMs: number,
        message: Message.MessageState,
        player: Player.PlayerState,
        callback: (error: Request.Error) => void)
{
        const requests = Promises.createPromiseFactories(app.send, app.db);

        const groupName = MessageHelpers.getMessageGroup(message);
        const groupData = Updater.getGroupData(app, groupName);
        const threadData = groupData.threadData;
        const messageData = threadData[message.name];

        const state = { message, player };

        const children = hasPendingChildren(message) ?
                pendingChildren(app, groupData, state, timestampMs, requests) :
                [];
        const response = hasSentReply(message) ?
                        [] :
                        hasReply(message) ?
                                reply() :
                                (hasFallback(messageData) ? fallback() : []);
        const promiseFactories = children.concat(response);


        executeSequentially(promiseFactories, state).then(state =>
                isExpired(state.message, messageData) ? expired() : update()
        ).then(state =>
                callback(null)
        ).catch(error => callback(error));
}

function pendingChildren (
        app: State.State,
        groupData: Updater.GameData,
        state: UpdateInfo,
        timestampMs: number,
        promises: Promises.PromiseFactories)
{
        const message = state.message;
        const player = state.player;

        const messageName = message.name;
        const messageData = groupData.threadData[messageName];
        const children = messageData.children;

        const timeFactor = app.timeFactor;
        const sentTimestampMs = message.sentTimestampMs;
        const timeDelayMs = ((timestampMs - sentTimestampMs) * timeFactor);

        const indices = children.map((child, index) => index);
        const unsent = indices.filter(index => message.childrenSent[index]);
        const expired = unsent.filter(index =>
                Updater.isExpiredThreadDelay(children[index], timeDelayMs)
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
        groupData: Updater.GameData,
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
        groupData: Updater.GameData,
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

function reply ()
{
        // return encrypt()
        //         .then(state => send(state, data))
        //         .then(state => addMessage(state))
        //         .then(state => markReplySent(state));
}

function fallback ()
{
        // return encrypt()
        //         .then(state => send(state, data))
        //         .then(state => addMessage(state))
        //         .then(state => markReplySent(state));
}

function expired ()
{
        // return endGame ?
        //         deleteAllMessages()
        //                 .then(state => deletePlayer(state)) :
        //         deleteMessage();
}

function update ()
{
        // return updateMessage();
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
