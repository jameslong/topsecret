/// <reference path='../../typings/aws-sdk/aws-sdk.d.ts'/>
/// <reference path='../../typings/dynamodb-doc/dynamodb-doc.d.ts'/>

import Config = require('./config');
import DynamoDB = require('dynamodb-doc');
import DBTypes = require('../../core/src/dbtypes');
import Func = require('../../core/src/utils/function');
import Log = require('../../core/src/log');
import Map = require('../../core/src/utils/map');
import Message = require('../../core/src/message');
import MessageHelpers = require('../../core/src/messagehelpers');
import Player = require('../../core/src/player');
import Request = require('../../core/src/requesttypes');

import AWS = require('aws-sdk');

type DynamoDoc = DynamoDB.DynamoDB;

function bind<T, U> (
        docClient: DynamoDoc,
        tableName: string,
        requestFn: (
                docClient: DynamoDoc,
                tableName: string,
                params: T) => Promise<U>)
{
        return (params: T) => requestFn(docClient, tableName, params);
}

export function createDynamoDBCalls (config: Config.ConfigState): DBTypes.DBCalls
{
        const credentials = config.credentials;
        const messageTable = config.messagesTableName;
        const playerTable = config.playersTableName;
        const accessKeyId = credentials.awsAccessKeyId;
        const secretAccessKey = credentials.awsSecretAccessKey;
        const region = credentials.awsRegion;
        (<any>AWS.config.update)({ accessKeyId, secretAccessKey, region });
        const doc = <DynamoDoc>(new AWS.DynamoDB.DocumentClient({region}));

        return {
                addPlayer: bind(doc, playerTable, addPlayer),
                getPlayer: bind(doc, playerTable, getPlayer),
                updatePlayer: bind(doc, playerTable, updatePlayer),
                deletePlayer: bind(doc, playerTable, deletePlayer),
                deleteAllMessages: bind(doc, messageTable, deleteAllMessages),
                addMessage: bind(doc, messageTable, addMessage),
                updateMessage: bind(doc, messageTable, updateMessage),
                deleteMessage: bind(doc, messageTable, deleteMessage),
                getMessage: bind(doc, messageTable, getMessage),
                getMessages: bind(doc, messageTable, getMessages),
        };
}

export function promise<T, U, V> (
        request: string,
        docClient: DynamoDoc,
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
        docClient: DynamoDoc,
        playersTableName: string,
        playerState: DBTypes.AddPlayerParams)
{
        const awsParams: DynamoDB.PutParams = {
                Item: playerState,
                TableName: playersTableName,
                ReturnValues: 'NONE',
        };

        return promise(
                'addPlayer',
                docClient,
                docClient.put,
                awsParams,
                () => playerState);
};

export function getPlayer (
        docClient: DynamoDoc,
        playersTableName: string,
        email: DBTypes.GetPlayerParams)
{
        const awsParams: DynamoDB.GetParams = {
                Key: {
                        email,
                },
                TableName: playersTableName,
        };

        return promise(
                'getPlayer',
                docClient,
                docClient.get,
                awsParams,
                extractItem);
};

export function updatePlayer (
        docClient: DynamoDoc,
        playersTableName: string,
        playerState: DBTypes.UpdatePlayerParams)
{
        const awsParams: DynamoDB.PutParams = {
                Item: playerState,
                TableName: playersTableName,
        };

        return promise('updatePlayer', docClient, docClient.put, awsParams);
};

export function deletePlayer (
        docClient: DynamoDoc,
        playersTableName: string,
        email: DBTypes.DeletePlayerParams)
{
        const awsParams: DynamoDB.DeleteParams = {
                Key: { email },
                TableName: playersTableName,
                ReturnValues: 'ALL_OLD',
        };

        return promise(
                'deletePlayer',
                docClient,
                docClient.delete,
                awsParams,
                extractAttributes);
};

export function addMessage (
        docClient: DynamoDoc,
        messagesTableName: string,
        messageState: DBTypes.AddMessageParams)
{
        // Log.debug('Storing message dynamo', messageState);

        const awsParams: DynamoDB.PutParams = {
                Item: messageState,
                TableName: messagesTableName,
                ReturnValues: 'NONE',
        };

        return promise(
                'addMessage',
                docClient,
                docClient.put,
                awsParams,
                () => messageState);
};

export function updateMessage (
        docClient: DynamoDoc,
        messagesTableName: string,
        messageState: DBTypes.UpdateMessageParams)
{
        // Log.debug('Updating message dynamo', messageState);

        const awsParams: DynamoDB.PutParams = {
                Item: messageState,
                TableName: messagesTableName,
                ReturnValues: 'NONE',
        };

        return promise(
                'updateMessage',
                docClient,
                docClient.put,
                awsParams,
                () => messageState);
};

export function getMessage (
        docClient: DynamoDoc,
        messagesTableName: string,
        id: DBTypes.GetMessageParams)
{
        const awsParams: DynamoDB.GetParams = {
                Key: {
                        id: id,
                },
                TableName: messagesTableName,
        };

        return promise(
                'getMessage',
                docClient,
                docClient.get,
                awsParams,
                extractItem);
};

export function getMessages (
        docClient: DynamoDoc,
        messagesTableName: string,
        params: DBTypes.GetMessagesParams)
{
        const resultMap = (data: { Items: Message.MessageState[]; LastEvaluatedKey: { id: string;} }) => {
                let result: DBTypes.GetMessagesResult = {
                        messages: data.Items,
                        lastEvaluatedKey: null,
                };
                const lastEvaluatedKey = data ? data.LastEvaluatedKey : null;
                result.lastEvaluatedKey = lastEvaluatedKey ?
                        lastEvaluatedKey.id : null;

                return result;
        };

        let awsParams: DynamoDB.ScanParams = {
                Limit : params.maxResults,
                TableName: messagesTableName,
        };

        if (params.exclusiveStartKey !== null) {
                awsParams.ExclusiveStartKey = {
                        id: params.exclusiveStartKey,
                };
        }

        return promise(
                'getMessages', docClient, docClient.scan, awsParams, resultMap);
};

export function deleteMessage (
        docClient: DynamoDoc,
        messagesTableName: string,
        id: DBTypes.DeleteMessageParams)
{
        const awsParams: DynamoDB.DeleteParams = {
                Key: {
                        id: id,
                },
                TableName: messagesTableName,
                ReturnValues: 'ALL_OLD',
        };

        return promise(
                'deleteMessage',
                docClient,
                docClient.delete,
                awsParams,
                extractAttributes);
};

export function deleteAllMessages (
        docClient: DynamoDoc,
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
        docClient: DynamoDoc): Promise<QueryByEmailData>
{
        const queryParams = {
                IndexName: indexName,
                KeyConditions: {
                        email: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: [email],
                        },
                },
                TableName: tableName,
        };

        return promise('queryByEmail', docClient, docClient.query, queryParams);
}

export function deleteById (
        tableName: string,
        docClient: DynamoDoc,
        emailQueryData: QueryByEmailData)
{
        const requestItems: Map.Map<any[]> = {};
        const deleteRequests = emailQueryData.Items.map(item => {
                return {
                        DeleteRequest: {
                                Key: { id: item.id }
                        }
                };
        });
        requestItems[tableName] = deleteRequests;

        const queryParams = {
                RequestItems: requestItems,
        };

        return promise(
                'deleteById', docClient, docClient.batchWrite, queryParams);
}
