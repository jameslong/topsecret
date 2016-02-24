import Map = require('./utils/map');
import Message = require('./message');
import Player = require('./player');

export interface Error {
        code: string;
        message: string;
}

export interface Callback<T> {
        (error: Error, data: T): void;
}

export interface RequestFunc<T, U> {
        (params: T, callback: Callback<U>): void;
}

export interface InitialRequestFunc<T> {
        (callback: Callback<T>): void;
}

export interface ErrorCallback {
        (error: Error): void;
}

export interface MessageUIDCallback extends Callback<string> {}

export interface MessageStateCallback extends Callback<Message.MessageState> {}

export interface CreateTableParams {
        tableName: string;
}
export interface CreateTableCallback extends Callback<{}> {}
export interface CreateTableRequest {
        (params: CreateTableParams, callback: CreateTableCallback): void;
}

export interface DeleteTableParams {
        tableName: string;
}
export interface DeleteTableCallback extends Callback<{}> {}
export interface DeleteTableRequest {
        (params: DeleteTableParams, callback: DeleteTableCallback): void;
}

export interface AddPlayerParams {
        playerState: Player.PlayerState;
}
export interface AddPlayerCallback extends Callback<{}> {}
export interface AddPlayerRequest {
        (params: AddPlayerParams, callback: AddPlayerCallback): void;
}

export interface RemovePlayerParams {
        email: string;
}
export interface RemovePlayerCallback extends Callback<RemovePlayerParams> {}
export interface RemovePlayerRequest {
        (params: RemovePlayerParams, callback: RemovePlayerCallback): void;
}

export interface DeleteAllMessagesParams {
        email: string;
}
export interface DeleteAllMessagesCallback extends Callback<{}> {}
export interface DeleteAllMessagesRequest {
        (params: DeleteAllMessagesParams, callback: DeleteAllMessagesCallback): void;
}

export interface GetMessageUIDParams {
        email: string;
}
export interface GetMessageUIDCallback extends MessageUIDCallback {}
export interface GetMessageUIDRequest {
        (params: GetMessageUIDParams, callback: GetMessageUIDCallback): void;
}

export interface StoreMessageParams {
        messageState: Message.MessageState;
}
export interface StoreMessageCallback extends MessageStateCallback {}
export interface StoreMessageRequest {
        (params: StoreMessageParams, callback: StoreMessageCallback): void;
}

export interface DeleteMessageParams {
        messageId: string;
}
export interface DeleteMessageCallback extends MessageStateCallback {}
export interface DeleteMessageRequest {
        (params: DeleteMessageParams, callback: DeleteMessageCallback): void;
}

export interface GetMessageParams {
        messageId: string;
}
export interface GetMessageCallback extends MessageStateCallback {}
export interface GetMessageRequest {
        (params: GetMessageParams, callback: GetMessageCallback): void;
}

export interface GetMessagesParams {
        startKey: string;
        maxResults: number;
}
export interface GetMessagesResult {
        messages: Message.MessageState[];
        lastEvaluatedKey: string;
}
export interface GetMessagesCallback extends Callback<GetMessagesResult> {}
export interface GetMessagesRequest {
        (params: GetMessagesParams, callback: GetMessagesCallback): void;
}

export interface StoreReplyParams {
        messageId: string;
        reply: Message.ReplyState;
}
export interface StoreReplyCallback extends MessageStateCallback {}
export interface StoreReplyRequest {
        (params: StoreReplyParams, callback: StoreReplyCallback): void;
}

export interface StorePublicKeyParams {
        email: string;
        publicKey: string;
}
export interface StorePublicKeyCallback extends Callback<any> {}
export interface StorePublicKeyRequest {
        (params: StorePublicKeyParams, callback: StorePublicKeyCallback): void;
}

export interface StoreEmptyMessageIdParams {
        email: string;
        messageId: string;
        profileName: string;
}
export interface StoreEmptyMessageIdCallback extends Callback<Player.PlayerState> {}
export interface StoreEmptyMessageIdRequest {
        (params: StoreEmptyMessageIdParams, callback: StoreEmptyMessageIdCallback): void;
}

export interface GetEmptyMessageIdParams {
        email: string;
        profileName: string;
}
export interface GetEmptyMessageIdResult {
        email: string;
        messageId: string;
}
export interface GetEmptyMessageIdCallback extends Callback<GetEmptyMessageIdResult> {}
export interface GetEmptyMessageIdRequest {
        (params: GetEmptyMessageIdParams, callback: GetEmptyMessageIdCallback): void;
}

export interface DeleteEmptyMessageIdParams {
        email: string;
        profileName: string;
}
export interface DeleteEmptyMessageIdCallback extends Callback<Player.PlayerState> {}
export interface DeleteEmptyMessageIdRequest {
        (params: DeleteEmptyMessageIdParams, callback: DeleteEmptyMessageIdCallback): void;
}

export interface SetSentTimestampParams {
        messageId: string;
        timestampMs: number;
}
export interface SetSentTimestampCallback extends MessageStateCallback {}

