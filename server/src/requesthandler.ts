import App = require('./app');
const Auth = require('basic-auth');
import Clock = require('../../core/src/clock');
import Data = require('../../core/src/data');
import DataValidation = require('./datavalidation');
import FileSystem = require('../../core/src/filesystem');
import Helpers = require('../../core/src/utils/helpers');
import Log = require('../../core/src/log');
import Main = require('../../core/src/main');
import Message = require('../../core/src/message');
import Player = require('../../core/src/player');
import Promises = require('../../core/src/promises');
import PromisesReply = require('../../core/src/promisesreply');
import ReplyOption = require('../../core/src/replyoption');
import Server = require('./server');
import State = require('../../core/src/gamestate');
import Str = require('../../core/src/utils/string');

interface RequestHandler { (state: App.State, req: any, res: any): void; }

export function addRequestEndpoints (state: App.State)
{
        const serverState = state.server;
        const app = serverState.app;

        const credentials = state.config.credentials;
        const user = credentials.basicAuthUser;
        const password = credentials.basicAuthPassword;
        const auth = state.config.useBasicAuth ?
                (req: any, res: any, next: any) => {
                        authenticate(user, password, req, res, next);
                } :
                (req: any, res: any, next: any) => {
                        next();
                };
        const authPost = (path: string, handler: RequestHandler) =>
                addAuthPost(app, state, auth, path, handler);
        const post = (path: string, handler: RequestHandler) =>
                addPost(app, state, path, handler);
        const authGet = (path: string, handler: RequestHandler) =>
                addAuthGet(app, state, auth, path, handler);

        app.get('/healthcheck', (req: any, res: any) => res.sendStatus(200));

        post('/reply', reply);
        authPost('/pause', pause);
        authPost('/unpause', unpause);

        // Debug only
        authPost('/localreply', localReply);
        authPost('/begindemo', beginDemo);
        authPost('/enddemo', endDemo);
        authPost('/addplayer', addPlayer);
        authPost('/removeplayer', deletePlayer);

        // Author only
        authPost('/loadmessage', loadMessage);
        authPost('/savemessage', saveMessage);
        authPost('/deletemessage', deleteMessage);
        authPost('/savereplyoption', saveReplyOption);
        authPost('/deletereplyoption', deleteReplyOption);
        authPost('/savestring', saveString);
        authPost('/deletestring', deleteString);
        authGet('/narratives', narratives);
        authGet('/validatedata', validateData);

        const http = serverState.server;
        const port = state.config.port;

        http.listen(port, function ()
                {
                        Log.debug('Listening on *: ' + port);
                });
}

export function authenticate (
        user: string, password: string, req: any, res: any, next: any)
{
        console.log('authenticating request');
        const auth = Auth(req);
        if (!auth || auth.name !== user || auth.pass !== password) {
                res.setHeader('www-authenticate', 'basic realm=authorization required');
                return res.sendStatus(401);
        } else {
                next();
        }
}

export function logHandler (path: string, req: any, res: any, next: any)
{
        Log.debug('Request: ' + path);
        next();
}

export function addGet (
        app: Server.ExpressApp,
        state: App.State,
        path: string,
        handler: (state: App.State, req: any, res: any) => void)
{
        const handlerFn = (req: any, res: any) => handler(state, req, res);
        const log = (req: any, res: any, next: any) =>
                logHandler(path, req, res, next);
        app.get(path, log, handlerFn);
}

export function addAuthGet (
        app: Server.ExpressApp,
        state: App.State,
        auth: Server.RequestHandler,
        path: string,
        handler: (state: App.State, req: any, res: any) => void)
{
        const handlerFn = (req: any, res: any) => handler(state, req, res);
        const log = (req: any, res: any, next: any) =>
                logHandler(path, req, res, next);
        app.get(path, auth, log, handlerFn);
}

