import App = require('../app');
import Careers = require('./careers');
import DBHelpers = require('../game/dbhelpers');
import KBPGP = require('../game/kbpgp');
import Log = require('../game/log/log');
import Message = require('../game/message');
import MessageHelpers = require('../game/messagehelpers');
import Player = require('../game/player');
import PostHandler = require('./posthandler');
import Profile = require('../game/profile');
import ReplyOption = require('../game/replyoption');
import Request = require('../game/requesttypes');
import Updater = require('../game/updater');

export function handleReplyRequest (
        state: App.State,
        email: string,
        messageId: string,
        subject: string,
        body: string,
        to: string,
        res: any)
{
        var careersEmail = Careers.isCareersEmail(to);

        var reply = {
                from: email,
                to: to,
                subject: subject,
                body: body,
                messageId: messageId,
                timestampMs: Date.now(),
        };

        Log.info('replyReceived', {
                        from: email,
                        to: to,
                        subject: subject,
                        body: body,
                });

        if (careersEmail) {
                Careers.handleCareersEmail(state, reply, res);
        } else {
                handleGameReplyRequest(state, reply, res);
        }
}

export interface Reply {
        from: string;
        to: string;
        subject: string;
        body: string;
        messageId: string;
        timestampMs: number;
}

export function handleGameReplyRequest (
        state: App.State,
        reply: Reply,
        res: any)
{
        var callback = PostHandler.createRequestCallback(res);
        handleReplyMessage(state, reply, callback);
}

export function handleReplyMessage (
        state: App.State,
        reply: Reply,
        callback: Request.Callback<any>)
{
        var db = state.app.db;

        var getPlayerStateLocal = (
                email: string,
                callback: Request.GetPlayerStateCallback) =>
        {
                DBHelpers.getPlayerState(db.getPlayerState, email, callback);
        };

        var getTargetedMessageLocal = (
                playerState: Player.PlayerState,
                callback: Request.Callback<TargetedMessageData>) =>
        {
                if (playerState) {
                        var targetedCallback = (error: Request.Error,
                                messageState: Message.MessageState) => {
                                callback(error, {
                                                messageState: messageState,
                                                playerState: playerState,
                                        });
                        };

                        getTargetedMessage(
                                state, reply, playerState, targetedCallback);
                } else {
                        callback(null, null);
                }
        };

        var handleTimelyReplyNewLocal = (
                data: TargetedMessageData,
                callback: Request.Callback<Message.MessageState>) =>
        {
                var messageState = (data ? data.messageState : null);
                if (messageState && !messageState.reply) {
                        handleTimelyReply(
                                state,
                                data.playerState,
                                data.messageState,
                                reply,
                                callback);
                } else {
                        callback(null, null);
                }
        };

        var seq = Request.seq3(
                getPlayerStateLocal,
                getTargetedMessageLocal,
                handleTimelyReplyNewLocal);

        seq(reply.from, callback);
}

export interface TargetedMessageData {
        messageState: Message.MessageState;
        playerState: Player.PlayerState;
}

export function getTargetedMessage (
        state: App.State,
        reply: Reply,
        playerState: Player.PlayerState,
        callback: Request.GetMessageCallback)
{
        var db = state.app.db;

        var getMessageStateLocal = function (
                        messageId: string,
                        callback: Request.GetMessageCallback)
                {
                        if (messageId !== null) {
                                DBHelpers.getMessage(
                                        db.getMessage, messageId, callback);
                        } else {
                                callback(null, null);
                        }
                };

        var getUnsolicitedMessageStateLocal = function (
                        messageState: Message.MessageState,
                        callback: Request.GetMessageCallback)
                {
                        var targetable = false;

                        if (messageState) {
                                var version = MessageHelpers.getMessageGroup(messageState);
                                var groupData = App.getGroupData(state.app, version);
                                var threadData = groupData.threadData;
                                targetable = (messageState &&
                                        MessageHelpers.hasReplyOptions(messageState.name, threadData));
                        }

                        if (targetable) {
                                callback(null, messageState);
                        } else {
                                callback(null, null);
                                // TODO - readd support for unsolicited messages (players must store the version they are on)
                                // var profiles = groupData.profiles;
                                // var toProfile = Profile.getProfileByEmail(
                                //         reply.to, profiles);
                                // var emptyMessages = playerState.emptyMessages;
                                // var messageId = emptyMessages[toProfile.name];
                                // DB.getMessage(
                                //         db.getMessage, messageId, callback);
                        }
                };

        var seq = Request.seq2(
                getMessageStateLocal,
                getUnsolicitedMessageStateLocal);
        seq(reply.messageId, callback);
}

