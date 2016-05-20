/// <reference path="../typings/chai-as-promised/chai-as-promised.d.ts"/>
/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/es6-polyfill/es6-polyfill.d.ts" />

import Promises = require('../core/src/app/promises');
import TestHelpers = require('./helpers');

import Chai = require('chai');
import ChaiAsPromised = require('chai-as-promised');
Chai.use(ChaiAsPromised);

describe('Promises', function () {
        describe('beginGame', function () {
                it('should resolve without error', function () {
                        return TestHelpers.testGameData().then(groupData => {
                                const player = TestHelpers.createPlayer0();
                                const promises = TestHelpers.createPromises();
                                const timestampMs = Date.now();

                                return Promises.beginGame(
                                        'begingame',
                                        player,
                                        'testmail.playtopsecret.com',
                                        timestampMs,
                                        groupData,
                                        promises);
                        });
                })
        });

        describe('endGame', function () {
                it('should resolve without error', function () {
                        const player = TestHelpers.createPlayer0();
                        const promises = TestHelpers.createPromises();
                        return promises.addPlayer(player).then(player =>
                                Promises.endGame(player.email, promises));
                })
        });

        describe('resign', function () {
                it('should resolve without error', function () {
                        const player = TestHelpers.createPlayer0();
                        const promises = TestHelpers.createPromises();

                        return promises.addPlayer(player).then(player =>
                                TestHelpers.testGameData()
                        ).then(groupData => {
                                return Promises.resign(
                                        'resign',
                                        player.email,
                                        'testmail.playtopsecret.com',
                                        groupData,
                                        promises);
                        });
                })
        });

        describe('child', function () {
                it('should resolve without error', function () {
                        const player = TestHelpers.createPlayer0();
                        const promises = TestHelpers.createPromises();
                        const childIndex = 0;
                        const domain = 'testmail.playtopsecret.com';
                        const timestampMs = Date.now();

                        return TestHelpers.testGameData().then(groupData => {
                                const message = TestHelpers.createMessage(
                                        'children_expired',
                                        player.email,
                                        groupData);
                                const state = { player, message, timestampMs };
                                return Promises.child(
                                        state,
                                        childIndex,
                                        domain,
                                        groupData,
                                        promises)
                        });
                })
        });

        describe('reply', function () {
                it('should resolve without error', function () {
                        const player = TestHelpers.createPlayer0();
                        const promises = TestHelpers.createPromises();
                        const domain = 'testmail.playtopsecret.com';
                        const replyIndex = 0;
                        const timestampMs = Date.now();

                        return TestHelpers.testGameData().then(groupData => {
                                const message = TestHelpers.createMessage(
                                        'reply_expired',
                                        player.email,
                                        groupData);
                                message.reply = {
                                        timestampMs: 0,
                                        index: replyIndex,
                                        sent: [],
                                };
                                const state = { player, message, timestampMs };

                                return Promises.reply(
                                        state,
                                        replyIndex,
                                        domain,
                                        groupData,
                                        promises)
                        });
                })
        });
});
