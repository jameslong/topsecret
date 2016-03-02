import Kbpgp = require('./kbpgp');
import Message = require('./message');
import Request = require('./requesttypes');
import Player = require('./player');
import Prom = require('./utils/promise');

export interface PromiseFactories extends DBCalls {
        encrypt: Prom.Factory<Kbpgp.EncryptData, string>;
        send: Prom.Factory<Message.MessageData, string>;
}

export interface DBCalls {
        createPlayerTable: Prom.Factory<Request.CreateTableParams, {}>;
        createMessageTable: Prom.Factory<Request.CreateTableParams, {}>;
        deleteTable: Prom.Factory<Request.DeleteTableParams, {}>;

        addPlayer: Prom.Factory<Request.AddPlayerParams, {}>;
        updatePlayer: Prom.Factory<Request.UpdatePlayerParams, {}>;
        removePlayer: Prom.Factory<Request.RemovePlayerParams, Request.RemovePlayerParams>;
        deleteAllMessages: Prom.Factory<Request.DeleteAllMessagesParams, {}>;
        storeMessage: Prom.Factory<Request.StoreMessageParams, Message.MessageState>;
        updateMessage: Prom.Factory<Request.UpdateMessageParams, Message.MessageState>;
        deleteMessage: Prom.Factory<Request.DeleteMessageParams, Message.MessageState>;

        getMessage: Prom.Factory<Request.GetMessageParams, Message.MessageState>;
        getMessages: Prom.Factory<Request.GetMessagesParams, Request.GetMessagesResult>;

        getPlayerState: Prom.Factory<Request.GetPlayerStateParams, Player.PlayerState>;
}
