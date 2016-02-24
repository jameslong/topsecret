/// <reference path='../../typings/aws-sdk/aws-sdk.d.ts'/>
/// <reference path='../../typings/aws-sdk/dynamodb-doc.d.ts'/>

import Config = require('../Config/config');
import DBTypes = require('../game/dbtypes');
import Log = require('../game/log/log');
import Map = require('../game/utils/map');
import Message = require('../game/message');
import MessageHelpers = require('../game/messagehelpers');
import Player = require('../game/player');
import Request = require('../game/requesttypes');

import AWS = require('aws-sdk');
import DOC = require('dynamodb-doc');

export interface GetItemParams<T> {
        Key: T;
        TableName: string;
}

export interface PutItemParams<T> {
        Item: T;
        TableName: string;
        ReturnValues?: string;
}

export interface DeleteItemParams<T> {
        Key: T;
        TableName: string;
}

export interface QueryByEmailData {
        Items: {
                email: string;
                messageId: number;
        }[];
}

export interface UpdateItemParams<T> {
        Key: T;
        TableName: string;
}

export interface GetUIDParams extends UpdateItemParams<{email: string;}> {
        UpdateExpression: string;
        ExpressionAttributeValues: { ":inc": number; };
        ReturnValues: string;
}

export interface UpdateMessageParams extends UpdateItemParams<{
                messageId: string; }> {
        UpdateExpression: string;
        ExpressionAttributeValues: Object;
        ReturnValues: string;
}

export interface UpdatePlayerParams extends UpdateItemParams<{
                email: string; }> {
        UpdateExpression: string;
        ExpressionAttributeValues?: Object;
        ReturnValues: string;
}

export interface UpdateData<T> {
        Attributes: T;
}

export interface GetMessageUIDData extends UpdateData<{messageUID: number; }> {}

// export interface DocClientRequestFn {
//         <T>(params: Object, callback: Request.Callback<T>): void;
// }
//
// export interface DocClient {
//         Condition: <T>(name: string, op: string, value: T) => Object;
//         batchWriteItem: DocClientRequestFn;
//         createTable: DocClientRequestFn;
//         deleteItem: DocClientRequestFn;
//         deleteTable: DocClientRequestFn;
//         getItem: DocClientRequestFn;
//         scan: DocClientRequestFn;
//         putItem: DocClientRequestFn;
//         updateItem: DocClientRequestFn;
//         query: DocClientRequestFn;
// }

