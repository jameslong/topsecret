import App = require('../app');
import Demo = require('./demo');
import Main = require('../../../../core/src/app/main');
import Message = require('../../../../core/src/app/message');
import PostHandler = require('./posthandler');
import Promises = require('../../../../core/src/app/promises');
import Reply = require('./reply');
import Request = require('../../../../core/src/app/requesttypes');
import Str = require('../../../../core/src/app/utils/string');
import State = require('../../../../core/src/app/state');

export function handleCareersEmail (
        state: App.State,
        reply: Reply.Reply)
{
        var defaultNarrativeGroup =
                state.config.content.defaultNarrativeGroup;
        var groupData = App.getGroupData(state.app, defaultNarrativeGroup);

        var email = reply.from;
        var subject = reply.subject;
        var body = reply.body;

        var resignationLetter = Str.contains(reply.subject, 'resign');

        if (resignationLetter) {
                return handleResignation(
                        state,
                        groupData,
                        email);
        } else {
                var playerData = extractPlayerData(body);

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
        const domain = app.emailDomain;

        return Promises.resign(
                messageName, email, domain, groupData, promises);
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
        const threadStartName: string = null    ;
        const data = Main.createPlayerlessMessageData(
                groupData,
                email,
                messageName,
                threadStartName,
                app.emailDomain);
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
