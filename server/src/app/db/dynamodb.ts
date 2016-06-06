/// <reference path='../../../../typings/aws-sdk/aws-sdk.d.ts'/>
/// <reference path='../../../../typings/dynamodb-doc/dynamodb-doc.d.ts'/>

import Config = require('../config');
import DBTypes = require('../../../../core/src/app/dbtypes');
import Func = require('../../../../core/src/app/utils/function');
import Log = require('../../../../core/src/app/log');
import Map = require('../../../../core/src/app/utils/map');
import Message = require('../../../../core/src/app/message');
import MessageHelpers = require('../../../../core/src/app/messagehelpers');
import Player = require('../../../../core/src/app/player');
import Request = require('../../../../core/src/app/requesttypes');

import AWS = require('aws-sdk');
import DOC = require('dynamodb-doc');

export interface GetUIDParams extends DOC.UpdateItemParams {
        UpdateExpression: string;
        ExpressionAttributeValues: { ":inc": number; };
        ReturnValues: string;
}

export interface UpdateMessageParams extends DOC.UpdateItemParams {
        UpdateExpression: string;
        ExpressionAttributeValues: Object;
        ReturnValues: string;
}

export interface UpdatePlayerParams extends DOC.UpdateItemParams {
        UpdateExpression: string;
        ExpressionAttributeValues?: Object;
        ReturnValues: string;
}

export interface UpdateData<T> {
        Attributes: T;
}

export interface GetMessageUIDData extends UpdateData<{ messageUID: number; }> {}

function tablePromiseFactory<T, U> (
        docClient: DOC.DynamoDB,
        requestFn: (docClient: DOC.DynamoDB, params: T) => Promise<U>)
{
        return (params: T) => requestFn(docClient, params);
}

function promiseFactory<T, U> (
        docClient: DOC.DynamoDB,
        tableName: string,
        requestFn: (
                docClient: DOC.DynamoDB,
                tableName: string,
                params: T) => Promise<U>)
{
        return (params: T) => requestFn(docClient, tableName, params);
}