export interface GetPublicKeyParams {
        email: string;
}
export interface PublicKeyData {
        email: string;
        publicKey: string;
}
export interface GetPublicKeyCallback extends Callback<PublicKeyData> {}
export interface GetPublicKeyRequest {
        (params: GetPublicKeyParams, callback: GetPublicKeyCallback): void;
}

export interface GetPlayerStateParams {
        email: string;
}
export interface GetPlayerStateCallback extends Callback<Player.PlayerState> {}
export interface GetPlayerStateRequest {
        (params: GetPlayerStateParams, callback: GetPlayerStateCallback): void;
}

export interface MarkChildSentParams {
        messageId: string;
        childIndex: number;
}
export interface MarkChildSentCallback extends Callback<Message.MessageState> {}
export interface MarkChildSentRequest {
        (params: MarkChildSentParams, callback: MarkChildSentCallback): void;
}

export interface MarkReplySentParams {
        messageId: string;
}
export interface MarkReplySentCallback extends Callback<Message.MessageState> {}
export interface MarkReplySentRequest {
        (params: MarkReplySentParams, callback: MarkReplySentCallback): void;
}

export function seq2<T, U, V> (
        requestA: RequestFunc<T, U>,
        requestB: RequestFunc<U, V>)
{
        return function (params: T, callback: Callback<V>)
                {
                        var initialCallback = function (error: Error, data: U)
                        {
                                if (error) {
                                        callback(error, null);
                                } else {
                                        requestB(data, callback);
                                }
                        };

                        requestA(params, initialCallback);
                };
}

export function seq3<T, U, V, W> (
        requestA: RequestFunc<T, U>,
        requestB: RequestFunc<U, V>,
        requestC: RequestFunc<V, W>)
{
        return function (params: T, callback: Callback<W>)
                {
                        var initialCallback = function (error: Error, data: U)
                        {
                                if (error) {
                                        callback(error, null);
                                } else {
                                        seq2(requestB, requestC)(
                                                data, callback);
                                }
                        };

                        requestA(params, initialCallback);
                };
}

export function seq4<T, U, V, W, X> (
        requestA: RequestFunc<T, U>,
        requestB: RequestFunc<U, V>,
        requestC: RequestFunc<V, W>,
        requestD: RequestFunc<W, X>)
{
        return function (params: T, callback: Callback<X>)
                {
                        var initialCallback = function (error: Error, data: U)
                        {
                                if (error) {
                                        callback(error, null);
                                } else {
                                        seq3(requestB, requestC, requestD)(
                                                data, callback);
                                }
                        };

                        requestA(params, initialCallback);
                };
}

export function seq5<T, U, V, W, X, Y> (
        requestA: RequestFunc<T, U>,
        requestB: RequestFunc<U, V>,
        requestC: RequestFunc<V, W>,
        requestD: RequestFunc<W, X>,
        requestE: RequestFunc<X, Y>)
{
        return function (params: T, callback: Callback<Y>)
                {
                        var initialCallback = function (error: Error, data: U)
                        {
                                if (error) {
                                        callback(error, null);
                                } else {
                                        seq4(requestB,
                                                requestC,
                                                requestD,
                                                requestE)(data, callback);
                                }
                        };

                        requestA(params, initialCallback);
                };
}

export function sequence<T> (
        tasks: InitialRequestFunc<T>[],
        callback: Callback<T[]>)
{
        var index = 0;
        var result: T[] = [];
        var length = tasks.length;

        if (length > 0) {
                var onRequest = (error: Error, data: T) => {
                        if (error) {
                                callback(error, result);
                        } else {
                                result.push(data);

                                index += 1;

                                if (index < length) {
                                        tasks[index](onRequest);
                                } else {
                                        callback(error, result);
                                }
                        }
                };

                tasks[0](onRequest);
        } else {
                callback(null, result);
        }
}

export function parallel<T> (
        tasks: InitialRequestFunc<T>[], callback: Callback<T[]>)
{
        var count = tasks.length;
        var results: T[] = [];
        var hasError = false;
        var callbackWrapper = function (error: Error, result: T)
                {
                        if (error) {
                                hasError = true;
                                callback(error, null);
                        } else if (!hasError) {
                                count -= 1;
                                results.push(result);

                                if (count === 0) {
                                        callback(error, results);
                                }
                        }
                };

        tasks.forEach(function (task)
                {
                        task(callbackWrapper);
                });
}

export function parallelObject<T> (
        tasks: Map.Map<InitialRequestFunc<T>>,
        callback: Callback<Map.Map<T>>)
{
        var count = Object.keys(tasks).length;
        var results: Map.Map<T> = {};
        var hasError = false;
        var callbackWrapper = function (name: string, error: Error, result: T)
                {
                        if (error) {
                                hasError = true;
                                callback(error, null);
                        } else if (!hasError) {
                                count -= 1;
                                results[name] = result;

                                if (count === 0) {
                                        callback(error, results);
                                }
                        }
                };

        for (var taskName in tasks) {
                if (tasks.hasOwnProperty(taskName)) {
                        tasks[taskName](function (error: Error, result: T)
                                {
                                        callbackWrapper(
                                                taskName, error, result);
                                });
                }
        }
}
