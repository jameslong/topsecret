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

export function getMessageId (
        getMessageIdFn: Request.GetMessageUIDRequest,
        email: string,
        callback: Request.GetMessageUIDCallback)
{
        var params = { email };
        getMessageIdFn(params, callback);
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

export function storeReply (
        storeReplyRequestFn: Request.StoreReplyRequest,
        messageId: string,
        replyIndex: number,
        timestampMs: number,
        callback: Request.Callback<Message.MessageState>)
{
        var params = {
                messageId,
                reply: {
                        replyIndex: replyIndex,
                        timestampMs: timestampMs,
                },
        };
        storeReplyRequestFn(params, callback);
}

export function storePublicKey (
        storePublicKeyRequestFn: Request.StorePublicKeyRequest,
        email: string,
        publicKey: string,
        callback: Request.StorePublicKeyCallback)
{
        var params = { email, publicKey };
        storePublicKeyRequestFn(params, callback);
}

export function getPublicKey (
        getPublicKey: Request.GetPublicKeyRequest,
        email: string,
        callback: Request.Callback<Request.PublicKeyData>)
{
        var params = { email };
        getPublicKey(params, callback);
}

export function storeEmptyMessageId (
        storeEmptyMessageIdFn: Request.StoreEmptyMessageIdRequest,
        email: string,
        messageId: string,
        profileName: string,
        callback: Request.StoreEmptyMessageIdCallback)
{
        var params = { email, messageId, profileName };
        storeEmptyMessageIdFn(params, callback);
}

export function getEmptyMessageId (
        getEmptyMessageIdFn: Request.GetEmptyMessageIdRequest,
        email: string,
        profileName: string,
        callback: Request.GetEmptyMessageIdCallback)
{
        var params = { email, profileName };
        getEmptyMessageIdFn(params, callback);
}

export function deleteEmptyMessageId (
        deleteEmptyMessageIdFn: Request.DeleteEmptyMessageIdRequest,
        email: string,
        profileName: string,
        callback: Request.DeleteEmptyMessageIdCallback)
{
        var params = { email, profileName };
        deleteEmptyMessageIdFn(params, callback);
}

export function getPlayerState (
        getPlayerState: Request.GetPlayerStateRequest,
        email: string,
        callback: Request.GetPlayerStateCallback)
{
        var params = { email };
        getPlayerState(params, callback);
}

export function markChildSent (
        markChildSentFn: Request.MarkChildSentRequest,
        messageId: string,
        childIndex: number,
        callback: Request.MarkChildSentCallback)
{
        var params = { messageId, childIndex };
        markChildSentFn(params, callback);
}

export function markReplySent (
        markReplySentFn: Request.MarkReplySentRequest,
        messageId: string,
        callback: Request.MarkReplySentCallback)
{
        var params = { messageId };
        markReplySentFn(params, callback);
}
