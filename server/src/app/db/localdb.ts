import Arr = require('../../../../game/utils/array');
import Config = require('../config');
import DBTypes = require('../../../../game/dbtypes');
import Map = require('../../../../game/utils/map');
import Message = require('../../../../game/message');
import MessageHelpers = require('../../../../game/messagehelpers');
import Player = require('../../../../game/player');
import Request = require('../../../../game/requesttypes');

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

export function createLocalDBCalls (config: Config.ConfigState): DBTypes.DBCalls
{
        var db = createDB();

        var createPlayerTable = function (
                        params: Request.CreateTableParams,
                        callback: Request.CreateTableCallback)
                {
                        createPlayerTableLocal(db, config, params, callback);
                };

        var createMessageTable = function (
                        params: Request.CreateTableParams,
                        callback: Request.CreateTableCallback)
                {
                        createMessageTableLocal(db, config, params, callback);
                };

        var deleteTable = function (
                        params: Request.DeleteTableParams,
                        callback: Request.DeleteTableCallback)
                {
                        if (params.tableName === 'messages') {
                                deleteMessageTableLocal(
                                        db, config, params, callback);
                        } else {
                                deletePlayerTableLocal(
                                        db, config, params, callback);
                        }
                };

        var addPlayer = function (
                        params: Request.AddPlayerParams,
                        callback: Request.AddPlayerCallback)
                {
                        addPlayerLocal(db, config, params, callback);
                };

        var updatePlayer = function (
                        params: Request.UpdatePlayerParams,
                        callback: Request.UpdatePlayerCallback)
                {
                        updatePlayerLocal(db, config, params, callback);
                };

        var removePlayer = function (
                        params: Request.RemovePlayerParams,
                        callback: Request.RemovePlayerCallback)
                {
                        removePlayerLocal(db, config, params, callback);
                };

        var deleteAllMessages = function (
                        params: Request.DeleteAllMessagesParams,
                        callback: Request.DeleteAllMessagesCallback)
                {
                        deleteAllMessagesLocal(db, config, params, callback);
                };

        var getMessageUID = function (
                        params: Request.GetMessageUIDParams,
                        callback: Request.GetMessageUIDCallback)
                {
                        getMessageUIDLocal(db, config, params, callback);

                };

        var storeMessage = function (
                        params: Request.StoreMessageParams,
                        callback: Request.StoreMessageCallback)
                {
                        storeMessageLocal(db, config, params, callback);
                };

        var updateMessage = function (
                        params: Request.UpdateMessageParams,
                        callback: Request.UpdateMessageCallback)
                {
                        updateMessageLocal(db, config, params, callback);
                };

        var deleteMessage = function (
                        params: Request.DeleteMessageParams,
                        callback: Request.DeleteMessageCallback)
                {
                        deleteMessageLocal(db, config, params, callback);
                };

        var getMessage = function (
                        params: Request.GetMessageParams,
                        callback: Request.GetMessageCallback)
                {
                        getMessageLocal(db, config, params, callback);
                };

        var getMessages = function (
                        params: Request.GetMessagesParams,
                        callback: Request.GetMessagesCallback)
                {
                        getMessagesLocal(db, config, params, callback);
                };

        var storeReply = function (
                        params: Request.StoreReplyParams,
                        callback: Request.StoreReplyCallback)
                {
                        storeReplyLocal(db, config, params, callback);
                };

        var storePublicKey = function (
                        params: Request.StorePublicKeyParams,
                        callback: Request.StorePublicKeyCallback)
                {
                        storePublicKeyLocal(db, config, params, callback);
                };

        var getPublicKey = function (
                        params: Request.GetPublicKeyParams,
                        callback: Request.GetPublicKeyCallback)
                {
                        getPublicKeyLocal(db, config, params, callback);
                };

        var storeEmptyMessageId = function (
                        params: Request.StoreEmptyMessageIdParams,
                        callback: Request.StoreEmptyMessageIdCallback)
                {
                        storeEmptyMessageIdLocal(db, config, params, callback);
                };

        var getEmptyMessageId = function (
                        params: Request.GetEmptyMessageIdParams,
                        callback: Request.GetEmptyMessageIdCallback)
                {
                        getEmptyMessageIdLocal(db, config, params, callback);
                };

        var deleteEmptyMessageId = function (
                        params: Request.DeleteEmptyMessageIdParams,
                        callback: Request.DeleteEmptyMessageIdCallback)
                {
                        deleteEmptyMessageIdLocal(db, config, params, callback);
                };

        var getPlayerState = function (
                        params: Request.GetPlayerStateParams,
                        callback: Request.GetPlayerStateCallback)
                {
                        getPlayerStateLocal(db, config, params, callback);
                };

        var markChildSent = function (
                        params: Request.MarkChildSentParams,
                        callback: Request.MarkChildSentCallback)
                {
                        markChildSentLocal(db, config, params, callback);
                };

        var markReplySent = function (
                        params: Request.MarkReplySentParams,
                        callback: Request.MarkReplySentCallback)
                {
                        markReplySentLocal(db, config, params, callback);
                };

        return {
                createPlayerTable: createPlayerTable,
                createMessageTable: createMessageTable,
                deleteTable: deleteTable,
                addPlayer: addPlayer,
                updatePlayer: updatePlayer,
                removePlayer: removePlayer,
                deleteAllMessages: deleteAllMessages,
                getMessageUID: getMessageUID,
                storeMessage: storeMessage,
                updateMessage: updateMessage,
                deleteMessage: deleteMessage,
                getMessage: getMessage,
                getMessages: getMessages,
                storeReply: storeReply,
                storePublicKey: storePublicKey,
                getPublicKey: getPublicKey,
                storeEmptyMessageId: storeEmptyMessageId,
                getEmptyMessageId: getEmptyMessageId,
                deleteEmptyMessageId: deleteEmptyMessageId,
                getPlayerState: getPlayerState,
                markChildSent: markChildSent,
                markReplySent: markReplySent,
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

export function getMessageUIDLocal (
        db: DBState,
        config: Config.ConfigState,
        params: Request.GetMessageUIDParams,
        callback: Request.GetMessageUIDCallback)
{
        var error: Request.Error = undefined;

        var email = params.email;

        var player = db.players[email];
        var uid = player.messageUID;
        player.messageUID += 1;

        var formattedId = MessageHelpers.createMessageId(email, uid);

        setTimeout(function () { callback(error, formattedId) },
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

export function storeReplyLocal (
        db: DBState,
        config: Config.ConfigState,
        params: Request.StoreReplyParams,
        callback: Request.StoreReplyCallback)
{
        var error: Request.Error = undefined;

        var messageId = params.messageId;
        var reply = params.reply;

        var messageState = db.messages[messageId];

        if (messageState !== undefined) {
                messageState.reply = reply;
        } else {
                error = {
                        code: 'STORE REPLY',
                        message: 'could not store reply',
                };
        }

        setTimeout(function () { callback(error, messageState) },
                config.debugDBTimeoutMs);
}

export function storePublicKeyLocal (
        db: DBState,
        config: Config.ConfigState,
        params: Request.StorePublicKeyParams,
        callback: Request.StorePublicKeyCallback)
{
        var error: Request.Error = undefined;

        var email = params.email;
        var publicKey = params.publicKey;

        var player = db.players[email];
        player.publicKey = publicKey;

        setTimeout(function () { callback(error, null) },
                config.debugDBTimeoutMs);
}

export function getPublicKeyLocal (
        db: DBState,
        config: Config.ConfigState,
        params: Request.GetPublicKeyParams,
        callback: Request.GetPublicKeyCallback)
{
        var error: Request.Error = undefined;

        var email = params.email;

        var player = db.players[email];
        var publicKey = player.publicKey;

        var data = {
                email: email,
                publicKey: publicKey,
        };

        setTimeout(function () { callback(error, data) },
                config.debugDBTimeoutMs);
}

export function storeEmptyMessageIdLocal (
        db: DBState,
        config: Config.ConfigState,
        params: Request.StoreEmptyMessageIdParams,
        callback: Request.StoreEmptyMessageIdCallback)
{
        var error: Request.Error = undefined;

        var email = params.email;
        var messageId = params.messageId;
        var profileName = params.profileName;

        var player = db.players[email];
        player.emptyMessages[profileName] = messageId;

        setTimeout(function () { callback(error, player) },
                config.debugDBTimeoutMs);
}

export function getEmptyMessageIdLocal (
        db: DBState,
        config: Config.ConfigState,
        params: Request.GetEmptyMessageIdParams,
        callback: Request.GetEmptyMessageIdCallback)
{
        var error: Request.Error = undefined;

        var email = params.email;
        var profileName = params.profileName;

        var player = db.players[email];
        var messageId = player.emptyMessages[profileName] || null;

        var data = {
                email: email,
                messageId: messageId,
        };

        setTimeout(function () { callback(error, data) },
                config.debugDBTimeoutMs);
}

export function deleteEmptyMessageIdLocal (
        db: DBState,
        config: Config.ConfigState,
        params: Request.DeleteEmptyMessageIdParams,
        callback: Request.DeleteEmptyMessageIdCallback)
{
        var error: Request.Error = undefined;

        var email = params.email;
        var profileName = params.profileName;

        var player = db.players[email];
        delete player.emptyMessages[profileName];

        setTimeout(function () { callback(error, player) },
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

export function markChildSentLocal (
        db: DBState,
        config: Config.ConfigState,
        params: Request.MarkChildSentParams,
        callback: Request.MarkChildSentCallback)
{
        var error: Request.Error = undefined;

        var messageId = params.messageId;
        var childIndex = params.childIndex;

        var messageState = db.messages[messageId];

        if (messageState && messageState.childrenSent[childIndex] !== undefined) {
                messageState.childrenSent[childIndex] = true;
        } else {
                error = {
                        code: 'MARK CHILD SENT',
                        message: 'could not mark child sent',
                };
        };

        setTimeout(function () { callback(error, messageState) },
                config.debugDBTimeoutMs);
}

export function markReplySentLocal (
        db: DBState,
        config: Config.ConfigState,
        params: Request.MarkReplySentParams,
        callback: Request.MarkReplySentCallback)
{
        var error: Request.Error = undefined;

        var messageId = params.messageId;
        var messageState = db.messages[messageId];

        if (messageState) {
                messageState.replySent = true;
        } else {
                error = {
                        code: 'MARK REPLY SENT',
                        message: 'could not mark reply sent',
                };
        };

        setTimeout(function () { callback(error, messageState) },
                config.debugDBTimeoutMs);
}
