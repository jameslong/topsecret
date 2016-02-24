import App = require('../app');
import Demo = require('./demo');
import Message = require('../game/message');
import PostHandler = require('./posthandler');
import Reply = require('./reply');
import Request = require('../game/requesttypes');
import Str = require('../game/utils/string');
import Updater = require('../game/updater');

export function handleCareersEmail (
        state: App.State,
        reply: Reply.Reply,
        res: any)
{
        var defaultNarrativeGroup =
                state.config.content.defaultNarrativeGroup;
        var groupData = App.getGroupData(state.app, defaultNarrativeGroup);

        var email = reply.from;
        var subject = reply.subject;
        var body = reply.body;

        var callback = PostHandler.createRequestCallback(res);

        var resignationLetter = Str.contains(reply.subject, 'resign');

        if (resignationLetter) {
                handleResignation(
                        state,
                        groupData,
                        email,
                        callback);
        } else {
                var playerData = extractPlayerData(body);

                if (playerData) {
                        handleValidApplication(
                                state,
                                groupData,
                                email,
                                playerData,
                                callback);
                } else {
                        handleInvalidApplication(
                                state,
                                groupData,
                                email,
                                callback);
                }
        }
}

export function handleResignation (
        state: App.State,
        groupData: Updater.GameData,
        email: string,
        callback: Request.Callback<any>)
{
        var resignationName = state.config.content.resignationThread;
        var parentId: string = null;
        var childIndex: number = null;
        const threadStartName: string = null;

        var pendingMessage = Updater.generatePendingMessage(
                resignationName,
                email,
                parentId,
                childIndex,
                threadStartName);

        var sendPendingMessageLocal = (
                        pendingMessage: Message.PendingMessage,
                        callback: Request.Callback<Message.MessageState>) =>
                {
                        Updater.sendPendingMessage(
                                state.app, groupData, pendingMessage, callback);
                };

        var endDemoLocal = (
                        messageState: Message.MessageState,
                        callback: Request.Callback<string>) =>
                {
                        var db = state.app.db;
                        Updater.endDemo(email,
                                db.removePlayer,
                                db.deleteAllMessages,
                                callback);
                };

        var seq = Request.seq2(
                sendPendingMessageLocal,
                endDemoLocal);

        seq(pendingMessage, callback);
}

export function handleValidApplication (
        state: App.State,
        groupData: Updater.GameData,
        email: string,
        playerData: PlayerApplicationData,
        callback: Request.Callback<any>)
{
        var config = state.config;

        var initialThreadMessage = playerData.usePGP ?
                config.content.validApplicationThreadPGP :
                config.content.validApplicationThread;

        Demo.beginDemo(
                state,
                groupData,
                email,
                playerData,
                initialThreadMessage,
                callback);
}

export function handleInvalidApplication (
        state: App.State,
        groupData: Updater.GameData,
        email: string,
        callback: Request.Callback<any>)
{
        var invalidName = state.config.content.invalidApplicationThread;

        var parentId: string = null;
        var childIndex: number = null;
        const threadStartName: string = null;

        var pendingMessage = Updater.generatePendingMessage(
                invalidName,
                email,
                parentId,
                childIndex,
                threadStartName);

        Updater.sendPendingMessageWithoutPlayer(
                state.app, groupData, pendingMessage, callback);
}

export function isCareersEmail (to: string): boolean
{
        return (to.toLowerCase().indexOf('careers') !== -1);
}

export interface PlayerApplicationData {
        firstName: string;
        lastName: string;
        usePGP: boolean;
}

export function extractPlayerData (applicationText: string)
        : PlayerApplicationData
{
        var data: PlayerApplicationData = null;
        var firstName: string = null;
        var lastName: string = null;
        var usePGP = false;

        var firstNameLabel = 'First Name:';
        var lastNameLabel = 'Last Name:';
        var pgpLabel = 'Use PGP Encryption (Y/N):';

        firstName = extractFormField(applicationText, firstNameLabel, 0);

        if (firstName) {
                var firstNameIndex = applicationText.indexOf(firstNameLabel);
                lastName = extractFormField(
                        applicationText, lastNameLabel, firstNameIndex);

                if (lastName) {
                        var lastNameIndex = applicationText.indexOf(lastNameLabel);
                        var pgp = extractFormField(
                                applicationText, pgpLabel, lastNameIndex);
                        if (pgp && pgp.toLowerCase().indexOf('y') !== -1) {
                                usePGP = true;
                        }

                }
        }

        if (firstName && lastName) {
                data = {
                        firstName: firstName,
                        lastName: lastName,
                        usePGP: usePGP,
                };
        }

        return data;
}

export function extractFormField (
        text: string, label: string, startIndex: number): string
{
        var value: string = null;

        var labelIndex = text.indexOf(label, startIndex);
        if (labelIndex !== -1) {
                labelIndex += label.length;

                var lineEndIndex = text.indexOf('\n', labelIndex);
                if (lineEndIndex !== -1) {
                        value = text.substring(labelIndex, lineEndIndex);
                        value = value.trim() || null;
                }
        }

        return value;
}
