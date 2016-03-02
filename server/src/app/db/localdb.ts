import Arr = require('../../../../game/src/app/utils/array');
import Config = require('../config');
import DBTypes = require('../../../../game/src/app/dbtypes');
import Map = require('../../../../game/src/app/utils/map');
import Message = require('../../../../game/src/app/message');
import MessageHelpers = require('../../../../game/src/app/messagehelpers');
import Player = require('../../../../game/src/app/player');
import Request = require('../../../../game/src/app/requesttypes');

/*

SCHEMA

table: players

playerId
        email
        messageUID

table: messages

messageId
        email: string;
        name: string;
        reply: ReplyState;
        sentTimestampMs: number;

*/

export interface DBState {
        players: Map.Map<Player.PlayerState>;
        messages: Map.Map<Message.MessageState>;
}

export function createDB (): DBState
{
        return {
                players: {},
                messages: {},
        };
}

function promiseFactory<T, U> (
        db: DBState,
        config: Config.ConfigState,
        requestFn: (
                db: DBState,
                config: Config.ConfigState,
                params: T,
                callback: Request.Callback<U>) => void)
{
        return (params: T) =>
                new Promise((resolve, reject) =>
                        requestFn(db, config, params, (err, result) =>
                                err ? reject(err) : resolve(result)));
}


export function createLocalDBCalls (config: Config.ConfigState): DBTypes.DBCalls
{
        var db = createDB();

        const createPlayerTable = promiseFactory(
                db, config, createPlayerTableLocal);
        const createMessageTable = promiseFactory(
                db, config, createMessageTableLocal);
        const deleteTable = promiseFactory(db, config, deleteTableLocal);
        const addPlayer = promiseFactory(db, config, addPlayerLocal);
        const updatePlayer = promiseFactory(db, config, updatePlayerLocal);
        const removePlayer = promiseFactory(db, config, removePlayerLocal);
        const deleteAllMessages = promiseFactory(
                db, config, deleteAllMessagesLocal);
        const storeMessage = promiseFactory(db, config, storeMessageLocal);
        const updateMessage = promiseFactory(db, config, updateMessageLocal);
        const deleteMessage = promiseFactory(db, config, deleteMessageLocal);
        const getMessage = promiseFactory(db, config, getMessageLocal);
        const getMessages = promiseFactory(db, config, getMessagesLocal);
        const getPlayerState = promiseFactory(db, config, getPlayerStateLocal);

        return {
                createPlayerTable,
                createMessageTable,
                deleteTable,
                addPlayer,
                updatePlayer,
                removePlayer,
                deleteAllMessages,
                storeMessage,
                updateMessage,
                deleteMessage,
                getMessage,
                getMessages,
                getPlayerState,
        };
}

export function createPlayerTableLocal (
        db: DBState,
        config: Config.ConfigState,
        params: Request.CreateTableParams,
        callback: Request.CreateTableCallback)
{
        var error: Request.Error = undefined;

        var hasTable = (db.players !== null);

        if (hasTable) {
                error = {
                        code: 'CREATE PLAYERS TABLE',
                        message: 'could not create players table',
                };
        } else {
                db.players = {};
        }

        setTimeout(function () { callback(error, params) },
                config.debugDBTimeoutMs);
}

export function deleteTableLocal (
        db: DBState,
        config: Config.ConfigState,
        params: Request.CreateTableParams,
        callback: Request.CreateTableCallback)
{
        params.tableName === 'messages' ?
                deleteMessageTableLocal(db, config, params, callback) :
                deletePlayerTableLocal(db, config, params, callback);
}

export function deletePlayerTableLocal (
        db: DBState,
        config: Config.ConfigState,
        params: Request.CreateTableParams,
        callback: Request.CreateTableCallback)
{
        var error: Request.Error = undefined;

        var hasTable = (db.players !== null);

        if (hasTable) {
                db.players = null;
        } else {
                error = {
                        code: 'DELETE PLAYERS TABLE',
                        message: 'could not create players table',
                };
        }

        setTimeout(function () { callback(error, params) },
                config.debugDBTimeoutMs);
}

export function createMessageTableLocal (
        db: DBState,
        config: Config.ConfigState,
        params: Request.CreateTableParams,
        callback: Request.CreateTableCallback)
{
        var error: Request.Error = undefined;

        var hasTable = (db.messages !== null);

        if (hasTable) {
                error = {
                        code: 'CREATE MESSAGE TABLE',
                        message: 'could not create message table',
                };
        } else {
                db.messages = {};
        }

        setTimeout(function () { callback(error, params) },
                config.debugDBTimeoutMs);
}

export function deleteMessageTableLocal (
        db: DBState,
        config: Config.ConfigState,
        params: Request.CreateTableParams,
        callback: Request.CreateTableCallback)
{
        var error: Request.Error = undefined;

        var hasTable = (db.messages !== null);

        if (hasTable) {
                db.messages = null;
        } else {

                error = {
                        code: 'DELETE MESSAGE TABLE',
                        message: 'could not create message table',
                };
        }

        setTimeout(function () { callback(error, params) },
                config.debugDBTimeoutMs);
}

