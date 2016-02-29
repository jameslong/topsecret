import Arr = require('./utils/array');
import DBHelpers = require('./dbhelpers');
import DBTypes = require('./dbtypes');
import Kbpgp = require('./kbpgp');
import Log = require('./log/log');
import Map = require('./utils/map');
import Message = require('./message');
import MessageHelpers = require('./messagehelpers');
import Player = require('./player');
import Profile = require('./profile');
import Request = require('./requesttypes');

import Main = require('./main');

export interface GameData {
        name: string;
        keyManagers: Kbpgp.KeyManagers
        profiles: Map.Map<Profile.Profile>;
        threadData: Map.Map<Message.ThreadMessage>;
        strings: Map.Map<string>;
}

export interface State {
        emailDomain: string;
        timeFactor: number;
        immediateReplies: boolean;
        data: Map.Map<GameData>;
        send: (
                data: Message.MessageData,
                callback: Request.Callback<string>) => void;
        db: DBTypes.DBCalls;
}

export function update (
        app: State,
        timestampMs: number,
        messageState: Message.MessageState,
        callback: (error: Request.Error) => void)
{
        // Log.debug('update message: ', messageState);

        var groupName = MessageHelpers.getMessageGroup(messageState);
        var groupData = getGroupData(app, groupName);

        var threadData = groupData.threadData;
        var timeFactor = app.timeFactor;
        var immediateReplies = app.immediateReplies;

        if (isExpired(threadData, messageState)) {
                Log.debug('Message expired');
                handleExpiredMessage(app, groupData, messageState, callback);
        } else {
                var pendingChildren = generatePendingChildren(
                        groupData,
                        messageState,
                        timestampMs,
                        timeFactor,
                        immediateReplies);
                var pendingChild = (pendingChildren.length ? pendingChildren[0] : null);

                if (pendingChild) {
                        Log.debug('Sending child');
                        sendPendingMessage(
                                app, groupData, pendingChild, callback);
                } else {
                        var pendingResponse = generatePendingResponse(
                                groupData,
                                messageState,
                                timestampMs,
                                timeFactor,
                                immediateReplies);

                        if (pendingResponse) {
                                Log.debug('Sending response');
                                sendPendingMessage(
                                        app,
                                        groupData,
                                        pendingResponse,
                                        callback);
                        } else {
                                Log.debug('Nothing sent');
                                callback(null);
                        }

                }
        }
}

export function isExpired (
        threadData: Map.Map<Message.ThreadMessage>,
        messageState: Message.MessageState): boolean
{
        var messageName = messageState.name;
        var threadMessage = threadData[messageName];

        var childrenSent = Arr.arrayEvery(
                messageState.childrenSent, (sent) => sent === true);
        var replySent = (messageState.replySent || !threadMessage.fallback);

        return (childrenSent && replySent);
}

export function handleExpiredMessage (
        app: State,
        groupData: GameData,
        messageState: Message.MessageState,
        callback: Request.Callback<Message.MessageState>)
{
        var messageName = messageState.name;
        var db = app.db;
        var threadMessage = groupData.threadData[messageName];

        if (threadMessage.endGame) {
                Log.debug('Ending game', messageState.email);
                var removePlayerFn = db.removePlayer;
                var deleteAllMessagesFn = db.deleteAllMessages;
                endDemo(
                        messageState.email,
                        removePlayerFn,
                        deleteAllMessagesFn,
                        callback);
        } else {
                Log.debug('Deleting message', messageState);
                var deleteMessageFn = db.deleteMessage;
                DBHelpers.deleteMessage(
                        deleteMessageFn, messageState, callback);
        }
}

