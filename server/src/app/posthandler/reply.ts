import App = require('../app');
import Careers = require('./careers');
import KBPGP = require('../../../../core/src/app/kbpgp');
import Log = require('../../../../core/src/app/log/log');
import Message = require('../../../../core/src/app/message');
import MessageHelpers = require('../../../../core/src/app/messagehelpers');
import Player = require('../../../../core/src/app/player');
import PostHandler = require('./posthandler');
import Profile = require('../../../../core/src/app/profile');
import ReplyOption = require('../../../../core/src/app/replyoption');
import Request = require('../../../../core/src/app/requesttypes');
import State = require('../../../../core/src/app/state');

export function handleReplyRequest (
        state: App.State,
        email: string,
        messageId: string,
        subject: string,
        body: string,
        to: string)
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
                return Careers.handleCareersEmail(state, reply);
        } else {
                return handleReplyMessage(state, reply);
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

export function handleReplyMessage (state: App.State, reply: Reply)
{
        const promises = state.app.promises;
        const email = reply.from;
        const messageId = reply.messageId;

        return promises.getMessage(messageId).then(message =>
                message && !message.reply ?
                        promises.getPlayer(email).then(player =>
                                handleTimelyReply(
                                        state,
                                        player,
                                        message,
                                        reply)) :
                        null
        );
}

export function handleTimelyReply (
        state: App.State,
        player: Player.PlayerState,
        message: Message.MessageState,
        reply: Reply)
{
        const groupName = MessageHelpers.getMessageGroup(message);
        const groupData = App.getGroupData(state.app, groupName);
        const ciphertext = reply.body;
        const profiles = groupData.profiles;
        const profile = Profile.getProfileByEmail(reply.to, profiles);
        const keyManager = groupData.keyManagers[profile.name];

        const promises = state.app.promises;

        return player.publicKey ?
                KBPGP.decryptVerify(keyManager, ciphertext).then(plaintext =>
                        handleDecryptedReplyMessage(
                                state,
                                groupData,
                                player,
                                plaintext,
                                reply.timestampMs,
                                message)
                ) :
                handleDecryptedReplyMessage(
                        state,
                        groupData,
                        player,
                        ciphertext,
                        reply.timestampMs,
                        message);
}

export function handleDecryptedReplyMessage (
        state: App.State,
        groupData: State.GameData,
        player: Player.PlayerState,
        body: string,
        timestampMs: number,
        messageState: Message.MessageState)
{
        const threadMessage = groupData.threadData[messageState.name];
        const replyOptions = threadMessage.replyOptions;
        const replyIndex = ReplyOption.getReplyIndex(body, replyOptions);

        handleSelectedReply(
                state,
                threadMessage,
                player,
                body,
                timestampMs,
                messageState,
                replyIndex);
}

export function handleSelectedReply (
        state: App.State,
        threadMessage: Message.ThreadMessage,
        player: Player.PlayerState,
        body: string,
        timestampMs: number,
        messageState: Message.MessageState,
        replyIndex: number)
{
        const selectedOption = threadMessage.replyOptions[replyIndex];
        const messageId = messageState.messageId;

        switch (selectedOption.type) {
        case ReplyOption.ReplyOptionType.ValidPGPKey:
                const validOption = <ReplyOption.ReplyOptionValidPGPKey>selectedOption;
                return handleReplyOptionValidPGPKey(
                        state,
                        player,
                        messageState,
                        body,
                        timestampMs,
                        replyIndex);

        default:
                return handleReplyOptionDefault(
                        state,
                        messageState,
                        timestampMs,
                        replyIndex);
        }
}

export function handleReplyOptionDefault (
        state: App.State,
        message: Message.MessageState,
        timestampMs: number,
        replyIndex: number)
{
        const promises = state.app.promises;

        message.reply.replyIndex = replyIndex;
        message.reply.timestampMs = timestampMs;

        return promises.addMessage(message);
}

export function handleReplyOptionValidPGPKey(
        state: App.State,
        player: Player.PlayerState,
        message: Message.MessageState,
        body: string,
        timestampMs: number,
        replyIndex: number)
{
        const promises = state.app.promises;

        const publicKey = ReplyOption.extractPublicKey(body);
        player.publicKey = publicKey;

        return promises.updatePlayer(player).then(player => {
                message.reply.replyIndex = replyIndex;
                message.reply.timestampMs = timestampMs;

                return promises.updateMessage(message)
        });
}
