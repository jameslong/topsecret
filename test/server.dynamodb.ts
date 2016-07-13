/// <reference path="../typings/chai-as-promised/chai-as-promised.d.ts"/>
/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/es6-polyfill/es6-polyfill.d.ts" />
/// <reference path='../typings/aws-sdk/aws-sdk.d.ts'/>

import DBTypes = require('../core/src/app/dbtypes');
import Helpers = require('../core/src/app/utils/helpers');
import TestHelpers = require('./helpers');

import Chai = require('chai');
import ChaiAsPromised = require('chai-as-promised');
Chai.use(ChaiAsPromised);

// Load and init AWS
import AWS = require('aws-sdk');
import Config = require('../server/src/config');
import DynamoDB = require('../server/src/dynamodb');

const credentials = Config.loadCredentials('./server').aws;
const config = {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        region: credentials.region,
        playersTableName: 'player-dev',
        messagesTableName: 'message-dev',
};

AWS.config.update(credentials);
const db = DynamoDB.createDynamoDBCalls(config);
const player = TestHelpers.createPlayer0();
const modifiedPlayer = Helpers.assign(player, { utcOffset: 10 });
const message0 = TestHelpers.createMessage0();
const modifiedMessage0 = Helpers.assign(message0, { fallbackSent: true });
const message1 = TestHelpers.createMessage1();

describe('DB', function () {
        describe('addPlayer', function () {
                it('should return new player', function () {
                        const promise = db.addPlayer(player);
                        return Chai.assert.eventually.deepEqual(promise, player);
                })
        });

        describe('getPlayer', function () {
                it('should return the player', function () {
                        const promise = db.getPlayer(player.email);
                        return Chai.assert.eventually.deepEqual(promise, player);
                })
        });

        describe('updatePlayer', function () {
                it('should return the updated player', function () {
                        const promise = db.updatePlayer(modifiedPlayer).then(
                                updatedPlayer => db.getPlayer(player.email)
                        );
                        return Chai.assert.eventually.deepEqual(
                                promise, modifiedPlayer);
                })
        });

        describe('deletePlayer', function () {
                it('should return the deleted player', function () {
                        const deletePromise = db.deletePlayer(player.email);
                        return Chai.assert.eventually.deepEqual(
                                deletePromise, modifiedPlayer);
                })
        });

        describe('addMessage', function () {
                it('should return new message', function () {
                        const promise = db.addMessage(message0);
                        return Chai.assert.eventually.deepEqual(promise, message0);
                })
        });

        describe('getMessage', function () {
                it('should return the message', function () {
                        const promise = db.getMessage(message0.id);
                        return Chai.assert.eventually.deepEqual(promise, message0);
                })
        });

        describe('getMessages', function () {
                it('should return second message with exclusive start key', function () {
                        const exclusiveStartKey = message0.id;
                        const maxResults = 1;

                        const promise = db.addMessage(message1).then(message =>
                                db.getMessages({exclusiveStartKey, maxResults})
                        );
                        return Chai.assert.eventually.deepEqual(promise, {
                                lastEvaluatedKey: message1.id,
                                messages: [message1]
                        });
                })

                it('should return first message with null start key', function () {
                        const exclusiveStartKey: string = null;
                        const maxResults = 1;

                        const promise = db.getMessages(
                                {exclusiveStartKey, maxResults});
                        return Chai.assert.eventually.deepEqual(promise, {
                                lastEvaluatedKey: message0.id,
                                messages: [message0]
                        });
                })

                it('should return null lastEvaluatedKey', function () {
                        const exclusiveStartKey: string = null;
                        const maxResults = 10;

                        const promise = db.getMessages(
                                {exclusiveStartKey, maxResults});
                        return Chai.assert.eventually.deepEqual(promise, {
                                lastEvaluatedKey: null,
                                messages: [message0, message1]
                        });
                })
        });

        describe('updateMessage', function () {
                it('should return the updated message', function () {
                        const fallbackSent = true;
                        const modifiedMessage = Helpers.assign(
                                message0, { fallbackSent });

                        const promise = db.updateMessage(modifiedMessage).then(
                                updatedMessage => db.getMessage(modifiedMessage.id)
                        );
                        return Chai.assert.eventually.deepEqual(
                                promise, modifiedMessage);
                })
        });

        describe('deleteMessage', function () {
                it('should return the deleted message', function () {
                        const deletePromise = db.deleteMessage(message0.id);
                        return Chai.assert.eventually.deepEqual(
                                deletePromise, modifiedMessage0);
                })
        });

        describe('deleteAllMessages', function () {
                it('should delete all the player\'s messages in db', function () {
                        const promise = db.deleteAllMessages(message0.email);
                        const get0Promise = promise.then(message =>
                                db.getMessage(message0.id));
                        const get1Promise = promise.then(message =>
                                db.getMessage(message1.id));
                        return Promise.all([
                                Chai.assert.eventually.isUndefined(get0Promise),
                                Chai.assert.eventually.isUndefined(get1Promise),
                        ]);
                })
        });
});