export function addPost (
        app: Server.ExpressApp,
        state: App.State,
        path: string,
        handler: (state: App.State, req: any, res: any) => void)
{
        const handlerFn = (req: any, res: any) => handler(state, req, res);
        const log = (req: any, res: any, next: any) =>
                logHandler(path, req, res, next);
        app.post(path, log, handlerFn);
}

export function addAuthPost (
        app: Server.ExpressApp,
        state: App.State,
        auth: Server.RequestHandler,
        path: string,
        handler: (state: App.State, req: any, res: any) => void)
{
        const handlerFn = (req: any, res: any) => handler(state, req, res);
        const log = (req: any, res: any, next: any) =>
                logHandler(path, req, res, next);
        app.post(path, auth, log, handlerFn);
}

export function beginDemo (state: App.State, req: any, res: any)
{
        const body: {
                        email: string;
                        firstName: string;
                        lastName: string;
                        messageName: string;
                        narrativeName: string;
                        utcOffset: number;
                } = req.body;

        Log.metric({
                type: 'BEGIN_GAME',
                playerEmail: body.email,
                firstName: body.firstName,
                lastName: body.lastName,
                messageName: body.messageName,
                narrativeName: body.narrativeName,
                utcOffset: body.utcOffset,
        });

        const email = body.email;
        const firstName = body.firstName;
        const lastName = body.lastName;
        const newMessageName = body.messageName;
        const narrativeName = body.narrativeName;
        const utcOffset = body.utcOffset;

        const playerData = {
                firstName: firstName,
                lastName: lastName,
                usePGP: false,
                utcOffset,
                key: '',
        };

        const groupData = App.getGroupData(state.game, narrativeName);

        const promise = beginGame(
                state,
                groupData,
                email,
                playerData,
                newMessageName);

        return createRequestCallback(res, promise);
}

export function endDemo (state: App.State, req: any, res: any)
{
        const data: {
                        email: string;
                } = req.body;

        Log.metric({
                type: 'END_GAME',
                playerEmail: data.email,
        });

        const promises = state.game.promises;

        const promise = endGame(state, data.email);
        return createRequestCallback(res, promise);
}

export function addPlayer (state: App.State, req: any, res: any)
{
        const data: {
                email: string;
                publicKey: string;
                firstName: string;
                lastName: string;
                timezoneOffset: number;
                } = req.body;
        const email = data.email;
        const publicKey = (data.publicKey || null);
        const firstName = data.firstName;
        const lastName = data.lastName;
        const timezoneOffset = data.timezoneOffset;

        const app = state.game;
        const promises = app.promises;

        const version = state.config.content.defaultNarrativeGroup;
        const player = Player.createPlayerState(
                email,
                publicKey,
                version,
                firstName,
                lastName,
                timezoneOffset);

        const promise = promises.addPlayer(player);
        return createRequestCallback(res, promise);
}

export function deletePlayer (
        state: App.State, req: any, res: any)
{
        const email = req.body.email;

        const app = state.game;
        const promises = app.promises;

        const promise = promises.deletePlayer(email);
        return createRequestCallback(res, promise);
}

export function reply (state: App.State, req: any, res: any)
{
        const data: {
                        'sender': string;
                        'Message-ID': string;
                        'In-Reply-To': string;
                        'stripped-text': string;
                        'body-plain': string;
                        To: string;
                        subject: string;
                } = req.body;

        const body = data['stripped-text'] || '';
        const strippedBody = data['body-plain'] || '';

        Log.metric({
                type: 'MESSAGE_RECEIVED',
                playerEmail: data.sender,
                message: {
                        id: data['Message-ID'],
                        inReplyToId: data['In-Reply-To'],
                        from: data.sender,
                        to: data.To,
                        subject: data.subject,
                        body,
                        strippedBody,
                }
        });

        const reply: Message.MailgunReply = {
                from: data.sender,
                to: data['To'],
                subject: data.subject,
                body,
                strippedBody,
                inReplyToId: data['In-Reply-To'],
                id: data['Message-ID'],
                attachment: null,
        };

        if (reply.inReplyToId !== null) {
                const promise = handleReplyRequest(
                        state, reply);
                return createRequestCallback(res, promise);
        } else {
                res.sentStatus(200);
        }
}