export function deleteMessages (
        app: State, messageStates: Message.MessageState[])
{
        var deleteMessageFn = app.db.deleteMessage;
        var onDelete = (error: Request.Error, data: Message.MessageState) => {
                Log.debug('messageDeleted', {
                                playerEmail: data.email,
                                messageId: data.messageId,
                                name: data.name,
                                error: error,
                        });
        };
        messageStates.forEach((messageState) => DBHelpers.deleteMessage(
                deleteMessageFn, messageState, onDelete));
}

export function generatePendingChildren (
        groupData: GameData,
        messageState: Message.MessageState,
        timestampMs: number,
        timeFactor: number,
        immediateReplies: boolean)
        : Message.PendingMessage[]
{
        var messageName = messageState.name;
        var threadMessage = groupData.threadData[messageName];
        var children = threadMessage.children;
        const threadStartName = messageState.threadStartName;

        var childrenSent = messageState.childrenSent;
        var playerEmail = messageState.email;
        var parentId = messageState.messageId;

        var timeDelayMs =
                ((timestampMs - messageState.sentTimestampMs) * timeFactor);

        return Arr.mapTruthy(children,
                (child, index) =>
                        generatePendingChild(
                                playerEmail,
                                parentId,
                                childrenSent,
                                timeDelayMs,
                                child,
                                index,
                                threadStartName,
                                immediateReplies));
}

export function generatePendingChild (
        playerEmail: string,
        parentId: string,
        childrenSent: boolean[],
        timeDelayMs: number,
        child: Message.ThreadDelay,
        childIndex: number,
        threadStartName: string,
        immediateReplies: boolean): Message.PendingMessage
{
        var result: Message.PendingMessage = null;

        if (!childrenSent[childIndex]) {
                var expired = (immediateReplies ||
                        isExpiredThreadDelay(child, timeDelayMs));

                if (expired) {
                        result = generatePendingMessage(
                                child.name,
                                playerEmail,
                                parentId,
                                childIndex,
                                threadStartName);
                }
        }

        return result;
}

export function isExpiredThreadDelay (
        threadDelay: Message.ThreadDelay, delayMs: number): boolean
{
        var requiredDelayMs = (threadDelay.delayMins * 1000 * 60);
        return (delayMs > requiredDelayMs);
}

export function generatePendingResponse (
        groupData: GameData,
        messageState: Message.MessageState,
        timestampMs: number,
        timeFactor: number,
        immediateReplies: boolean)
        : Message.PendingMessage
{
        var result: Message.PendingMessage = null;

        if (!messageState.replySent) {
                var messageName = messageState.name;
                var threadMessage = groupData.threadData[messageName];

                var playerEmail = messageState.email;
                var parentId = messageState.messageId;
                var childIndex: number = null;
                var reply = messageState.reply;

                var timeDelayMs = (timestampMs - messageState.sentTimestampMs);
                timeDelayMs *= timeFactor;

                const threadStartName = messageState.threadStartName;

                if (reply) {
                        var replyIndex = reply.replyIndex;
                        var replyDelay = MessageHelpers.getReplyDelay(
                                replyIndex, threadMessage);

                        result = generatePendingThreadDelay(
                                replyDelay,
                                playerEmail,
                                parentId,
                                childIndex,
                                threadStartName,
                                timeDelayMs,
                                immediateReplies);
                } else if (threadMessage.fallback) {
                        var immediateFallback = false;
                        if (!threadMessage.replyOptions) {
                                immediateFallback = immediateReplies;
                        }

                        var fallback = threadMessage.fallback;
                        result = generatePendingThreadDelay(
                                fallback,
                                playerEmail,
                                parentId,
                                childIndex,
                                threadStartName,
                                timeDelayMs,
                                immediateFallback);
                }
        }

        return result;
}

export function generatePendingThreadDelay (
        threadDelay: Message.ThreadDelay,
        playerEmail: string,
        parentId: string,
        childIndex: number,
        threadStartName: string,
        timeDelayMs: number,
        immediateExpiry: boolean): Message.PendingMessage
{
        var result: Message.PendingMessage = null;

        var expired = (immediateExpiry ||
                isExpiredThreadDelay(threadDelay, timeDelayMs));
        if (expired) {
                result = generatePendingMessage(
                        threadDelay.name,
                        playerEmail,
                        parentId,
                        childIndex,
                        threadStartName);
        }

        return result;
}