export function createDynamoDBCalls (config: Config.ConfigState): DBTypes.DBCalls
{
        var dynamoConfig = config.dynamoDBConfig;
        var messagesTableName = dynamoConfig.messagesTableName;
        var playersTableName = dynamoConfig.playersTableName;

        AWS.config.loadFromPath(dynamoConfig.configFilepath);

        var docClient = new DOC.DynamoDB();

        var createPlayerTableLocal = function (
                        params: Request.CreateTableParams,
                        callback: Request.CreateTableCallback)
                {
                        createPlayerTable(docClient, params, callback);
                };

        var createMessageTableLocal = function (
                        params: Request.CreateTableParams,
                        callback: Request.CreateTableCallback)
                {
                        createMessageTable(docClient, params, callback);
                };

        var deleteTableLocal = function (
                        params: Request.DeleteTableParams,
                        callback: Request.DeleteTableCallback)
                {
                        deleteTable(docClient, params, callback);
                };

        var addPlayerLocal = function (
                        params: Request.AddPlayerParams,
                        callback: Request.AddPlayerCallback)
                {
                        addPlayer(
                                docClient, playersTableName, params, callback);
                };

        var removePlayerLocal = function (
                        params: Request.RemovePlayerParams,
                        callback: Request.RemovePlayerCallback)
                {
                        removePlayer(
                                docClient, playersTableName, params, callback);
                };

        var deleteAllMessagesLocal = function (
                        params: Request.DeleteAllMessagesParams,
                        callback: Request.DeleteAllMessagesCallback)
                {
                        deleteAllMessages(
                                docClient, messagesTableName, params, callback);
                };

        var getMessageUIDLocal = function (
                        params: Request.GetMessageUIDParams,
                        callback: Request.GetMessageUIDCallback)
                {
                        getMessageUID(
                                docClient, playersTableName, params, callback);
                };

        var storeMessageLocal = function (
                        params: Request.StoreMessageParams,
                        callback: Request.StoreMessageCallback)
                {
                        storeMessage(
                                docClient, messagesTableName, params, callback);
                };

        var deleteMessageLocal = function (
                        params: Request.DeleteMessageParams,
                        callback: Request.DeleteMessageCallback)
                {
                        deleteMessage(
                                docClient, messagesTableName, params, callback);
                };

        var getMessageLocal = function (
                        params: Request.GetMessageParams,
                        callback: Request.GetMessageCallback)
                {
                        getMessage(
                                docClient, messagesTableName, params, callback);
                };

        var getMessagesLocal = function (
                        params: Request.GetMessagesParams,
                        callback: Request.GetMessagesCallback)
                {
                        getMessages(
                                docClient, messagesTableName, params, callback);
                };

        var storeReplyLocal = function (
                        params: Request.StoreReplyParams,
                        callback: Request.StoreReplyCallback)
                {
                        storeReply(
                                docClient, messagesTableName, params, callback);
                };

        var storePublicKeyLocal = function (
                        params: Request.StorePublicKeyParams,
                        callback: Request.StorePublicKeyCallback)
                {
                        storePublicKey(
                                docClient, playersTableName, params, callback);
                };

        var getPublicKeyLocal = function (
                        params: Request.GetPublicKeyParams,
                        callback: Request.GetPublicKeyCallback)
                {
                        getPublicKey(
                                docClient, playersTableName, params, callback);
                };

        var storeEmptyMessageIdLocal = function (
                        params: Request.StoreEmptyMessageIdParams,
                        callback: Request.StoreEmptyMessageIdCallback)
                {
                        storeEmptyMessageId(
                                docClient, playersTableName, params, callback);
                };

        var getEmptyMessageIdLocal = function (
                        params: Request.GetEmptyMessageIdParams,
                        callback: Request.GetEmptyMessageIdCallback)
                {
                        getEmptyMessageId(
                                docClient, playersTableName, params, callback);
                };

        var deleteEmptyMessageIdLocal = function (
                        params: Request.DeleteEmptyMessageIdParams,
                        callback: Request.DeleteEmptyMessageIdCallback)
                {
                        deleteEmptyMessageId(
                                docClient, playersTableName, params, callback);
                };

        var getPlayerStateLocal = function (
                        params: Request.GetPlayerStateParams,
                        callback: Request.GetPlayerStateCallback)
                {
                        getPlayerState(
                                docClient, playersTableName, params, callback);
                };

        var markChildSentLocal = function (
                        params: Request.MarkChildSentParams,
                        callback: Request.MarkChildSentCallback)
                {
                        markChildSent(
                                docClient, messagesTableName, params, callback);
                };

        var markReplySentLocal = function (
                        params: Request.MarkReplySentParams,
                        callback: Request.MarkReplySentCallback)
                {
                        markReplySent(
                                docClient, messagesTableName, params, callback);
                };

        return {
                createPlayerTable: createPlayerTableLocal,
                createMessageTable: createMessageTableLocal,
                deleteTable: deleteTableLocal,
                addPlayer: addPlayerLocal,
                removePlayer: removePlayerLocal,
                deleteAllMessages: deleteAllMessagesLocal,
                getMessageUID: getMessageUIDLocal,
                storeMessage: storeMessageLocal,
                deleteMessage: deleteMessageLocal,
                getMessage: getMessageLocal,
                getMessages: getMessagesLocal,
                storeReply: storeReplyLocal,
                storePublicKey: storePublicKeyLocal,
                getPublicKey: getPublicKeyLocal,
                storeEmptyMessageId: storeEmptyMessageIdLocal,
                getEmptyMessageId: getEmptyMessageIdLocal,
                deleteEmptyMessageId: deleteEmptyMessageIdLocal,
                getPlayerState: getPlayerStateLocal,
                markChildSent: markChildSentLocal,
                markReplySent: markReplySentLocal,
        };
}

export function deleteTable (
        docClient: DOC.DynamoDB,
        params: Request.CreateTableParams,
        callback: Request.CreateTableCallback)
{
        var awsParams = {
                TableName: params.tableName,
        };

        docClient.deleteTable(awsParams, callback);
}

export function createPlayerTable (
        docClient: DOC.DynamoDB,
        params: Request.CreateTableParams,
        callback: Request.CreateTableCallback)
{
        var awsParams = {
                TableName: params.tableName,
                AttributeDefinitions: [
                        {
                                AttributeName: 'email',
                                AttributeType: 'S',
                        },
                ],
                KeySchema: [
                        {
                                AttributeName: 'email',
                                KeyType: "HASH"
                        }
                ],
                ProvisionedThroughput: {
                        ReadCapacityUnits: 10,
                        WriteCapacityUnits: 10
                },
        };

        docClient.createTable(awsParams, callback);
};

