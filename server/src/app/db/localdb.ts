import Arr = require('../../../../core/src/app/utils/array');
import Config = require('../config');
import DBTypes = require('../../../../core/src/app/dbtypes');
import Helpers = require('../../../../core/src/app/utils/helpers');
import Map = require('../../../../core/src/app/utils/map');
import Message = require('../../../../core/src/app/message');
import MessageHelpers = require('../../../../core/src/app/messagehelpers');
import Player = require('../../../../core/src/app/player');
import Request = require('../../../../core/src/app/requesttypes');

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
        promise: (
                db: DBState,
                config: Config.ConfigState,
                params: T) => Promise<U>)
{
        return (params: T) => promise(db, config, params);
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
        const deletePlayer = promiseFactory(db, config, deletePlayerLocal);
        const deleteAllMessages = promiseFactory(
                db, config, deleteAllMessagesLocal);
        const addMessage = promiseFactory(db, config, addMessageLocal);
        const updateMessage = promiseFactory(db, config, updateMessageLocal);
        const deleteMessage = promiseFactory(db, config, deleteMessageLocal);
        const getMessage = promiseFactory(db, config, getMessageLocal);
        const getMessages = promiseFactory(db, config, getMessagesLocal);
        const getPlayer = promiseFactory(db, config, getPlayerLocal);

        return {
                createPlayerTable,
                createMessageTable,
                deleteTable,
                addPlayer,
                updatePlayer,
                deletePlayer,
                deleteAllMessages,
                addMessage,
                updateMessage,
                deleteMessage,
                getMessage,
                getMessages,
                getPlayer,
        };
}

function returnPromise<T> (
        config: Config.ConfigState,
        err: Request.Error,
        result: T)
{
        return new Promise<T>((resolve, reject) => {
                setTimeout(() => err ? reject(err) : resolve(result),
                        config.debugDBTimeoutMs);
        });
}

export function createPlayerTableLocal (
        db: DBState,
        config: Config.ConfigState,
        params: DBTypes.CreateTableParams)
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

        return returnPromise(config, error, params);
}

export function deleteTableLocal (
        db: DBState,
        config: Config.ConfigState,
        tableName: DBTypes.CreateTableParams)
{
        return tableName === 'messages' ?
                deleteMessageTableLocal(db, config, tableName) :
                deletePlayerTableLocal(db, config, tableName);
}

export function deletePlayerTableLocal (
        db: DBState,
        config: Config.ConfigState,
        params: DBTypes.CreateTableParams)
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

        return returnPromise(config, error, params);
}

export function createMessageTableLocal (
        db: DBState,
        config: Config.ConfigState,
        params: DBTypes.CreateTableParams)
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

        return returnPromise(config, error, params);
}

export function deleteMessageTableLocal (
        db: DBState,
        config: Config.ConfigState,
        params: DBTypes.CreateTableParams)
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

        return returnPromise(config, error, params);
}

export function addPlayerLocal (
        db: DBState,
        config: Config.ConfigState,
        playerState: DBTypes.AddPlayerParams)
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

        return returnPromise(config, error, playerState);
}

export function updatePlayerLocal (
        db: DBState,
        config: Config.ConfigState,
        playerState: DBTypes.UpdatePlayerParams)
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

        return returnPromise(config, error, playerState);
}

export function deletePlayerLocal (
        db: DBState,
        config: Config.ConfigState,
        email: DBTypes.DeletePlayerParams)
{
        var error: Request.Error = undefined;

        var playerExists = (db.players[email] !== undefined);
        const player = playerExists ? db.players[email] : null;

        if (playerExists) {
                delete db.players[email];
        } else {
                error = {
                        code: 'REMOVE PLAYER',
                        message: 'could not remove player',
                };
        }

        return returnPromise(config, error, player);
}

export function deleteAllMessagesLocal (
        db: DBState,
        config: Config.ConfigState,
        email: DBTypes.DeleteAllMessagesParams)
{
        var error: Request.Error = undefined;

        db.messages = Map.filter(db.messages, function (messageState)
                {
                        return messageState.email !== email;
                });

        return returnPromise(config, error, email);
}

export function addMessageLocal (
        db: DBState,
        config: Config.ConfigState,
        messageState: DBTypes.AddMessageParams)
{
        var error: Request.Error = undefined;

        var messageId = messageState.messageId;

        db.messages[messageId] = messageState;

        return returnPromise(config, error, messageState);
}

export function updateMessageLocal (
        db: DBState,
        config: Config.ConfigState,
        messageState: DBTypes.UpdateMessageParams)
{
        var error: Request.Error = undefined;

        var messageId = messageState.messageId;

        db.messages[messageId] = messageState;

        return returnPromise(config, error, messageState);
}

export function deleteMessageLocal (
        db: DBState,
        config: Config.ConfigState,
        messageId: DBTypes.DeleteMessageParams)
{
        var error: Request.Error = undefined;

        var messageState = db.messages[messageId];
        delete db.messages[messageId];

        return returnPromise(config, error, messageState);
}

export function getMessageLocal (
        db: DBState,
        config: Config.ConfigState,
        messageId: DBTypes.GetMessageParams)
{
        var error: Request.Error = undefined;

        var messageState = (db.messages[messageId] || null);

        return returnPromise(config, error, messageState);
}

export function getMessagesLocal (
        db: DBState,
        config: Config.ConfigState,
        params: DBTypes.GetMessagesParams)
{
        var error: Request.Error = undefined;

        var messageStates = <Message.MessageState[]>Helpers.arrayFromMap(
                db.messages);
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

        return returnPromise(config, error, result);
}

export function getPlayerLocal (
        db: DBState,
        config: Config.ConfigState,
        email: DBTypes.GetPlayerParams)
{
        var error: Request.Error = undefined;

        var data = db.players[email];

        return returnPromise(config, error, data);
}