export function createDynamoDBCalls (config: Config.AWSConfig): DBTypes.DBCalls
{
        const {
                accessKeyId,
                secretAccessKey,
                region,
                messagesTableName,
                playersTableName } = config;

        (<any>AWS.config.update)({ accessKeyId, secretAccessKey, region });

        const docClient = new DOC.DynamoDB();

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

export function returnPromise<T, U, V> (
        request: string,
        docClient: DOC.DynamoDB,
        requestFn: (params: T, callback: Request.Callback<U>) => void,
        params: T,
        map: (result: U) => V = Func.identity): Promise<V>
{
        return new Promise((resolve, reject) => {
                requestFn.call(docClient, params,
                        (error: Request.Error, result: U) => {
                                if (error) {
                                        Log.metric({
                                                type: 'AWS_REQUEST_ERROR',
                                                request,
                                                params,
                                                error,
                                        });

                                        reject(error);
                                } else {
                                        resolve(map(result));
                                }
                        }
                )
        });
}

export function addPlayer (
        docClient: DOC.DynamoDB,
        playersTableName: string,
        playerState: DBTypes.AddPlayerParams)
{
        var awsParams: DOC.PutItemParams = {
                Item: playerState,
                TableName: playersTableName,
        };

        return returnPromise(
                'addPlayer', docClient, docClient.putItem, awsParams);
};

export function updatePlayer (
        docClient: DOC.DynamoDB,
        playersTableName: string,
        playerState: DBTypes.UpdatePlayerParams)
{
        var awsParams: DOC.PutItemParams = {
                Item: playerState,
                TableName: playersTableName,
        };

        return returnPromise(
                'updatePlayer', docClient, docClient.putItem, awsParams);
};

export function deletePlayer (
        docClient: DOC.DynamoDB,
        playersTableName: string,
        email: DBTypes.DeletePlayerParams)
{
        var awsParams: DOC.DeleteItemParams = {
                Key: { email: email },
                TableName: playersTableName,
        };

        return returnPromise(
                'deletePlayer', docClient, docClient.deleteItem, awsParams);
};

export function addMessage (
        docClient: DOC.DynamoDB,
        messagesTableName: string,
        messageState: DBTypes.AddMessageParams)
{
        // Log.debug('Storing message dynamo', messageState);

        const resultMap = (data: any) => {
                // Log.debug('Stored message dynamo', data);
                return messageState;
        };

        var awsParams: DOC.PutItemParams = {
                Item: messageState,
                TableName: messagesTableName,
                ReturnValues: 'NONE',
        };

        return returnPromise(
                'addMessage',
                docClient,
                docClient.putItem,
                awsParams,
                resultMap);
};

export function updateMessage (
        docClient: DOC.DynamoDB,
        messagesTableName: string,
        messageState: DBTypes.UpdateMessageParams)
{
        // Log.debug('Updating message dynamo', messageState);

        const resultMap = (data: any) => {
                // Log.debug('Updated message dynamo', data);
                return messageState;
        };

        var awsParams = {
                Item: messageState,
                TableName: messagesTableName,
                ReturnValues: 'NONE',
        };

        return returnPromise(
                'updateMessage',
                docClient,
                docClient.putItem,
                awsParams,
                resultMap);
};

export function getMessage (
        docClient: DOC.DynamoDB,
        messagesTableName: string,
        id: DBTypes.GetMessageParams)
{
        var awsParams = {
                Key: {
                        id: id,
                },
                TableName: messagesTableName,
        };

        return returnPromise(
                'getMessage',
                docClient,
                docClient.getItem,
                awsParams,
                extractItem);
};

export function getMessages (
        docClient: DOC.DynamoDB,
        messagesTableName: string,
        params: DBTypes.GetMessagesParams)
{
        const resultMap = (data: { Items: Message.MessageState[]; LastEvaluatedKey: { id: string;} }) => {
                let result: DBTypes.GetMessagesResult = {
                        messages: data.Items,
                        lastEvaluatedKey: null,
                };
                var lastEvaluatedKey = data ? data.LastEvaluatedKey : null;
                result.lastEvaluatedKey = lastEvaluatedKey ?
                        lastEvaluatedKey.id : null;

                return result;
        };

        let awsParams: any = {
                Limit : params.maxResults,
                TableName: messagesTableName,
        };

        if (params.exclusiveStartKey !== null) {
                awsParams.ExclusiveStartKey = {
                        id: params.exclusiveStartKey,
                };
        }

        return returnPromise(
                'getMessages', docClient, docClient.scan, awsParams, resultMap);
};

export function deleteMessage (
        docClient: DOC.DynamoDB,
        messagesTableName: string,
        id: DBTypes.DeleteMessageParams)
{
        var awsParams= {
                Key: {
                        id: id,
                },
                TableName: messagesTableName,
                ReturnValues: 'ALL_OLD',
        };

        return returnPromise(
                'deleteMessage',
                docClient,
                docClient.deleteItem,
                awsParams,
                extractAttributes);
};

export function deleteAllMessages (
        docClient: DOC.DynamoDB,
        messagesTableName: string,
        email: DBTypes.DeleteAllMessagesParams)
{
        return (queryByEmail(
                        email,
                        messagesTableName,
                        'email-index',
                        docClient)
        ).then(data =>
                (data.Items.length) ?
                        deleteById(
                                messagesTableName,
                                docClient,
                                data) :
                        null
        );
};

export function getPlayer (
        docClient: DOC.DynamoDB,
        playersTableName: string,
        email: DBTypes.GetPlayerParams)
{
        var awsParams = {
                Key: {
                        email: email,
                },
                TableName: playersTableName,
        };

        return returnPromise(
                'getPlayer',
                docClient,
                docClient.getItem,
                awsParams,
                extractItem);
};

export function extractAttributes<T> (data: { Attributes: T })
{
        return data ? data.Attributes : null;
}

export function extractItem<T> (data: { Item: T })
{
        return data ? data.Item : null;
}

export interface QueryByEmailData {
        Items: {
                email: string;
                id: number;
        }[];
}

export function queryByEmail (
        email: string,
        tableName: string,
        indexName: string,
        docClient: DOC.DynamoDB): Promise<QueryByEmailData>
{
        var queryParams = {
                IndexName: indexName,
                KeyConditions: [
                        docClient.Condition('email', 'EQ', email)
                ],
                TableName: tableName,
        };

        return returnPromise(
                'queryByEmail', docClient, docClient.query, queryParams);
}

export function deleteById (
        tableName: string,
        docClient: DOC.DynamoDB,
        emailQueryData: QueryByEmailData)
{
        var requestItems: Map.Map<any[]> = {};
        var deleteRequests = emailQueryData.Items.map(function (item)
                {
                        return {
                                DeleteRequest: {
                                        Key: {
                                                id: item.id,
                                        }
                                }
                        };
                });
        requestItems[tableName] = deleteRequests;

        var queryParams = {
                RequestItems: requestItems,
        };

        return returnPromise(
                'deleteById', docClient, docClient.batchWriteItem, queryParams);
}