export function createMessageTable (
        docClient: DOC.DynamoDB,
        params: Request.CreateTableParams,
        callback: Request.CreateTableCallback)
{
        var awsParams = {
                TableName: params.tableName,
                AttributeDefinitions: [
                        {
                                AttributeName: 'messageId',
                                AttributeType: 'S',
                        },
                        {
                                AttributeName: 'email',
                                AttributeType: 'S',
                        },
                ],
                KeySchema: [
                        {
                                AttributeName: 'messageId',
                                KeyType: "HASH",
                        }
                ],
                GlobalSecondaryIndexes: [
                        {
                                IndexName: 'email-index',
                                KeySchema: [
                                        {
                                                AttributeName: 'email',
                                                KeyType: 'HASH'
                                        },
                                        {
                                                AttributeName: 'messageId',
                                                KeyType: "RANGE"
                                        }
                                ],
                                Projection: {
                                        ProjectionType: 'KEYS_ONLY'
                                },
                                ProvisionedThroughput: {
                                        ReadCapacityUnits: 5,
                                        WriteCapacityUnits: 5
                                },
                        }
                ],
                ProvisionedThroughput: {
                        ReadCapacityUnits: 5,
                        WriteCapacityUnits: 5,
                },
        };

        docClient.createTable(awsParams, callback);
};

export function addPlayer (
        docClient: DOC.DynamoDB,
        playersTableName: string,
        params: Request.AddPlayerParams,
        callback: Request.AddPlayerCallback)
{
        var awsParams: PutItemParams<Player.PlayerState> = {
                Item: params.playerState,
                TableName: playersTableName,
        };

        docClient.putItem(awsParams, callback);
};

export function removePlayer (
        docClient: DOC.DynamoDB,
        playersTableName: string,
        params: Request.RemovePlayerParams,
        callback: Request.RemovePlayerCallback)
{
        var awsParams: DeleteItemParams<
                        Request.RemovePlayerParams> = {
                Key: { email: params.email },
                TableName: playersTableName,
        };

        docClient.deleteItem(awsParams, callback);
};

export function getMessageUID (
        docClient: DOC.DynamoDB,
        playersTableName: string,
        params: Request.GetMessageUIDParams,
        callback: Request.GetMessageUIDCallback)
{
        var extractResult: Request.Callback<GetMessageUIDData> =
                function (error, data)
                {
                        var messageUID =
                                (data ? data.Attributes.messageUID : null);
                        var formattedId = MessageHelpers.createMessageId(
                                params.email, messageUID);

                        Log.debug('New message id', formattedId);

                        return callback(error, formattedId);
                };

        var awsParams: GetUIDParams = {
                Key: {
                        email: params.email,
                },
                UpdateExpression: 'set messageUID = messageUID + :inc',
                ExpressionAttributeValues: {
                        ":inc" : 1,
                },
                ReturnValues: 'UPDATED_NEW',
                TableName: playersTableName,
        };

        docClient.updateItem(awsParams, extractResult);
};

export function storeMessage (
        docClient: DOC.DynamoDB,
        messagesTableName: string,
        params: Request.StoreMessageParams,
        callback: Request.StoreMessageCallback)
{
        var messageState = params.messageState;

        Log.debug('Storing message dynamo', params);

        var returnMessage: Request.MessageStateCallback =
                function (error, data)
                {
                        Log.debug('Stored message dynamo', data);
                        return callback(error, messageState);
                };

        var awsParams: PutItemParams<Message.MessageState> = {
                Item: messageState,
                TableName: messagesTableName,
                ReturnValues: 'NONE',
        };

        docClient.putItem(awsParams, returnMessage);
};

export function getMessage (
        docClient: DOC.DynamoDB,
        messagesTableName: string,
        params: Request.GetMessageParams,
        callback: Request.GetMessageCallback)
{
        var returnCallback = extractItem(callback);

        var awsParams = {
                Key: {
                        messageId: params.messageId,
                },
                TableName: messagesTableName,
        };

        docClient.getItem(awsParams, returnCallback);
};

