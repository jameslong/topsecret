import App = require('../app');
import Demo = require('./demo');
import Main = require('../../../core/src/app/main');
import Message = require('../../../core/src/app/message');
import PostHandler = require('./posthandler');
import Promises = require('../../../core/src/app/promises');
import Request = require('../../../core/src/app/requesttypes');
import Str = require('../../../core/src/app/utils/string');
import State = require('../../../core/src/app/state');

export function handleCareersEmail (
        state: App.State,
        reply: Message.MailgunReply)
{
        var defaultNarrativeGroup =
                state.config.content.defaultNarrativeGroup;
        var groupData = App.getGroupData(state.app, defaultNarrativeGroup);

        var email = reply.from;
        var subject = reply.subject;
        var strippedBody = reply.strippedBody;

        var resignationLetter = Str.contains(reply.subject, 'resign');

        if (resignationLetter) {
                return handleResignation(
                        state,
                        groupData,
                        email);
        } else {
                var playerData = extractPlayerData(strippedBody);

                return playerData  ?
                        handleValidApplication(
                                state,
                                groupData,
                                email,
                                playerData) :
                        handleInvalidApplication(
                                state,
                                groupData,
                                email);
        }
}

export function handleResignation (
        state: App.State,
        groupData: State.GameData,
        email: string)
{
        const app = state.app;
        const promises = app.promises;

        const messageName = state.config.content.resignationThread;

        return Promises.resign(messageName, email, groupData, promises);
}

export function handleValidApplication (
        state: App.State,
        groupData: State.GameData,
        email: string,
        playerData: PlayerApplicationData)
{
        var config = state.config;

        var initialThreadMessage = playerData.usePGP ?
                config.content.validApplicationThreadPGP :
                config.content.validApplicationThread;

        return Demo.beginDemo(
                state,
                groupData,
                email,
                playerData,
                initialThreadMessage);
}

export function handleInvalidApplication (
        state: App.State,
        groupData: State.GameData,
        email: string)
{
        const app = state.app;
        const messageName = state.config.content.invalidApplicationThread;
        const threadStartName: string = null;
        const inReplyToId: string = null;
        const data = Main.createPlayerlessMessageData(
                groupData,
                email,
                messageName,
                threadStartName,
                inReplyToId);
        return app.promises.send(data);
}

export function isCareersEmail (to: string): boolean
{
        return (to.toLowerCase().indexOf('careers') !== -1);
}

export interface PlayerApplicationData {
        firstName: string;
        lastName: string;
        usePGP: boolean;
        utcOffset: number;
}

export function extractPlayerData (applicationText: string)
        : PlayerApplicationData
{
        const firstNameLabel = 'First Name:';
        const lastNameLabel = 'Last Name:';
        const pgpLabel = 'Use PGP Encryption (Y/N):';
        const timezoneLabel = 'UTC offset (hours):';

        const firstName = extractFormField(applicationText, firstNameLabel);
        const lastName = extractFormField(applicationText, lastNameLabel);
        const pgp = extractFormField(applicationText, pgpLabel);
        const usePGP = (pgp && pgp.toLowerCase().indexOf('y') !== -1);
        const timeOffset = extractFormField(applicationText, timezoneLabel);
        const validOffset = timeOffset && !isNaN(<number><any>timeOffset);
        const utcOffset = parseInt(timeOffset) || 0;

        return (firstName && lastName && pgp && validOffset) ?
                {
                        firstName,
                        lastName,
                        usePGP,
                        utcOffset,
                } :
                null;
}

export function extractFormField (text: string, label: string): string
{
        const lines = Str.splitByLines(text);
        const matches = lines.filter(line => Str.beginsWith(line, label));

        return (matches.length > 0) ?
                (matches[0].substring(label.length).trim() || null) :
                null;
}
