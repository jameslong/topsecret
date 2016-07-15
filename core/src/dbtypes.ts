import Kbpgp = require('./kbpgp');
import Message = require('./message');
import Player = require('./player');
import Prom = require('./utils/promise');

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
        exclusiveStartKey: string;
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
        send: Prom.Factory<Message.MessageData, string>;
}

export interface DBCalls {
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

export type SendMessageParams = Message.MessageData;
export type SendMessage = Prom.Factory<SendMessageParams, string>;

export function createPromiseFactories (calls: DBCalls, send: SendMessage)
{
        return {
                send,
                addPlayer: calls.addPlayer,
                updatePlayer: calls.updatePlayer,
                deletePlayer: calls.deletePlayer,
                deleteAllMessages: calls.deleteAllMessages,
                addMessage: calls.addMessage,
                updateMessage: calls.updateMessage,
                deleteMessage: calls.deleteMessage,
                getMessage: calls.getMessage,
                getMessages: calls.getMessages,
                getPlayer: calls.getPlayer,
        };
}
