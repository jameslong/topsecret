import Kbpgp = require('./kbpgp');
import Message = require('./message');
import Request = require('./requesttypes');
import Player = require('./player');
import Prom = require('./utils/promise');

export type CreateTableParams = string;
export type CreateTableFact = Prom.Factory<CreateTableParams, {}>;

export type DeleteTableParams = string;
export type DeleteTableFact = Prom.Factory<DeleteTableParams, {}>;

export type AddPlayerParams = Player.PlayerState;
export type AddPlayerFact = Prom.Factory<AddPlayerParams, Player.PlayerState>;

export type UpdatePlayerParams = Player.PlayerState;
export type UpdatePlayerFact = Prom.Factory<UpdatePlayerParams, Player.PlayerState>

export type DeletePlayerParams = string;
export type DeletePlayerFact = Prom.Factory<DeletePlayerParams, Player.PlayerState>;

export type AddMessageParams = Message.MessageState;
export type AddMessageFact = Prom.Factory<AddMessageParams, Message.MessageState>;

export type UpdateMessageParams = Message.MessageState;
export type UpdateMessageFact = Prom.Factory<UpdateMessageParams, Message.MessageState>

export type DeleteMessageParams = string;
export type DeleteMessageFact = Prom.Factory<DeleteMessageParams, Message.MessageState>;

export type DeleteAllMessagesParams = string;
export type DeleteAllMessagesFact = Prom.Factory<DeleteAllMessagesParams, {}>;

export type GetMessageParams = string;
export type GetMessageFact = Prom.Factory<GetMessageParams, Message.MessageState>;

export interface GetMessagesParams {
        startKey: string;
        maxResults: number;
}
export interface GetMessagesResult {
        messages: Message.MessageState[];
        lastEvaluatedKey: string;
}
export type GetMessagesFact = Prom.Factory<GetMessagesParams, GetMessagesResult>;

export type GetPlayerParams = string;
export type GetPlayerFact = Prom.Factory<GetPlayerParams, Player.PlayerState>;

export interface PromiseFactories extends DBCalls {
        encrypt: Prom.Factory<Kbpgp.EncryptData, string>;
        send: Prom.Factory<Message.MessageData, string>;
}

export interface DBCalls {
        createPlayerTable: CreateTableFact;
        createMessageTable: CreateTableFact;
        deleteTable: DeleteTableFact;
        addPlayer: AddPlayerFact;
        updatePlayer: UpdatePlayerFact;
        deletePlayer: DeletePlayerFact;
        addMessage: AddMessageFact;
        updateMessage: UpdateMessageFact;
        deleteMessage: DeleteMessageFact;
        deleteAllMessages: DeleteAllMessagesFact;
        getMessage: GetMessageFact;
        getMessages: GetMessagesFact;
        getPlayer: GetPlayerFact;
}