export function getMessages (
        docClient: DOC.DynamoDB,
        messagesTableName: string,
        params: Request.GetMessagesParams,
        callback: Request.GetMessagesCallback)
{
        var returnCallback = (error: Request.Error,
                        data: { Items: Message.MessageState[]; LastEvaluatedKey: { messageId: string;} }) => {
                var result: Request.GetMessagesResult = {
                        messages: [],
                        lastEvaluatedKey: null,
                };
                if (!error) {
                        result.messages = data.Items;
                }
                var lastEvaluatedKey = data ? data.LastEvaluatedKey : null;
                result.lastEvaluatedKey = lastEvaluatedKey ?
                        lastEvaluatedKey.messageId : null;

                callback(error, result);
        };

        var awsParams: any = {
                Limit : params.maxResults,
                TableName: messagesTableName,
        };

        if (params.startKey !== null) {
                awsParams.ExclusiveStartKey = {
                        messageId: params.startKey,
                };
        }

        docClient.scan(awsParams, returnCallback);
};

export function deleteMessage (
        docClient: DOC.DynamoDB,
        messagesTableName: string,
        params: Request.DeleteMessageParams,
        callback: Request.DeleteMessageCallback)
{
        var returnCallback = extractAttributes(callback);

        var awsParams= {
                Key: {
                        messageId: params.messageId,
                },
                TableName: messagesTableName,
                ReturnValues: 'ALL_OLD',
        };

        docClient.deleteItem(awsParams, returnCallback);
};

export function storeReply (
        docClient: DOC.DynamoDB,
        messagesTableName: string,
        params: Request.StoreReplyParams,
        callback: Request.StoreReplyCallback)
{
        var returnMessage = extractAttributes(callback);

        var awsParams: UpdateMessageParams = {
                Key: {
                        messageId: params.messageId,
                },
                UpdateExpression: 'set reply = :reply',
                ExpressionAttributeValues: {
                        ":reply" : params.reply,
                },
                ReturnValues: 'ALL_NEW',
                TableName: messagesTableName,
        };

        docClient.updateItem(awsParams, returnMessage);
};

export function deleteAllMessages (
        docClient: DOC.DynamoDB,
        messagesTableName: string,
        params: Request.DeleteAllMessagesParams,
        callback: Request.DeleteAllMessagesCallback)
{
        var localQueryByEmail =
                        (params: Request.DeleteAllMessagesParams,
                        callback: Request.Callback<QueryByEmailData>) =>
                {
                        queryByEmail(
                                params.email,
                                messagesTableName,
                                'email-index',
                                docClient,
                                callback);
                };

        var localDeleteById = function (
                        emailQueryData: QueryByEmailData,
                        callback: Request.DeleteAllMessagesCallback)
                {
                        if (emailQueryData.Items.length) {
                                return deleteById(
                                        messagesTableName,
                                        docClient,
                                        emailQueryData,
                                        callback);
                        } else {
                                callback(null, null);
                        }
                };

        var seq = Request.seq2(
                localQueryByEmail,
                localDeleteById);

        seq(params, callback);
};

export function storePublicKey (
        docClient: DOC.DynamoDB,
        playersTableName: string,
        params: Request.StorePublicKeyParams,
        callback: Request.StorePublicKeyCallback)
{
        var awsParams: UpdatePlayerParams = {
                Key: {
                        email: params.email,
                },
                UpdateExpression: 'set publicKey = :publicKey',
                ExpressionAttributeValues: {
                        ":publicKey" : params.publicKey,
                },
                ReturnValues: 'ALL_NEW',
                TableName: playersTableName,
        };

        docClient.updateItem(awsParams, callback);
};

export function getPublicKey (
        docClient: DOC.DynamoDB,
        playersTableName: string,
        params: Request.GetPublicKeyParams,
        callback: Request.GetPublicKeyCallback)
{
        var returnCallback = extractItem(callback);

        var awsParams = {
                Key: {
                        email: params.email,
                },
                ProjectionExpression: 'email, publicKey',
                TableName: playersTableName,
        };

        docClient.getItem(awsParams, returnCallback);
};

export function storeEmptyMessageId (
        docClient: DOC.DynamoDB,
        playersTableName: string,
        params: Request.StoreEmptyMessageIdParams,
        callback: Request.StoreEmptyMessageIdCallback)
{
        var returnCallback = extractAttributes(callback);

        var awsParams: UpdatePlayerParams = {
                Key: {
                        email: params.email,
                },
                UpdateExpression: 'set emptyMessages.' + params.profileName + ' = :messageId',
                ExpressionAttributeValues: {
                        ":messageId" : params.messageId,
                },
                ReturnValues: 'ALL_NEW',
                TableName: playersTableName,
        };

        docClient.updateItem(awsParams, returnCallback);
};

