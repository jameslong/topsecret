/// <reference path="../typings/chai-as-promised/chai-as-promised.d.ts"/>
/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/es6-polyfill/es6-polyfill.d.ts" />

import Promises = require('../core/src/promises');
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
                        const timestampMs = Date.now();

                        return TestHelpers.testGameData().then(narrative => {
                                const message = TestHelpers.createMessage(
                                        'children_expired',
                                        player.email,
                                        narrative);
                                const state = {
                                        player,
                                        message,
                                        timestampMs,
                                        narrative,
                                        promises,
                                };
                                return Promises.child(state, childIndex);
                        });
                })
        });

        describe('reply', function () {
                it('should resolve without error', function () {
                        const player = TestHelpers.createPlayer0();
                        const promises = TestHelpers.createPromises();
                        const replyIndex = 0;
                        const timestampMs = Date.now();

                        return TestHelpers.testGameData().then(narrative => {
                                const message = TestHelpers.createMessage(
                                        'reply_expired',
                                        player.email,
                                        narrative);
                                message.reply = {
                                        body: '',
                                        timestampMs: 0,
                                        index: replyIndex,
                                        sent: [],
                                };
                                const state = {
                                        player,
                                        message,
                                        timestampMs,
                                        narrative,
                                        promises,
                                };
                                return Promises.reply(state, replyIndex)
                        });
                })
        });
});