export function localReply (state: App.State, req: any, res: any)
{
        const data: {
                        from: string;
                        inReplyToId: string;
                        id: string;
                        subject: string;
                        body: string;
                        to: string;
                } = req.body;

        const body = data.body;
        const strippedBody = Message.stripBody(body);

        Log.metric({
                type: 'MESSAGE_RECEIVED',
                playerEmail: data.from,
                message: {
                        id: data.id,
                        inReplyToId: data.inReplyToId,
                        from: data.from,
                        to: data.to,
                        subject: data.subject,
                        body,
                        strippedBody,
                }
        });

        const reply: Message.MailgunReply = {
                from: data.from,
                to: data.to,
                subject: data.subject,
                body: data.body || '',
                strippedBody,
                inReplyToId: data.inReplyToId,
                id: data.id,
                attachment: null,
        };

        const promise = handleReplyRequest(state, reply);
        return createRequestCallback(res, promise);
}

export function pause (state: App.State, req: any, res: any)
{
        state.paused = true;
        res.sendStatus(200);
}

export function unpause (state: App.State, req: any, res: any)
{
        state.paused = false;
        res.sendStatus(200);
}

export function loadMessage (state: App.State, req: any, res: any)
{
        const data: {
                        messageName: string;
                        narrativeName: string;
                        threadName: string;
                } = req.body;

        const app = state.game;
        const config = state.config;

        const path = config.content.narrativeFolder;
        const messageName = data.messageName + '.json';
        const messagePath = Data.join(
                path, data.narrativeName, messageName);

        const message = Data.loadMessage(messagePath);

        const responseData = {
                message: message,
        };
        res.send(responseData);
}

export function saveMessage (state: App.State, req: any, res: any)
{
        const data: {
                        narrativeName: string;
                        message: Message.ThreadMessage;
                } = req.body;

        const app = state.game;
        const config = state.config;

        const narrativeName = data.narrativeName;
        const message = data.message;
        const path = config.content.narrativeFolder;
        const messagePath = Data.join(
                path,
                narrativeName,
                'messages',
                message.name) + '.json';


        Data.saveMessage(messagePath, message);

        Log.debug('Message saved');

        const promise = App.updateGameState(state);
        return createRequestCallback(res, promise);
}

export function saveReplyOption (
        state: App.State, req: any, res: any)
{
        const data: {
                        narrativeName: string;
                        name: string;
                        value: ReplyOption.ReplyOptions;
                } = req.body;

        const app = state.game;
        const config = state.config;

        const { name, narrativeName, value } = data;
        const path = config.content.narrativeFolder;
        const optionPath = Data.join(
                path,
                narrativeName,
                'replyoptions',
                name) + '.json';

        FileSystem.saveJSONSync(optionPath, value);

        Log.debug('Reply options saved');

        const promise = App.updateGameState(state);
        return createRequestCallback(res, promise);
}

export function deleteReplyOption (
        state: App.State, req: any, res: any)
{
        const data: {
                        narrativeName: string;
                        name: string;
                } = req.body;

        const app = state.game;
        const config = state.config;

        const { name, narrativeName } = data;

        const path = config.content.narrativeFolder;
        const optionPath = Data.join(
                path,
                narrativeName,
                'replyoptions',
                name) + '.json';

        FileSystem.deleteFile(optionPath);

        const promise = App.updateGameState(state);
        return createRequestCallback(res, promise);
}