export function generatePendingMessage (
        name: string,
        playerEmail: string,
        parentId: string,
        childIndex: number,
        threadStartName: string): Message.PendingMessage
{
        return {
                name: name,
                playerEmail: playerEmail,
                parentId: parentId,
                childIndex: childIndex,
                threadStartName: threadStartName,
        };
}

export function sendPendingMessageWithoutPlayer (
        app: State,
        groupData: GameData,
        pendingMessage: Message.PendingMessage,
        callback: Request.Callback<string>)
{
        var vars: Player.PlayerVars = null;

        var messageData = MessageHelpers.createMessageData(
                groupData.threadData,
                pendingMessage.name,
                pendingMessage.threadStartName,
                pendingMessage.playerEmail,
                app.emailDomain,
                groupData.profiles,
                groupData.strings,
                vars);

        var onSend = (
                        error: Request.Error,
                        sendData: Message.SentMessageData) =>
        {
                var messageId = (sendData ? sendData.id : null);
                callback(error, messageId);
        };

        sendMessage(app, messageData, pendingMessage, onSend);
}

export function sendPendingMessage (
        app: State,
        groupData: GameData,
        pendingMessage: Message.PendingMessage,
        callback: Request.Callback<Message.MessageState>)
{
        var db = app.db;

        var getPlayerStateLocal = function (
                        email: string,
                        callback: Request.GetPlayerStateCallback)
                {
                        DBHelpers.getPlayerState(db.getPlayerState, email, callback);
                };

        var onPlayerState = (
                        playerState: Player.PlayerState,
                        callback: Request.MarkReplySentCallback) =>
                {
                        if (playerState) {
                                onNewMessage(
                                        app,
                                        groupData,
                                        pendingMessage,
                                        playerState,
                                        callback);
                        }
                }

        var seq = Request.seq2(
                getPlayerStateLocal,
                onPlayerState);

        seq(pendingMessage.playerEmail, callback);
}

export function deletePlayerlessMessage (
        app: State,
        messageState: Message.MessageState,
        callback: Request.MarkReplySentCallback)
{
        var db = app.db;
        DBHelpers.deleteMessage(
                db.deleteMessage,
                messageState,
                callback);
}

export function onNewMessage (
        app: State,
        groupData: GameData,
        pendingMessage: Message.PendingMessage,
        playerState: Player.PlayerState,
        callback: Request.MarkReplySentCallback)
{
        var threadMessage = groupData.threadData[pendingMessage.name];
        if (threadMessage.message) {
                onNewFullMessage(
                        app,
                        groupData,
                        pendingMessage,
                        playerState,
                        callback);
        } else {
                onNewEmptyMessage(
                        app,
                        groupData,
                        pendingMessage,
                        playerState,
                        callback);
        }
}

