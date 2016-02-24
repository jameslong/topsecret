import Request = require('./requesttypes');

export interface DBCalls {
        createPlayerTable: Request.CreateTableRequest;
        createMessageTable: Request.CreateTableRequest;
        deleteTable: Request.DeleteTableRequest;
        addPlayer: Request.AddPlayerRequest;
        removePlayer: Request.RemovePlayerRequest;
        deleteAllMessages: Request.DeleteAllMessagesRequest;
        getMessageUID: (params: Request.GetMessageUIDParams,
                callback: Request.GetMessageUIDCallback)=>void;
        storeMessage: (params: Request.StoreMessageParams,
                callback: Request.StoreMessageCallback)=>void;
        deleteMessage: (params: Request.DeleteMessageParams,
                callback: Request.DeleteMessageCallback)=>void;
        getMessage: (params: Request.GetMessageParams,
                callback: Request.GetMessageCallback)=>void;
        getMessages: (params: Request.GetMessagesParams,
                callback: Request.GetMessagesCallback)=>void;
        storeReply: (params: Request.StoreReplyParams,
                callback: Request.StoreReplyCallback)=>void;
        storePublicKey: Request.StorePublicKeyRequest;
        getPublicKey: Request.GetPublicKeyRequest;
        storeEmptyMessageId: Request.StoreEmptyMessageIdRequest;
        getEmptyMessageId: Request.GetEmptyMessageIdRequest;
        deleteEmptyMessageId: Request.DeleteEmptyMessageIdRequest;
        getPlayerState: Request.GetPlayerStateRequest;
        markChildSent: (params: Request.MarkChildSentParams,
                callback: Request.MarkChildSentCallback)=>void;
        markReplySent: (params: Request.MarkReplySentParams,
                callback: Request.MarkReplySentCallback)=>void;
}
