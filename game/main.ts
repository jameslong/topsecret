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

        const children = hasPendingChildren(message) ?
                pendingChildren() :
                [];
        const response = hasSentReply(message) ?
                        [] :
                        hasReply(message) ?
                                reply() :
                                (hasFallback(messageData) ? fallback() : []);
        const promiseFactories = children.concat(response);

        const state = { message, player };

        executeSequentially(promiseFactories, state).then(state =>
                isExpired(state.message, messageData) ? expired() : update()
        ).then(state =>
                callback(null)
        ).catch(error => callback(error));
}

function pendingChildren ()
{
        return [promiseFactory<Promises.UpdateInfo>()];
}

function pendingChild ()
{
        return promiseFactory<Promises.UpdateInfo>();
}

function reply ()
{
        return [promiseFactory<Promises.UpdateInfo>()];
}

function fallback ()
{
        return [promiseFactory<Promises.UpdateInfo>()];
}

function expired ()
{
        return [promiseFactory<Promises.UpdateInfo>()];
}

function update ()
{
        return [promiseFactory<Promises.UpdateInfo>()];
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