export function getEmptyMessageId (
        docClient: DOC.DynamoDB,
        playersTableName: string,
        params: Request.GetEmptyMessageIdParams,
        callback: Request.GetEmptyMessageIdCallback)
{
        var profileName = params.profileName;

        var returnCallback = function (
                        error: Request.Error,
                        data: {email: string, emptyMessages: Map.Map<string>;})
                {
                        var result: Request.GetEmptyMessageIdResult = {
                                email: data.email,
                                messageId: null,
                        };

                        if (data) {
                                result.messageId =
                                        data.emptyMessages[profileName]
                        }

                        callback(error, result);
                };

        var awsParams = {
                Key: {
                        email: params.email,
                },
                ProjectionExpression: 'email, emptyMessages.' + profileName,
                TableName: playersTableName,
        };

        docClient.getItem(awsParams, extractItem(returnCallback));
};

export function deleteEmptyMessageId (
        docClient: DOC.DynamoDB,
        playersTableName: string,
        params: Request.DeleteEmptyMessageIdParams,
        callback: Request.DeleteEmptyMessageIdCallback)
{
        var returnCallback = extractAttributes(callback);

        var awsParams: UpdatePlayerParams = {
                Key: {
                        email: params.email,
                },
                UpdateExpression: 'remove emptyMessages.' + params.profileName,
                ReturnValues: 'ALL_NEW',
                TableName: playersTableName,
        };

        docClient.updateItem(awsParams, returnCallback);
};

export function getPlayerState (
        docClient: DOC.DynamoDB,
        playersTableName: string,
        params: Request.GetPlayerStateParams,
        callback: Request.GetPlayerStateCallback)
{
        var returnCallback = extractItem(callback);

        var awsParams = {
                Key: {
                        email: params.email,
                },
                TableName: playersTableName,
        };

        docClient.getItem(awsParams, returnCallback);
};

export function markChildSent (
        docClient: DOC.DynamoDB,
        messagesTableName: string,
        params: Request.MarkChildSentParams,
        callback: Request.MarkChildSentCallback)
{
        var returnCallback = extractAttributes(callback);

        var awsParams: UpdateMessageParams = {
                Key: {
                        messageId: params.messageId,
                },
                UpdateExpression: 'set childrenSent[' + params.childIndex + '] = :sent',
                ExpressionAttributeValues: {
                        ":sent" : true,
                },
                ReturnValues: 'ALL_NEW',
                TableName: messagesTableName,
        };

        docClient.updateItem(awsParams, returnCallback);
};

export function markReplySent (
        docClient: DOC.DynamoDB,
        messagesTableName: string,
        params: Request.MarkReplySentParams,
        callback: Request.MarkReplySentCallback)
{
        var returnCallback = extractAttributes(callback);

        var awsParams: UpdateMessageParams = {
                Key: {
                        messageId: params.messageId,
                },
                UpdateExpression: 'set replySent = :sent',
                ExpressionAttributeValues: {
                        ":sent" : true,
                },
                ReturnValues: 'ALL_NEW',
                TableName: messagesTableName,
        };

        docClient.updateItem(awsParams, returnCallback);
};

export function extractAttributes<T> (callback: Request.Callback<T>)
        : Request.Callback<{Attributes: T}>
{
        return function (error, data)
                {
                        var attributes = data ? data.Attributes : null;
                        callback(error, attributes);
                };
}

export function extractItem<T> (callback: Request.Callback<T>)
        : Request.Callback<{Item: T}>
{
        return function (error, data)
                {
                        var item = data ? data.Item : null;
                        callback(error, item);
                };
}

export function queryByEmail (
        email: string,
        tableName: string,
        indexName: string,
        docClient: DOC.DynamoDB,
        callback: Request.Callback<QueryByEmailData>)
{
        var queryParams = {
                IndexName: indexName,
                KeyConditions: [
                        docClient.Condition('email', 'EQ', email)
                ],
                TableName: tableName,
        };

        docClient.query(queryParams, callback);
}

export function deleteById (
        tableName: string,
        docClient: DOC.DynamoDB,
        emailQueryData: QueryByEmailData,
        callback: Request.DeleteAllMessagesCallback)
{
        var requestItems: Map.Map<any[]> = {};
        var deleteRequests = emailQueryData.Items.map(function (item)
                {
                        return {
                                DeleteRequest: {
                                        Key: {
                                                messageId: item.messageId,
                                        }
                                }
                        };
                });
        requestItems[tableName] = deleteRequests;

        var queryParams = {
                RequestItems: requestItems,
        };

        docClient.batchWriteItem(queryParams, callback);
}
