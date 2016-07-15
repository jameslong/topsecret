import Arr = require('./utils/array');
import DBTypes = require('./dbtypes');
import Helpers = require('./utils/helpers');
import Map = require('./utils/map');
import MathUtils = require('./utils/math');
import Message = require('./message');
import Player = require('./player');
import Prom = require('./utils/promise');

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

export interface Error {
        code: string;
        message: string;
}

type DBPromise<T, U> = <T, U>(db: DBState, params: T)=> Promise<U>;

function delay<T, U> (
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
                delay<T, U>(db, timeoutMs, promise);

        return {
                addPlayer: factory(addPlayer),
                updatePlayer: factory(updatePlayer),
                deletePlayer: factory(deletePlayer),
                deleteAllMessages: factory(deleteAllMessages),
                addMessage: factory(addMessage),
                updateMessage: factory(updateMessage),
                deleteMessage: factory(deleteMessage),
                getMessage: factory(getMessage),
                getMessages: factory(getMessages),
                getPlayer: factory(getPlayer),
        };
}

function promise<T> (err: Error, result: T)
{
        return new Promise<T>((resolve, reject) =>
                err ? reject(err) : resolve(result)
        );
}

export function addPlayer (
        db: DBState,
        playerState: DBTypes.AddPlayerParams)
{
        let error: Error = undefined;

        const email = playerState.email;
        const inUse = (db.players[email] !== undefined);

        if (inUse) {
                error = {
                        code: 'ADD PLAYER',
                        message: 'could not add player',
                };
        } else {
                db.players[email] = playerState;
        }

        return promise(error, playerState);
}

export function updatePlayer (
        db: DBState,
        player: DBTypes.UpdatePlayerParams)
{
        let error: Error = undefined;

        const email = player.email;
        const inUse = (db.players[email] !== undefined);

        if (inUse) {
                db.players[email] = player;
        } else {
                error = {
                        code: 'UPDATE PLAYER',
                        message: 'could not find player',
                };
        }

        return promise(error, player);
}

export function deletePlayer (
        db: DBState,
        email: DBTypes.DeletePlayerParams)
{
        let error: Error = undefined;

        const playerExists = (db.players[email] !== undefined);
        const player = playerExists ? db.players[email] : null;

        if (playerExists) {
                delete db.players[email];
        } else {
                error = {
                        code: 'REMOVE PLAYER',
                        message: 'could not remove player',
                };
        }

        return promise(error, player);
}

export function deleteAllMessages (
        db: DBState,
        email: DBTypes.DeleteAllMessagesParams)
{
        let error: Error = undefined;

        db.messages = Map.filter(db.messages, function (messageState)
                {
                        return messageState.email !== email;
                });

        return promise(error, email);
}

export function addMessage (
        db: DBState,
        messageState: DBTypes.AddMessageParams)
{
        let error: Error = undefined;

        const id = messageState.id;

        db.messages[id] = messageState;

        return promise(error, messageState);
}

export function updateMessage (
        db: DBState,
        messageState: DBTypes.UpdateMessageParams)
{
        let error: Error = undefined;

        const id = messageState.id;

        db.messages[id] = messageState;

        return promise(error, messageState);
}

export function deleteMessage (
        db: DBState,
        id: DBTypes.DeleteMessageParams)
{
        let error: Error = undefined;

        const messageState = db.messages[id];
        delete db.messages[id];

        return promise(error, messageState);
}

export function getMessage (
        db: DBState,
        id: DBTypes.GetMessageParams)
{
        let error: Error = undefined;

        const messageState = (db.messages[id] || null);

        return promise(error, messageState);
}

export function getMessages (
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

        return promise(null, { lastEvaluatedKey, messages });
}

export function getPlayer (
        db: DBState,
        email: DBTypes.GetPlayerParams)
{
        const data = db.players[email] || null;
        return promise(null, data);
}