export function handleTimelyReply (
        state: App.State,
        playerState: Player.PlayerState,
        messageState: Message.MessageState,
        reply: Reply,
        callback: Request.Callback<any>)
{
        var groupName = MessageHelpers.getMessageGroup(messageState);
        var groupData = App.getGroupData(state.app, groupName);

        var onDecrypt = (error: string, plaintext: string) => {
                if (error) {
                        var awsError: Request.Error = {
                                code: 'DECRYPT ERROR',
                                message: error,
                        };

                        callback(awsError, null);
                } else {
                        handleDecryptedReplyMessage(
                                state,
                                groupData,
                                reply.from,
                                plaintext,
                                reply.timestampMs,
                                messageState,
                                callback);
                }
        };

        if (playerState.publicKey) {
                var profiles = groupData.profiles;
                var profile = Profile.getProfileByEmail(reply.to, profiles);
                var keyManager = groupData.keyManagers[profile.name];

                KBPGP.decryptMessage(keyManager, reply.body, onDecrypt);
        } else {
                onDecrypt(null, reply.body);
        }
}

export function handleDecryptedReplyMessage (
        state: App.State,
        groupData: Updater.GameData,
        playerEmail: string,
        body: string,
        timestampMs: number,
        messageState: Message.MessageState,
        callback: Request.Callback<Message.MessageState>)
{
        const threadMessage = groupData.threadData[messageState.name];
        const replyOptions = threadMessage.replyOptions;
        const replyIndex = ReplyOption.getReplyIndex(body, replyOptions);

        handleSelectedReply(
                state,
                threadMessage,
                playerEmail,
                body,
                timestampMs,
                messageState,
                replyIndex,
                callback);
}

export function handleSelectedReply (
        state: App.State,
        threadMessage: Message.ThreadMessage,
        playerEmail: string,
        body: string,
        timestampMs: number,
        messageState: Message.MessageState,
        replyIndex: number,
        callback: Request.Callback<Message.MessageState>)
{
        const selectedOption = threadMessage.replyOptions[replyIndex];
        const messageId = messageState.messageId;

        switch (selectedOption.type) {
        case ReplyOption.ReplyOptionType.ValidPGPKey:
                const validOption = <ReplyOption.ReplyOptionValidPGPKey>selectedOption;
                handleReplyOptionValidPGPKey(
                        state,
                        playerEmail,
                        body,
                        timestampMs,
                        messageId,
                        replyIndex,
                        callback);
                break;

        default:
                handleReplyOptionDefault(
                        state,
                        timestampMs,
                        messageId,
                        replyIndex,
                        callback);
                break;
        }
}

export function handleReplyOptionDefault (
        state: App.State,
        timestampMs: number,
        messageId: string,
        replyIndex: number,
        callback: Request.Callback<Message.MessageState>)
{
        var storeReplyFn = state.app.db.storeReply;
        DBHelpers.storeReply(
                storeReplyFn, messageId, replyIndex, timestampMs, callback);
}

export function handleReplyOptionValidPGPKey(
        state: App.State,
        playerEmail: string,
        body: string,
        timestampMs: number,
        messageId: string,
        replyIndex: number,
        callback: Request.Callback<Message.MessageState>)
{
        var publicKey = ReplyOption.extractPublicKey(body);

        var storePublicKeyLocal = function (
                data: any,
                callback: Request.Callback<any>)
                {
                        var storePublicKeyFn = state.app.db.storePublicKey;
                        DBHelpers.storePublicKey(
                                storePublicKeyFn,
                                playerEmail,
                                publicKey,
                                callback);
                };

        var storeReplyLocal = function (
                data: any,
                callback: Request.Callback<Message.MessageState>)
                {
                        var storeReplyFn = state.app.db.storeReply;
                        DBHelpers.storeReply(
                                storeReplyFn,
                                messageId,
                                replyIndex,
                                timestampMs,
                                callback);
                };

        var seq = Request.seq2(
                storePublicKeyLocal,
                storeReplyLocal);

        seq(null, callback);
}
