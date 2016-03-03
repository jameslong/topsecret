/// <reference path='../../../../typings/aws-sdk/aws-sdk.d.ts'/>
/// <reference path='../../../../typings/dynamodb-doc/dynamodb-doc.d.ts'/>

import Config = require('../config');
import DBTypes = require('../../../../core/src/app/dbtypes');
import Log = require('../../../../core/src/app/log/log');
import Map = require('../../../../core/src/app/utils/map');
import Message = require('../../../../core/src/app/message');
import MessageHelpers = require('../../../../core/src/app/messagehelpers');
import Player = require('../../../../core/src/app/player');
import Request = require('../../../../core/src/app/requesttypes');

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

function tablePromiseFactory<T, U> (
        docClient: DOC.DynamoDB,
        requestFn: (
                docClient: DOC.DynamoDB,
                params: T,
                callback: Request.Callback<U>) => void)
{
        return (params: T) =>
                new Promise((resolve, reject) =>
                        requestFn(docClient, params, (err, result) =>
                                err ? reject(err) : resolve(result)));
}

function promiseFactory<T, U> (
        docClient: DOC.DynamoDB,
        tableName: string,
        requestFn: (
                docClient: DOC.DynamoDB,
                tableName: string,
                params: T,
                callback: Request.Callback<U>) => void)
{
        return (params: T) =>
                new Promise((resolve, reject) =>
                        requestFn(docClient, tableName, params, (err, result) =>
                                err ? reject(err) : resolve(result)));
}

export function createDynamoDBCalls (config: Config.ConfigState): DBTypes.DBCalls
{
        var dynamoConfig = config.dynamoDBConfig;
        var messagesTableName = dynamoConfig.messagesTableName;
        var playersTableName = dynamoConfig.playersTableName;

        AWS.config.loadFromPath(dynamoConfig.configFilepath);

        const docClient = new DOC.DynamoDB();

        const createPlayerTableLocal = tablePromiseFactory(
                docClient, createPlayerTable);
        const createMessageTableLocal = tablePromiseFactory(
                docClient, createMessageTable);
        const deleteTableLocal = tablePromiseFactory(docClient, deleteTable);
        const addPlayerLocal = promiseFactory(
                docClient, playersTableName, addPlayer);
        const updatePlayerLocal = promiseFactory(
                docClient, playersTableName, updatePlayer);
        const deletePlayerLocal = promiseFactory(
                docClient, playersTableName, deletePlayer);
        const deleteAllMessagesLocal = promiseFactory(
                docClient, messagesTableName, deleteAllMessages);
        const addMessageLocal = promiseFactory(
                docClient, messagesTableName, addMessage);
        const updateMessageLocal = promiseFactory(
                docClient, messagesTableName, updateMessage);
        const deleteMessageLocal = promiseFactory(
                docClient, messagesTableName, deleteMessage);
        const getMessageLocal = promiseFactory(
                docClient, messagesTableName, getMessage);
        const getMessagesLocal = promiseFactory(
                docClient, messagesTableName, getMessages);
        const getPlayerLocal = promiseFactory(
                docClient, messagesTableName, getPlayer);

        return {
                createPlayerTable: createPlayerTableLocal,
                createMessageTable: createMessageTableLocal,
                deleteTable: deleteTableLocal,
                addPlayer: addPlayerLocal,
                updatePlayer: updatePlayerLocal,
                deletePlayer: deletePlayerLocal,
                deleteAllMessages: deleteAllMessagesLocal,
                addMessage: addMessageLocal,
                updateMessage: updateMessageLocal,
                deleteMessage: deleteMessageLocal,
                getMessage: getMessageLocal,
                getMessages: getMessagesLocal,
                getPlayer: getPlayerLocal,
        };
}

export function deleteTable (
        docClient: DOC.DynamoDB,
        tableName: Request.CreateTableParams,
        callback: Request.CreateTableCallback)
{
        var awsParams = {
                TableName: tableName,
        };

        docClient.deleteTable(awsParams, callback);
}

export function createPlayerTable (
        docClient: DOC.DynamoDB,
        tableName: Request.CreateTableParams,
        callback: Request.CreateTableCallback)
{
        var awsParams = {
                TableName: tableName,
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
        tableName: Request.CreateTableParams,
        callback: Request.CreateTableCallback)
{
        var awsParams = {
                TableName: tableName,
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
        playerState: Request.AddPlayerParams,
        callback: Request.AddPlayerCallback)
{
        var awsParams: PutItemParams<Player.PlayerState> = {
                Item: playerState,
                TableName: playersTableName,
        };

        docClient.putItem(awsParams, callback);
};

export function updatePlayer (
        docClient: DOC.DynamoDB,
        playersTableName: string,
        playerState: Request.UpdatePlayerParams,
        callback: Request.UpdatePlayerCallback)
{
        var awsParams: PutItemParams<Player.PlayerState> = {
                Item: playerState,
                TableName: playersTableName,
        };

        docClient.putItem(awsParams, callback);
};

export function deletePlayer (
        docClient: DOC.DynamoDB,
        playersTableName: string,
        email: Request.DeletePlayerParams,
        callback: Request.DeletePlayerCallback)
{
        var awsParams: DeleteItemParams<{ email: string }> = {
                Key: { email: email },
                TableName: playersTableName,
        };

        docClient.deleteItem(awsParams, callback);
};

export function addMessage (
        docClient: DOC.DynamoDB,
        messagesTableName: string,
        messageState: Request.AddMessageParams,
        callback: Request.AddMessageCallback)
{
        Log.debug('Storing message dynamo', messageState);

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

export function updateMessage (
        docClient: DOC.DynamoDB,
        messagesTableName: string,
        params: Request.UpdateMessageParams,
        callback: Request.UpdateMessageCallback)
{
        var messageState = params;

        Log.debug('Updating message dynamo', params);

        var returnMessage: Request.MessageStateCallback =
                function (error, data)
                {
                        Log.debug('Updated message dynamo', data);
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
        messageId: Request.GetMessageParams,
        callback: Request.GetMessageCallback)
{
        var returnCallback = extractItem(callback);

        var awsParams = {
                Key: {
                        messageId: messageId,
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
        messageState: Request.DeleteMessageParams,
        callback: Request.DeleteMessageCallback)
{
        var returnCallback = extractAttributes(callback);

        var awsParams= {
                Key: {
                        messageId: messageState.messageId,
                },
                TableName: messagesTableName,
                ReturnValues: 'ALL_OLD',
        };

        docClient.deleteItem(awsParams, returnCallback);
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

export function getPlayer (
        docClient: DOC.DynamoDB,
        playersTableName: string,
        email: Request.GetPlayerParams,
        callback: Request.GetPlayerCallback)
{
        var returnCallback = extractItem(callback);

        var awsParams = {
                Key: {
                        email: email,
                },
                TableName: playersTableName,
        };

        docClient.getItem(awsParams, returnCallback);
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