export function deleteMessage (
        state: App.State, req: any, res: any)
{
        const data: {
                        narrativeName: string;
                        messageName: string;
                } = req.body;

        const app = state.game;
        const config = state.config;

        const narrativeName = data.narrativeName;
        const messageName = data.messageName;

        const path = config.content.narrativeFolder;
        const messagePath = Data.join(
                path,
                narrativeName,
                'messages',
                messageName) + '.json';

        Data.deleteMessage(messagePath);

        const promise = App.updateGameState(state);
        return createRequestCallback(res, promise);
}

export function saveString (state: App.State, req: any, res: any)
{
        const data: {
                        narrativeName: string;
                        name: string;
                        value: string;
                } = req.body;

        const app = state.game;
        const config = state.config;

        const narrativeName = data.narrativeName;
        const path = config.content.narrativeFolder;
        const stringPath = Data.join(
                path,
                narrativeName,
                'strings',
                data.name) + '.json';

        FileSystem.saveJSONSync(stringPath, data.value);

        Log.debug('String saved: ' + data.name);

        const promise = App.updateGameState(state);
        return createRequestCallback(res, promise);
}

export function deleteString (
        state: App.State, req: any, res: any)
{
        const data: {
                        narrativeName: string;
                        name: string;
                } = req.body;

        const app = state.game;
        const config = state.config;

        const narrativeName = data.narrativeName;

        const path = config.content.narrativeFolder;
        const stringPath = Data.join(
                path,
                narrativeName,
                'strings',
                data.name) + '.json';

        FileSystem.deleteFile(stringPath);

        Log.debug('String deleted: ' + data.name);

        const promise = App.updateGameState(state);
        return createRequestCallback(res, promise);
}

export function narratives (state: App.State, req: any, res: any)
{
        const app = state.game;
        const config = state.config;
        const data: {} = req.query;

        const path = config.content.narrativeFolder;
        const narrativeData = Data.loadNarrativeData(path);
        const narratives = Helpers.mapFromNameArray(
                narrativeData);

        res.send(narratives);
}

export function validateData (
        state: App.State, req: any, res: any)
{
        const data: { narrativeName: string; } = req.query;

        const app = state.game;
        const config = state.config;

        const path = config.content.narrativeFolder;

        const narrativeData = Data.loadNarrative(
                path, data.narrativeName);
        const content = config.content;
        const profileSchema = FileSystem.loadJSONSync<JSON>(
                content.profileSchemaPath);
        const messageSchema = FileSystem.loadJSONSync<JSON>(
                content.messageSchemaPath);
        const replyOptionSchema = FileSystem.loadJSONSync<JSON>(
                content.replyOptionSchemaPath);
        const dataErrors = DataValidation.getDataErrors(
                narrativeData,
                profileSchema,
                messageSchema,
                replyOptionSchema);

        res.send(dataErrors);
}

export function createRequestCallback (res: any, promise: Promise<any>)
{
        return promise.then(result =>
                res.sendStatus(200)
        ).catch(err => res.sendStatus(500));
}

export function handleReplyRequest (
        state: App.State, reply: Message.MailgunReply)
{
        const careersEmail = isCareersEmail(reply.to);
        const timestampMs = Date.now();

        if (careersEmail) {
                return handleCareersEmail(state, reply);
        } else {
                const app = state.game;
                const { narratives, promises } = app;
                return PromisesReply.handleReplyMessage(
                        reply,
                        timestampMs,
                        narratives,
                        promises);
        }
}

export function beginGame (
        state: App.State,
        groupData: State.NarrativeState,
        email: string,
        playerData: PlayerApplicationData,
        threadMessageName: string)
{
        const app = state.game;
        const promises = app.promises;

        const publicKey: string = null;
        const firstName = playerData.firstName;
        const lastName = playerData.lastName;
        const version = state.config.content.defaultNarrativeGroup;
        const utcOffset = playerData.utcOffset;
        const player = Player.createPlayerState(
                email, publicKey, version, firstName, lastName, utcOffset);
        const timestampMs = Clock.gameTimeMs(state.clock);

        return Promises.beginGame(
                threadMessageName,
                player,
                timestampMs,
                groupData,
                promises);
}

