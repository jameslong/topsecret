/// <reference path="global.d.ts"/>

import Arr = require('./utils/array');
import Fun = require('./utils/function');
import Message = require('./message');
import MessageHelpers = require('./messagehelpers');
import Player = require('./player');
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
        const groupName = MessageHelpers.getMessageGroup(message);
        const groupData = Updater.getGroupData(app, groupName);
        const threadData = groupData.threadData;
        const messageData = threadData[message.name];

        const children = pendingChildren();
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
        return [promiseFactory<UpdateInfo>()];
}

function reply ()
{
        return [promiseFactory<UpdateInfo>()];
}

function fallback ()
{
        return [promiseFactory<UpdateInfo>()];
}

function expired ()
{
        return [promiseFactory<UpdateInfo>()];
}

function update ()
{
        return [promiseFactory<UpdateInfo>()];
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
        const childrenSent = Arr.arrayEvery(message.childrenSent, Fun.identity);
        const replySent = (message.replySent || !messageData.fallback);

        return (childrenSent && replySent);
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
