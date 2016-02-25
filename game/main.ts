/// <reference path="global.d.ts"/>

import Message = require('./message');
import Player = require('./player');
import Request = require('./requesttypes');
import State = require('./state');

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
        const children = pendingChildren();
        const response = hasReply() ?
                reply() :
                (hasFallback() ? fallback() : []);
        const promiseFactories = children.concat(response);

        const state = { message, player };

        executeSequentially(promiseFactories, state).then(state =>
                isExpired(state.message) ? expired() : update()
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

function hasReply ()
{
        return true;
}

function hasFallback ()
{
        return true;
}

function isExpired (message: Message.MessageState)
{
        return false;
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