export function endGame (state: App.State, email: string)
{
        const app = state.game;
        const promises = app.promises;

        return Promises.endGame(email, promises);
}

export function handleCareersEmail (
        state: App.State,
        reply: Message.MailgunReply)
{
        const defaultNarrativeGroup =
                state.config.content.defaultNarrativeGroup;
        const groupData = App.getGroupData(state.game, defaultNarrativeGroup);

        const email = reply.from;
        const subject = reply.subject;
        const strippedBody = reply.strippedBody;

        const resignationLetter = Str.contains(reply.subject, 'resign');

        if (resignationLetter) {
                return handleResignation(
                        state,
                        groupData,
                        email);
        } else {
                const playerData = strippedBody && extractPlayerData(strippedBody);
                Log.metric({
                        type: 'PLAYER_APPLICATION',
                        playerEmail: email,
                        firstName: playerData.firstName,
                        lastName: playerData.lastName,
                        usePGP: playerData.usePGP,
                        utcOffset: playerData.utcOffset,
                        securityKey: playerData.key,
                });

                const getGameKey = state.game.promises.getGameKey;
                return playerData  ?
                        getGameKey(playerData.key).then<any>(key =>
                                key ? handleValidApplication(
                                        state,
                                        groupData,
                                        email,
                                        playerData) :
                                handleInvalidApplication(
                                        state,
                                        groupData,
                                        email)
                        ) :
                        handleInvalidApplication(
                                state,
                                groupData,
                                email);
        }
}

export function handleResignation (
        state: App.State,
        groupData: State.NarrativeState,
        email: string)
{
        const app = state.game;
        const promises = app.promises;

        const messageName = state.config.content.resignationThread;

        return Promises.resign(messageName, email, groupData, promises);
}

export function handleValidApplication (
        state: App.State,
        groupData: State.NarrativeState,
        email: string,
        playerData: PlayerApplicationData)
{
        const config = state.config;

        const initialThreadMessage = playerData.usePGP ?
                config.content.validApplicationThreadPGP :
                config.content.validApplicationThread;

        return beginGame(
                state,
                groupData,
                email,
                playerData,
                initialThreadMessage);
}

export function handleInvalidApplication (
        state: App.State,
        groupData: State.NarrativeState,
        email: string)
{
        const app = state.game;
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
        key: string;
}

export function extractPlayerData (applicationText: string)
        : PlayerApplicationData
{
        const firstNameLabel = 'First Name:';
        const lastNameLabel = 'Last Name:';
        const pgpLabel = 'Use PGP Encryption (Y/N):';
        const timezoneLabel = 'UTC offset (hours):';
        const keyLabel = 'Security Key:';

        const firstName = extractFormField(applicationText, firstNameLabel);
        const lastName = extractFormField(applicationText, lastNameLabel);
        const pgp = extractFormField(applicationText, pgpLabel);
        const usePGP = (pgp && pgp.toLowerCase().indexOf('y') !== -1);
        const timeOffset = extractFormField(applicationText, timezoneLabel);
        const validOffset = timeOffset && !isNaN(<number><any>timeOffset);
        const utcOffset = parseInt(timeOffset) || 0;
        const key = extractSecurityKeyField(applicationText, keyLabel);

        return (firstName && lastName && pgp && validOffset && key) ?
                {
                        firstName,
                        lastName,
                        usePGP,
                        utcOffset,
                        key,
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

export function extractSecurityKeyField (text: string, label: string): string
{
        text = text.replace(/\r\n/g, "\n");
        const index = text.indexOf(label);
        if (index !== -1) {
                const start = index + label.length;
                const end = text.indexOf('\n\n', start);
                let key = text.substring(start, end);
                key = key.replace(/\n/g, '');
                key = key.trim();
                console.log('key:', key);
                return key.trim();
        } else {
                return null;
        }
}
