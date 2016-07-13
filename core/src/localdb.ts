import Arr = require('./utils/array');
import DBTypes = require('./dbtypes');
import Helpers = require('./utils/helpers');
import Map = require('./utils/map');
import MathUtils = require('./utils/math');
import Message = require('./message');
import MessageHelpers = require('./messagehelpers');
import Player = require('./player');
import Prom = require('./utils/promise');
import Request = require('./requesttypes');

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


export function createLocalDBCalls (db: DBState, timeoutMs: number)
        : DBTypes.DBCalls
{
        const factory = <T, U>(promise: DBPromise<T, U>) =>
                delayFactory<T, U>(db, timeoutMs, promise);

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
        player: DBTypes.UpdatePlayerParams)
{
        var error: Request.Error = undefined;

        var email = player.email;
        var inUse = (db.players[email] !== undefined);

        if (inUse) {
                db.players[email] = player;
        } else {
                error = {
                        code: 'UPDATE PLAYER',
                        message: 'could not find player',
                };
        }

        return returnPromise(error, player);
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
        const exclusiveStartKey = params.exclusiveStartKey;
        const maxResults = params.maxResults;
        const keys = Object.keys(db.messages);

        let lastEvaluatedKey: string = null;
        let messages: Message.MessageState[] = [];

        const exclusiveStartIndex = keys.indexOf(exclusiveStartKey);
        const hasInclusiveStartKey =
                exclusiveStartKey === null ||
                exclusiveStartIndex !== -1;

        if (keys.length && hasInclusiveStartKey) {
                const startIndex = exclusiveStartKey === null ?
                        0 : exclusiveStartIndex + 1;
                const desiredEndIndex = startIndex + maxResults;
                const endIndex = Math.min(startIndex + maxResults, keys.length);

                const selectedKeys = keys.slice(startIndex, endIndex);
                messages = selectedKeys.map(key => db.messages[key]);

                const lastSelectedKey = selectedKeys.length ?
                        selectedKeys[selectedKeys.length - 1] : null;
                lastEvaluatedKey = desiredEndIndex > endIndex ?
                        null : lastSelectedKey;
        }

        return returnPromise(null, { lastEvaluatedKey, messages });
}

export function getPlayerLocal (
        db: DBState,
        email: DBTypes.GetPlayerParams)
{
        var data = db.players[email] || null;
        return returnPromise(null, data);
}
