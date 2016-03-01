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

export function removePlayer (
        email: string,
        requestFn: Request.RemovePlayerRequest,
        callback: Request.RemovePlayerCallback)
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

export function storeMessage (
        storeMessageFn: Request.StoreMessageRequest,
        messageState: Message.MessageState,
        callback: Request.Callback<Message.MessageState>)
{
        storeMessageFn(messageState, callback);
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

export function getPlayerState (
        getPlayerState: Request.GetPlayerStateRequest,
        email: string,
        callback: Request.GetPlayerStateCallback)
{
        var params = { email };
        getPlayerState(params, callback);
}
