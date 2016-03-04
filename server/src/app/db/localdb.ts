import Arr = require('../../../../core/src/app/utils/array');
import Config = require('../config');
import DBTypes = require('../../../../core/src/app/dbtypes');
import Helpers = require('../../../../core/src/app/utils/helpers');
import Map = require('../../../../core/src/app/utils/map');
import Message = require('../../../../core/src/app/message');
import MessageHelpers = require('../../../../core/src/app/messagehelpers');
import Player = require('../../../../core/src/app/player');
import Prom = require('../../../../core/src/app/utils/promise');
import Request = require('../../../../core/src/app/requesttypes');

/*

SCHEMA

table: players

playerId
        email
        messageUID

table: messages

id
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

type DBPromise<T, U> = <T, U>(db: DBState, params: T)=> Promise<U>;

function delayFactory<T, U> (
        db: DBState,
        timeoutMs: number,
        promise: DBPromise<T, U>): Prom.Factory<T, U>
{
        return (params: T) => Prom.delay(timeoutMs).then(result =>
                promise(db, params));
}


export function createLocalDBCalls (timeoutMs: number): DBTypes.DBCalls
{
        const db = createDB();
        const factory = <T, U>(promise: DBPromise<T, U>) =>
                delayFactory<T, U>(db, timeoutMs, promise);

        const createPlayerTable = factory(createPlayerTableLocal);
        const createMessageTable = factory( createMessageTableLocal);
        const deleteTable = factory(deleteTableLocal);
        const addPlayer = factory(addPlayerLocal);
        const updatePlayer = factory(updatePlayerLocal);
        const deletePlayer = factory(deletePlayerLocal);
        const deleteAllMessages = factory( deleteAllMessagesLocal);
        const addMessage = factory(addMessageLocal);
        const updateMessage = factory(updateMessageLocal);
        const deleteMessage = factory(deleteMessageLocal);
        const getMessage = factory(getMessageLocal);
        const getMessages = factory(getMessagesLocal);
        const getPlayer = factory(getPlayerLocal);

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

function returnPromise<T> (err: Request.Error, result: T)
{
        return new Promise<T>((resolve, reject) =>
                err ? reject(err) : resolve(result)
        );
}

export function createPlayerTableLocal (
        db: DBState,
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

        return returnPromise(error, params);
}

export function deleteTableLocal (
        db: DBState,
        tableName: DBTypes.CreateTableParams)
{
        return tableName === 'messages' ?
                deleteMessageTableLocal(db, tableName) :
                deletePlayerTableLocal(db, tableName);
}

export function deletePlayerTableLocal (
        db: DBState,
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

        return returnPromise(error, params);
}

export function createMessageTableLocal (
        db: DBState,
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

        return returnPromise(error, params);
}

export function deleteMessageTableLocal (
        db: DBState,
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

        return returnPromise(error, params);
}

export function addPlayerLocal (
        db: DBState,
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

        return returnPromise(error, playerState);
}

export function updatePlayerLocal (
        db: DBState,
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

        return returnPromise(error, playerState);
}

export function deletePlayerLocal (
        db: DBState,
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

        return returnPromise(error, player);
}

export function deleteAllMessagesLocal (
        db: DBState,
        email: DBTypes.DeleteAllMessagesParams)
{
        var error: Request.Error = undefined;

        db.messages = Map.filter(db.messages, function (messageState)
                {
                        return messageState.email !== email;
                });

        return returnPromise(error, email);
}

export function addMessageLocal (
        db: DBState,
        messageState: DBTypes.AddMessageParams)
{
        var error: Request.Error = undefined;

        var id = messageState.id;

        db.messages[id] = messageState;

        return returnPromise(error, messageState);
}

export function updateMessageLocal (
        db: DBState,
        messageState: DBTypes.UpdateMessageParams)
{
        var error: Request.Error = undefined;

        var id = messageState.id;

        db.messages[id] = messageState;

        return returnPromise(error, messageState);
}

export function deleteMessageLocal (
        db: DBState,
        id: DBTypes.DeleteMessageParams)
{
        var error: Request.Error = undefined;

        var messageState = db.messages[id];
        delete db.messages[id];

        return returnPromise(error, messageState);
}

export function getMessageLocal (
        db: DBState,
        id: DBTypes.GetMessageParams)
{
        var error: Request.Error = undefined;

        var messageState = (db.messages[id] || null);

        return returnPromise(error, messageState);
}

export function getMessagesLocal (
        db: DBState,
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
                        (messageState.id === startKey));

                if (startIndex === -1) {
                        startIndex = 0;
                }

                var endIndex = Math.min(startIndex + maxResults, length);
                resultList = messageStates.slice(startIndex, endIndex);
                lastEvaluatedKey = (endIndex === length ?
                        null :
                        messageStates[endIndex].id);
        }

        var result = {
                lastEvaluatedKey: lastEvaluatedKey,
                messages: resultList,
        };

        return returnPromise(error, result);
}

export function getPlayerLocal (
        db: DBState,
        email: DBTypes.GetPlayerParams)
{
        var error: Request.Error = undefined;

        var data = db.players[email];

        return returnPromise(error, data);
}