export function onNewFullMessage (
        app: State,
        groupData: GameData,
        pendingMessage: Message.PendingMessage,
        playerState: Player.PlayerState,
        callback: Request.MarkReplySentCallback)
{
        var db = app.db;

        var encryptMessageLocal = function (
                        playerState: Player.PlayerState,
                        callback: Request.Callback<Message.MessageData>)
                {
                        createAndEncrypt(
                                app,
                                groupData,
                                playerState,
                                pendingMessage,
                                callback);
                };

        var sendMessageLocal = function (
                        messageData: Message.MessageData,
                        callback: Request.Callback<Message.SentMessageData>)
                {
                        sendMessage(app, messageData, pendingMessage, callback);
                };

        var createAndStoreMessageLocal = function (
                        sentData: Message.SentMessageData,
                        callback: Request.Callback<Message.MessageState>)
                {
                        createAndStoreMessage(
                                app,
                                groupData,
                                sentData.playerEmail,
                                sentData.id,
                                sentData.name,
                                pendingMessage.threadStartName,
                                callback);
                };

        var markParentSentLocal = function (
                        messageState: Message.MessageState,
                        callback: Request.MarkReplySentCallback)
                {
                        var parentId = pendingMessage.parentId;
                        if (parentId) {
                                var childIndex = pendingMessage.childIndex;
                                if (childIndex === null) {
                                        DBHelpers.markReplySent(
                                                db.markReplySent,
                                                parentId,
                                                callback);
                                } else {
                                        DBHelpers.markChildSent(
                                                db.markChildSent,
                                                parentId,
                                                childIndex,
                                                callback);
                                }
                        } else {
                                callback(null, messageState);
                        }
                };

        var seq = Request.seq4(
                encryptMessageLocal,
                sendMessageLocal,
                createAndStoreMessageLocal,
                markParentSentLocal);

        seq(playerState, callback);
}

export function onNewEmptyMessage (
        app: State,
        groupData: GameData,
        pendingMessage: Message.PendingMessage,
        playerState: Player.PlayerState,
        callback: Request.MarkReplySentCallback)
{
        var db = app.db;

        var getMessageIdLocal = function (
                        email: string,
                        callback: Request.GetMessageUIDCallback)
                {
                        var getMessageIdFn = db.getMessageUID;
                        DBHelpers.getMessageId(getMessageIdFn, email, callback);
                };

        var storeEmptyMessageIdLocal = function (
                        messageId: string,
                        callback: Request.Callback<string>)
                {
                        var storeCallback = (
                                error: Request.Error,
                                data: Player.PlayerState) =>
                        {
                                callback(error, messageId);
                        };

                        var threadData = groupData.threadData;
                        var threadMessage = threadData[pendingMessage.name];
                        var profileName = threadMessage.receiver;
                        var storeEmptyMessageIdFn = db.storeEmptyMessageId;
                        DBHelpers.storeEmptyMessageId(
                                storeEmptyMessageIdFn,
                                pendingMessage.playerEmail,
                                messageId,
                                profileName,
                                storeCallback);
                };

        var createAndStoreMessageLocal = function (
                        messageId: string,
                        callback: Request.Callback<Message.MessageState>)
                {
                        createAndStoreMessage(
                                app,
                                groupData,
                                pendingMessage.playerEmail,
                                messageId,
                                pendingMessage.name,
                                pendingMessage.threadStartName,
                                callback);
                };

        var markParentSentLocal = function (
                        messageState: Message.MessageState,
                        callback: Request.MarkReplySentCallback)
                {
                        var parentId = pendingMessage.parentId;
                        if (parentId) {
                                var childIndex = pendingMessage.childIndex;
                                if (childIndex === null) {
                                        DBHelpers.markReplySent(
                                                db.markReplySent,
                                                parentId,
                                                callback);
                                } else {
                                        DBHelpers.markChildSent(
                                                db.markChildSent,
                                                parentId,
                                                childIndex,
                                                callback);
                                }
                        } else {
                                callback(null, messageState);
                        }
                };

        var seq = Request.seq4(
                getMessageIdLocal,
                storeEmptyMessageIdLocal,
                createAndStoreMessageLocal,
                markParentSentLocal);

        seq(pendingMessage.playerEmail, callback);
}

