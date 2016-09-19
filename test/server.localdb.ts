/// <reference path="../typings/chai-as-promised/chai-as-promised.d.ts"/>
/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/es6-polyfill/es6-polyfill.d.ts" />

import Helpers = require('../core/src/utils/helpers');
import TestHelpers = require('./helpers');

import Chai = require('chai');
import ChaiAsPromised = require('chai-as-promised');
Chai.use(ChaiAsPromised);

describe('DB', function () {
        describe('addPlayer', function () {
                it('should return new player', function () {
                        const db = TestHelpers.createDB();
                        const player = TestHelpers.createPlayer0();
                        const promise = db.addPlayer(player);
                        return Chai.assert.eventually.equal(promise, player);
                })
        });

        describe('getPlayer', function () {
                it('should return the player', function () {
                        const db = TestHelpers.createDB();
                        const player = TestHelpers.createPlayer0();
                        const promise = db.addPlayer(player).then(player =>
                                db.getPlayer(player.email)
                        );
                        return Chai.assert.eventually.equal(promise, player);
                })
        });

        describe('updatePlayer', function () {
                it('should return the updated player', function () {
                        const db = TestHelpers.createDB();
                        const player = TestHelpers.createPlayer0();
                        const publicKey = 'asdfadf';
                        const modifiedPlayer = Helpers.assign(
                                player, { publicKey });

                        const promise = db.addPlayer(player).then(player =>
                                db.updatePlayer(modifiedPlayer)
                        ).then(updatedPlayer =>
                                db.getPlayer(player.email)
                        );
                        return Chai.assert.eventually.equal(
                                promise, modifiedPlayer);
                })
        });

        describe('deletePlayer', function () {
                it('should return the deleted player', function () {
                        const db = TestHelpers.createDB();
                        const player = TestHelpers.createPlayer0();
                        const deletePromise = db.addPlayer(player).then(player =>
                                db.deletePlayer(player.email)
                        );
                        const getPromise = deletePromise.then(player =>
                                db.getPlayer(player.email)
                        );
                        return Promise.all([
                                Chai.assert.eventually.equal(deletePromise, player),
                                Chai.assert.eventually.isNull(getPromise),
                        ]);
                })
        });

        describe('addMessage', function () {
                it('should return new message', function () {
                        const db = TestHelpers.createDB();
                        const message = TestHelpers.createMessage0();
                        const promise = db.addMessage(message);
                        return Chai.assert.eventually.equal(promise, message);
                })
        });

        describe('getMessage', function () {
                it('should return the message', function () {
                        const db = TestHelpers.createDB();
                        const message = TestHelpers.createMessage0();
                        const promise = db.addMessage(message).then(message =>
                                db.getMessage(message.id)
                        );
                        return Chai.assert.eventually.equal(promise, message);
                })
        });

        describe('getMessages', function () {
                it('should return second message with exclusive start key', function () {
                        const db = TestHelpers.createDB();
                        const message0 = TestHelpers.createMessage0();
                        const message1 = TestHelpers.createMessage1();

                        const exclusiveStartKey = message0.id;
                        const maxResults = 1;

                        const promise = db.addMessage(message0).then(message =>
                                db.addMessage(message1)
                        ).then(message =>
                                db.getMessages({exclusiveStartKey, maxResults})
                        );
                        return Chai.assert.eventually.deepEqual(promise, {
                                lastEvaluatedKey: message1.id,
                                messages: [message1]
                        });
                })

                it('should return first message with null start key', function () {
                        const db = TestHelpers.createDB();
                        const message0 = TestHelpers.createMessage0();
                        const message1 = TestHelpers.createMessage1();

                        const exclusiveStartKey: string = null;
                        const maxResults = 1;

                        const promise = db.addMessage(message0).then(message =>
                                db.addMessage(message1)
                        ).then(message =>
                                db.getMessages({exclusiveStartKey, maxResults})
                        );
                        return Chai.assert.eventually.deepEqual(promise, {
                                lastEvaluatedKey: message0.id,
                                messages: [message0]
                        });
                })

                it('should return null lastEvaluatedKey', function () {
                        const db = TestHelpers.createDB();
                        const message0 = TestHelpers.createMessage0();

                        const exclusiveStartKey: string = null;
                        const maxResults = 10;

                        const promise = db.addMessage(message0).then(message =>
                                db.getMessages({exclusiveStartKey, maxResults})
                        );
                        return Chai.assert.eventually.deepEqual(promise, {
                                lastEvaluatedKey: null,
                                messages: [message0]
                        });
                })
        });

        describe('updateMessage', function () {
                it('should return the updated message', function () {
                        const db = TestHelpers.createDB();
                        const message = TestHelpers.createMessage0();
                        const fallbackSent = true;
                        const modifiedMessage = Helpers.assign(
                                message, { fallbackSent });

                        const promise = db.addMessage(message).then(message =>
                                db.updateMessage(modifiedMessage)
                        ).then(updatedMessage =>
                                db.getMessage(message.id)
                        );
                        return Chai.assert.eventually.equal(
                                promise, modifiedMessage);
                })
        });

        describe('deleteMessage', function () {
                it('should return the deleted message', function () {
                        const db = TestHelpers.createDB();
                        const message = TestHelpers.createMessage0();
                        const deletePromise = db.addMessage(message).then(
                                message => db.deleteMessage(message.id)
                        );
                        const getPromise = deletePromise.then(message =>
                                db.getMessage(message.id)
                        );
                        return Promise.all([
                                Chai.assert.eventually.equal(deletePromise, message),
                                Chai.assert.eventually.isNull(getPromise),
                        ]);
                })
        });

        describe('deleteAllMessages', function () {
                it('should delete all the player\'s messages in db', function () {
                        const db = TestHelpers.createDB();
                        const message0 = TestHelpers.createMessage0();
                        const message1 = TestHelpers.createMessage1();
                        const promise = db.addMessage(message0).then(message =>
                                db.addMessage(message1)
                        ).then(message => db.deleteAllMessages(message0.email));
                        const get0Promise = promise.then(message =>
                                db.getMessage(message0.id));
                        const get1Promise = promise.then(message =>
                                db.getMessage(message1.id));
                        return Promise.all([
                                Chai.assert.eventually.isNull(get0Promise),
                                Chai.assert.eventually.isNull(get1Promise),
                        ]);
                })
        });

        describe('addGameKey', function () {
                it('should return the added key', function () {
                        const db = TestHelpers.createDB();
                        const key = TestHelpers.createGameKey();
                        const promise = db.addGameKey(key);
                        return Chai.assert.eventually.equal(promise, key);
                })
        });

        describe('getGameKey', function () {
                it('should return the key', function () {
                        const db = TestHelpers.createDB();
                        const key = TestHelpers.createGameKey();
                        const promise = db.addGameKey(key).then(valid =>
                                db.getGameKey(key.gameKey)
                        );
                        return Chai.assert.eventually.equal(promise, key);
                })
        });
});
