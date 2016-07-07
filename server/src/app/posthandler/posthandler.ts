import App = require('../app');
const Auth = require('basic-auth');
import Careers = require('./careers');
import Data = require('../../../../core/src/app/data');
import DataValidation = require('../../../../core/src/app/datavalidation');
import Demo = require('./demo');
import FileSystem = require('../../../../core/src/app/filesystem');
import Helpers = require('../../../../core/src/app/utils/helpers');
import Log = require('../../../../core/src/app/log');
import Message = require('../../../../core/src/app/message');
import MessageHelpers = require('../../../../core/src/app/messagehelpers');
import Player = require('../../../../core/src/app/player');
import Reply = require('./reply');
import ReplyOption = require('../../../../core/src/app/replyoption');
import Request = require('../../../../core/src/app/requesttypes');
import Server = require('../server');

interface RequestHandler { (state: App.State, req: any, res: any): void; }

export function addRequestEndpoints (state: App.State)
{
        const serverState = state.server;
        const app = serverState.app;

        const { user, password } = state.config.basicAuth;
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
        };

        const groupData = App.getGroupData(state.app, narrativeName);

        const promise = Demo.beginDemo(
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

        const promises = state.app.promises;

        const promise = Demo.endDemo(state, data.email);
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

        const app = state.app;
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

        const app = state.app;
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
                const promise = Reply.handleReplyRequest(
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
        const strippedBody = MessageHelpers.stripBody(body);

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

        const promise = Reply.handleReplyRequest(state, reply);
        return createRequestCallback(res, promise);
}

export function pause (state: App.State, req: any, res: any)
{
        state.server.paused = true;
        res.sendStatus(200);
}

export function unpause (state: App.State, req: any, res: any)
{
        state.server.paused = false;
        res.sendStatus(200);
}

export function loadMessage (state: App.State, req: any, res: any)
{
        const data: {
                        messageName: string;
                        narrativeName: string;
                        threadName: string;
                } = req.body;

        const app = state.app;
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

        const app = state.app;
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

        const app = state.app;
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

        const app = state.app;
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

        const app = state.app;
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

        const app = state.app;
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

        const app = state.app;
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
        const app = state.app;
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

        const app = state.app;
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