export function createAndEncrypt (
        app: State,
        groupData: GameData,
        playerState: Player.PlayerState,
        pendingMessage: Message.PendingMessage,
        callback: Request.Callback<Message.MessageData>)
{
        var threadMessageName = pendingMessage.name;
        var threadMessage = groupData.threadData[threadMessageName];
        var playerEmail = playerState.email;
        var domain = app.emailDomain;
        var profiles = groupData.profiles;
        const strings = groupData.strings;
        var vars = playerState.vars;
        var publicKey = playerState.publicKey;

        var keyManager = groupData.keyManagers[threadMessage.message.from];
        var messageData = MessageHelpers.createMessageData(
                groupData.threadData,
                pendingMessage.name,
                pendingMessage.threadStartName,
                playerEmail,
                domain,
                profiles,
                strings,
                vars);

        var plaintext = messageData.body;

        if (publicKey && threadMessage.encrypted) {
                Kbpgp.encryptMessage(
                        keyManager,
                        plaintext,
                        publicKey,
                        (ciphertext: string) =>
                                {
                                        messageData.body = ciphertext;
                                        callback(null, messageData);
                                });
        } else {
                callback(null, messageData);
        }
}

export function sendMessage (
        app: State,
        messageData: Message.MessageData,
        pendingMessage: Message.PendingMessage,
        callback: Request.Callback<Message.SentMessageData>)
{
        var onSend = (error: Request.Error, messageId: string) => {
                if (!error) {
                        Log.info('messageSent', {
                                        id: messageId,
                                        threadMessageName: messageData.name,
                                        from: messageData.from,
                                        to: messageData.to,
                                        subject: messageData.subject,
                                        body: messageData.body,
                                });
                } else {
                        Log.info('messageFailedToSend', {
                                        threadMessageName: messageData.name,
                                        from: messageData.from,
                                        to: messageData.to,
                                        subject: messageData.subject,
                                        body: messageData.body,
                                        error: error,
                                });
                }

                var sentData = {
                        name: messageData.name,
                        playerEmail: messageData.playerEmail,
                        id: messageId,
                        parentId: pendingMessage.parentId,
                        childIndex: pendingMessage.childIndex,
                        threadStartName: pendingMessage.threadStartName,
                };
                callback(error, sentData);
        };

        app.send(messageData, onSend);
}

export function createAndStoreMessage (
        app: State,
        groupData: GameData,
        playerEmail: string,
        messageId: string,
        name: string,
        threadStartName: string,
        callback: Request.Callback<Message.MessageState>)
{
        var newThreadMessage = groupData.threadData[name];
        var numberOfChildren = newThreadMessage.children.length;
        const newThreadStartName = newThreadMessage.threadSubject ?
                newThreadMessage.name : threadStartName;

        var messageState = MessageHelpers.createMessageState(
                playerEmail,
                groupData.name,
                messageId,
                name,
                newThreadStartName,
                numberOfChildren);
        messageState.sentTimestampMs = Date.now();

        var newCallback = (error: Request.Error, messageState: Message.MessageState) => {
                Log.debug('Stored: ', messageState);
                callback(error, messageState);
        };

        Log.debug('Storing...:', messageState);

        var db = app.db;
        DBHelpers.storeMessage(db.storeMessage, messageState, newCallback);
}

export function endDemo (
        email: string,
        removePlayerRequestFn: Request.RemovePlayerRequest,
        deleteAllMessagesRequestFn: Request.DeleteAllMessagesRequest,
        callback: Request.Callback<any>)
{
        var onEnd = (error: Request.Error, data: any) => {
                if (!error) {
                        Log.info('endDemo', {
                                        playerEmail: email,
                                });
                }
                callback(error, data);
        };

        var endGameLocal = function (
                        email: string,
                        callback: Request.Callback<any>)
                {
                        DBHelpers.deleteAllMessages(
                                email, deleteAllMessagesRequestFn, callback);
                };

        var removePlayerLocal = function (
                        params: any,
                        callback: Request.RemovePlayerCallback)
                {
                        removePlayerRequestFn({
                                        email: email,
                                }, callback);
                };

        var seq = Request.seq2(endGameLocal, removePlayerLocal);

        seq(email, onEnd);
}

export function getGroupData (app: State, groupName: string)
{
        return app.data[groupName];
}
