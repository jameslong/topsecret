import Log = require('./log/log');
import Message = require('./message');
import Player = require('./player');
import Request = require('./requesttypes');

export function createTable (
        tableName: string,
        requestFn: Request.CreateTableRequest,
        callback: Request.Callback<any>)
{
        var params = { tableName };
        requestFn(params, callback);
}

export function deleteTable (
        tableName: string,
        requestFn: Request.DeleteTableRequest,
        callback: Request.Callback<any>)
{
        var params = { tableName };
        requestFn(params, callback);
}

export function addPlayer (
        playerState: Player.PlayerState,
        requestFn: Request.AddPlayerRequest,
        callback: Request.AddPlayerCallback)
{
        requestFn(playerState, callback);
}

export function deletePlayer (
        email: string,
        requestFn: Request.DeletePlayerRequest,
        callback: Request.DeletePlayerCallback)
{
        var params = { email };
        requestFn(params, callback);
}

export function deleteAllMessages (
        email: string,
        requestFn: Request.DeleteAllMessagesRequest,
        callback: Request.DeleteAllMessagesCallback)
{
        var params = { email };
        requestFn(params, callback);
}

export function addMessage (
        addMessageFn: Request.AddMessageRequest,
        messageState: Message.MessageState,
        callback: Request.Callback<Message.MessageState>)
{
        addMessageFn(messageState, callback);
}

export function deleteMessage (
        deleteMessageFn: Request.DeleteMessageRequest,
        messageState: Message.MessageState,
        callback: Request.Callback<Message.MessageState>)
{
        deleteMessageFn(messageState, callback);
}

export function getMessage (
        getMessageFn: Request.GetMessageRequest,
        messageId: string,
        callback: Request.GetMessageCallback)
{
        var params = { messageId };
        getMessageFn(params, callback);
}

export function getMessages (
        startKey: string,
        maxResults: number,
        requestFn: Request.GetMessagesRequest,
        callback: Request.GetMessagesCallback)
{
        var params = { startKey, maxResults };
        requestFn(params, callback);
}

export function getPlayer (
        getPlayer: Request.GetPlayerRequest,
        email: string,
        callback: Request.GetPlayerCallback)
{
        var params = { email };
        getPlayer(params, callback);
}