export function addPlayerLocal (
        db: DBState,
        config: Config.ConfigState,
        playerState: Request.AddPlayerParams,
        callback: Request.AddPlayerCallback)
{
        var error: Request.Error = undefined;

        var email = playerState.email;
        var inUse = (db.players[email] !== undefined);

        if (inUse) {
                error = {
                        code: 'ADD PLAYER',
                        message: 'could not add player',
                };
        } else {
                db.players[email] = playerState;
        }

        setTimeout(function () { callback(error, playerState) },
                config.debugDBTimeoutMs);
}

export function updatePlayerLocal (
        db: DBState,
        config: Config.ConfigState,
        playerState: Request.UpdatePlayerParams,
        callback: Request.UpdatePlayerCallback)
{
        var error: Request.Error = undefined;

        var email = playerState.email;
        var inUse = (db.players[email] === undefined);

        if (!inUse) {
                error = {
                        code: 'UPDATE PLAYER',
                        message: 'could not find player',
                };
        } else {
                db.players[email] = playerState;
        }

        setTimeout(function () { callback(error, playerState) },
                config.debugDBTimeoutMs);
}

export function removePlayerLocal (
        db: DBState,
        config: Config.ConfigState,
        params: Request.RemovePlayerParams,
        callback: Request.RemovePlayerCallback)
{
        var error: Request.Error = undefined;

        var email = params.email;
        var playerExists = (db.players[email] !== undefined);

        if (playerExists) {
                delete db.players[email];
        } else {
                error = {
                        code: 'REMOVE PLAYER',
                        message: 'could not remove player',
                };
        }

        setTimeout(function () { callback(error, params) },
                config.debugDBTimeoutMs);
}

export function deleteAllMessagesLocal (
        db: DBState,
        config: Config.ConfigState,
        params: Request.DeleteAllMessagesParams,
        callback: Request.DeleteAllMessagesCallback)
{
        var error: Request.Error = undefined;

        var email = params.email;

        db.messages = Map.filter(db.messages, function (messageState)
                {
                        return messageState.email !== email;
                });

        setTimeout(function () { callback(error, params) },
                config.debugDBTimeoutMs);
}

export function storeMessageLocal (
        db: DBState,
        config: Config.ConfigState,
        messageState: Request.StoreMessageParams,
        callback: Request.StoreMessageCallback)
{
        var error: Request.Error = undefined;

        var messageId = messageState.messageId;

        db.messages[messageId] = messageState;

        setTimeout(function () { callback(error, messageState) },
                config.debugDBTimeoutMs);
}

export function updateMessageLocal (
        db: DBState,
        config: Config.ConfigState,
        messageState: Request.UpdateMessageParams,
        callback: Request.UpdateMessageCallback)
{
        var error: Request.Error = undefined;

        var messageId = messageState.messageId;

        db.messages[messageId] = messageState;

        setTimeout(function () { callback(error, messageState) },
                config.debugDBTimeoutMs);
}

export function deleteMessageLocal (
        db: DBState,
        config: Config.ConfigState,
        messageState: Request.DeleteMessageParams,
        callback: Request.DeleteMessageCallback)
{
        var messageId = messageState.messageId;

        var error: Request.Error = undefined;

        var messageState = db.messages[messageId];
        delete db.messages[messageId];

        setTimeout(function () { callback(error, messageState) },
                config.debugDBTimeoutMs);
}

export function getMessageLocal (
        db: DBState,
        config: Config.ConfigState,
        params: Request.GetMessageParams,
        callback: Request.GetMessageCallback)
{
        var error: Request.Error = undefined;

        var messageId = params.messageId;
        var messageState = (db.messages[messageId] || null);

        setTimeout(function () { callback(error, messageState) },
                config.debugDBTimeoutMs);
}

export function getMessagesLocal (
        db: DBState,
        config: Config.ConfigState,
        params: Request.GetMessagesParams,
        callback: Request.GetMessagesCallback)
{
        var error: Request.Error = undefined;

        var messageStates = Map.arrayFromMap(db.messages);
        var length = messageStates.length;

        var startKey = params.startKey;
        var maxResults = params.maxResults;

        var resultList: Message.MessageState[] = [];
        var lastEvaluatedKey: string = null;

        if (length) {
                var startIndex = Arr.find(messageStates, (messageState) =>
                        (messageState.messageId === startKey));

                if (startIndex === -1) {
                        startIndex = 0;
                }

                var endIndex = Math.min(startIndex + maxResults, length);
                resultList = messageStates.slice(startIndex, endIndex);
                lastEvaluatedKey = (endIndex === length ?
                        null :
                        messageStates[endIndex].messageId);
        }

        var result = {
                lastEvaluatedKey: lastEvaluatedKey,
                messages: resultList,
        };

        setTimeout(function () { callback(error, result) },
                config.debugDBTimeoutMs);
}

export function getPlayerStateLocal (
        db: DBState,
        config: Config.ConfigState,
        params: Request.GetPlayerStateParams,
        callback: Request.GetPlayerStateCallback)
{
        var error: Request.Error = undefined;

        var email = params.email;

        var data = db.players[email];

        setTimeout(function () { callback(error, data) },
                config.debugDBTimeoutMs);
}
