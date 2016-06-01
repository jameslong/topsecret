import App = require('../app');
import Careers = require('./careers');
import Data = require('../../../../core/src/app/data');
import DataValidation = require('../../../../core/src/app/datavalidation');
import Demo = require('./demo');
import FileSystem = require('../../../../core/src/app/filesystem');
import Helpers = require('../../../../core/src/app/utils/helpers');
import Log = require('../../../../core/src/app/log');
import Message = require('../../../../core/src/app/message');
import Player = require('../../../../core/src/app/player');
import Reply = require('./reply');
import ReplyOption = require('../../../../core/src/app/replyoption');
import Request = require('../../../../core/src/app/requesttypes');
import Server = require('../server');

export function addRequestEndpoints (
        state: App.State)
{
        var serverState = state.server;
        var app = serverState.app;

        app.get('/healthcheck', function (req: any, res: any)
                {
                        res.sendStatus(200);
                });

        addPost(app, '/reply', createReplyCallback, state);
        addPost(app, '/pause', createPauseCallback, state);
        addPost(app, '/unpause', createUnpauseCallback, state);

        // Debug only
        addPost(app, '/localreply', createLocalReplyCallback, state);
        addPost(app, '/createplayertable', createCreatePlayerTableCallback, state);
        addPost(app, '/deleteplayertable', createDeletePlayerTableCallback, state);
        addPost(app, '/createmessagetable', createCreateMessageTableCallback, state);
        addPost(app, '/deletemessagetable', createDeleteMessageTableCallback, state);
        addPost(app, '/begindemo', createBeginDemoCallback, state);
        addPost(app, '/enddemo', createEndDemoCallback, state);
        addPost(app, '/addplayer', createAddPlayerCallback, state);
        addPost(app, '/removeplayer', createDeletePlayerCallback, state);

        // Author only
        addPost(app, '/loadmessage', createLoadMessageCallback, state);
        addPost(app, '/savemessage', createSaveMessageCallback, state);
        addPost(app, '/deletemessage', createDeleteMessageCallback, state);
        addPost(app, '/savereplyoption', createSaveReplyOptionCallback, state);
        addPost(app, '/deletereplyoption', createDeleteReplyOptionCallback, state);
        addPost(app, '/savestring', createSaveStringCallback, state);
        addPost(app, '/deletestring', createDeleteStringCallback, state);
        addGet(app, '/narratives', createNarrativesCallback, state);
        addGet(app, '/validatedata', createValidateDataCallback, state);

        var http = serverState.server;
        var port = state.config.port;

        http.listen(port, function ()
                {
                        Log.debug('Listening on *: ' + port);
                });
}

export function createLogHandler (
        path: string,
        handler: Server.RequestHandler): Server.RequestHandler
{
        return (req: any, res: any) => {
                Log.debug('Request: ' + path);
                handler(req, res);
        };
}

export function addGet (
        app: Server.ExpressApp,
        path: string,
        createHandlerFn: (state: App.State) => Server.RequestHandler,
        state: App.State)
{
        var handler = createHandlerFn(state);
        var logHandler = createLogHandler(path, handler);
        app.get(path, logHandler);
}


export function addPost (
        app: Server.ExpressApp,
        path: string,
        createHandlerFn: (state: App.State) => Server.RequestHandler,
        state: App.State)
{
        var handler = createHandlerFn(state);
        var logHandler = createLogHandler(path, handler);
        app.post(path, logHandler);
}

export function createCreatePlayerTableCallback (state: App.State)
{
        return (req: any, res: any) =>
                {
                        var app = state.app;
                        var promises = app.promises;
                        var config = state.config;
                        var tableName = config.aws.playersTableName;

                        promises.createPlayerTable(tableName).then(result =>
                                res.sendStatus(200)
                        ).catch(err => res.sentStatus(500));
                };
}

export function createDeletePlayerTableCallback (state: App.State)
{
        return (req: any, res: any) =>
                {
                        var app = state.app;
                        var promises = app.promises;
                        var config = state.config;
                        var tableName = config.aws.playersTableName;

                        promises.deleteTable(tableName).then(result =>
                                res.sendStatus(200)
                        ).catch(err => res.sentStatus(500));
                };
}

export function createCreateMessageTableCallback (state: App.State)
{
        return (req: any, res: any) =>
                {
                        var app = state.app;
                        var promises = app.promises;
                        var config = state.config;
                        var tableName = config.aws.messagesTableName;

                        const promise = promises.createMessageTable(tableName);
                        return createRequestCallback(res, promise);
                };
}

export function createDeleteMessageTableCallback (state: App.State)
{
        return (req: any, res: any) =>
                {
                        var app = state.app;
                        var promises = app.promises;
                        var config = state.config;
                        var tableName = config.aws.messagesTableName;

                        const promise = promises.deleteTable(tableName);
                        return createRequestCallback(res, promise);
                };
}

export function createBeginDemoCallback (state: App.State)
{
        return (req: any, res: any) =>
                {
                        var body: {
                                        email: string;
                                        firstName: string;
                                        lastName: string;
                                        messageName: string;
                                        narrativeName: string;
                                } = req.body;

                        Log.metric({
                                type: 'BEGIN_GAME',
                                playerEmail: body.email,
                                firstName: body.firstName,
                                lastName: body.lastName,
                                messageName: body.messageName,
                                narrativeName: body.narrativeName,
                        });

                        var email = body.email;
                        var firstName = body.firstName;
                        var lastName = body.lastName;
                        var newMessageName = body.messageName;
                        var narrativeName = body.narrativeName;

                        var playerData = {
                                firstName: firstName,
                                lastName: lastName,
                                usePGP: false,
                        };

                        var groupData = App.getGroupData(state.app, narrativeName);

                        const promise = Demo.beginDemo(
                                state,
                                groupData,
                                email,
                                playerData,
                                newMessageName);

                        createRequestCallback(res, promise);
                };
}

export function createEndDemoCallback (state: App.State)
{
        return (req: any, res: any) =>
                {
                        var data: {
                                        email: string;
                                } = req.body;

                        Log.metric({
                                type: 'END_GAME',
                                playerEmail: data.email,
                        });

                        var promises = state.app.promises;

                        const promise = Demo.endDemo(state, data.email);
                        return createRequestCallback(res, promise);
                };
}

export function createAddPlayerCallback (state: App.State)
{
        return (req: any, res: any) =>
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
                };
}

export function createDeletePlayerCallback (state: App.State)
{
        return (req: any, res: any) =>
                {
                        var email = req.body.email;

                        var app = state.app;
                        var promises = app.promises;

                        const promise = promises.deletePlayer(email);
                        return createRequestCallback(res, promise);
                };
}

export function createReplyCallback (state: App.State)
{
        return (req: any, res: any) =>
                {
                        const data: {
                                        'sender': string;
                                        'Message-ID': string;
                                        'In-Reply-To': string;
                                        'stripped-text': string;
                                        To: string;
                                        subject: string;
                                } = req.body;

                        Log.metric({
                                type: 'MESSAGE_RECEIVED',
                                playerEmail: data.sender,
                                message: {
                                        id: data['Message-ID'],
                                        inReplyToId: data['In-Reply-To'],
                                        from: data.sender,
                                        to: data.To,
                                        subject: data.subject,
                                        body: data['stripped-text'],
                                }
                        });

                        const reply = {
                                from: data.sender,
                                to: data['To'],
                                subject: data.subject,
                                body: data['stripped-text'] || '',
                                inReplyToId: data['In-Reply-To'],
                                id: data['Message-ID'],
                        };

                        if (reply.inReplyToId !== null) {
                                const promise = Reply.handleReplyRequest(
                                        state, reply);
                                return createRequestCallback(res, promise);
                        } else {
                                res.sentStatus(200);
                        }
                };
}

export function createLocalReplyCallback (state: App.State)
{
        return (req: any, res: any) =>
                {
                        const data: {
                                        from: string;
                                        inReplyToId: string;
                                        id: string;
                                        subject: string;
                                        body: string;
                                        to: string;
                                } = req.body;

                        Log.metric({
                                type: 'MESSAGE_RECEIVED',
                                playerEmail: data.from,
                                message: {
                                        id: data.id,
                                        inReplyToId: data.inReplyToId,
                                        from: data.from,
                                        to: data.to,
                                        subject: data.subject,
                                        body: data.body,
                                }
                        });

                        const reply = {
                                from: data.from,
                                to: data.to,
                                subject: data.subject,
                                body: data.body || '',
                                inReplyToId: data.inReplyToId,
                                id: data.id,
                        };

                        const promise = Reply.handleReplyRequest(
                                state, reply);
                        return createRequestCallback(res, promise);
                };
}

export function createPauseCallback (state: App.State)
{
        return (req: any, res: any) =>
                {
                        state.server.paused = true;
                        res.sendStatus(200);
                };
}

export function createUnpauseCallback (state: App.State)
{
        return (req: any, res: any) =>
                {
                        state.server.paused = false;
                        res.sendStatus(200);
                };
}

export function createLoadMessageCallback (state: App.State)
{
        return (req: any, res: any) =>
                {
                        var data: {
                                        messageName: string;
                                        narrativeName: string;
                                        threadName: string;
                                } = req.body;

                        var app = state.app;
                        var config = state.config;

                        var path = config.content.narrativeFolder;
                        const messageName = data.messageName + '.json';
                        const messagePath = Data.join(
                                path, data.narrativeName, messageName);

                        var message = Data.loadMessage(messagePath);

                        var responseData = {
                                message: message,
                        };
                        res.send(responseData);
                };
}

export function createSaveMessageCallback (state: App.State)
{
        return (req: any, res: any) =>
                {
                        var data: {
                                        narrativeName: string;
                                        message: Message.ThreadMessage;
                                } = req.body;

                        var app = state.app;
                        var config = state.config;

                        const narrativeName = data.narrativeName;
                        const message = data.message;
                        var path = config.content.narrativeFolder;
                        const messagePath = Data.join(
                                path,
                                narrativeName,
                                'messages',
                                message.name) + '.json';


                        Data.saveMessage(messagePath, message);

                        Log.debug('Message saved');

                        const promise = App.updateGameState(state);
                        return createRequestCallback(res, promise);
                };
}

export function createSaveReplyOptionCallback (state: App.State)
{
        return (req: any, res: any) =>
                {
                        var data: {
                                        narrativeName: string;
                                        name: string;
                                        value: ReplyOption.ReplyOptions;
                                } = req.body;

                        var app = state.app;
                        var config = state.config;

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
                };
}

export function createDeleteReplyOptionCallback (state: App.State)
{
        return (req: any, res: any) =>
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
                };
}

export function createDeleteMessageCallback (state: App.State)
{
        return (req: any, res: any) =>
                {
                        var data: {
                                        narrativeName: string;
                                        messageName: string;
                                } = req.body;

                        var app = state.app;
                        var config = state.config;

                        const narrativeName = data.narrativeName;
                        const messageName = data.messageName;

                        var path = config.content.narrativeFolder;
                        const messagePath = Data.join(
                                path,
                                narrativeName,
                                'messages',
                                messageName) + '.json';

                        Data.deleteMessage(messagePath);

                        const promise = App.updateGameState(state);
                        return createRequestCallback(res, promise);
                };
}

export function createSaveStringCallback (state: App.State)
{
        return (req: any, res: any) =>
                {
                        var data: {
                                        narrativeName: string;
                                        name: string;
                                        value: string;
                                } = req.body;

                        var app = state.app;
                        var config = state.config;

                        const narrativeName = data.narrativeName;
                        var path = config.content.narrativeFolder;
                        const stringPath = Data.join(
                                path,
                                narrativeName,
                                'strings',
                                data.name) + '.json';

                        FileSystem.saveJSONSync(stringPath, data.value);

                        Log.debug('String saved: ' + data.name);

                        const promise = App.updateGameState(state);
                        return createRequestCallback(res, promise);
                };
}

export function createDeleteStringCallback (state: App.State)
{
        return (req: any, res: any) =>
                {
                        var data: {
                                        narrativeName: string;
                                        name: string;
                                } = req.body;

                        var app = state.app;
                        var config = state.config;

                        const narrativeName = data.narrativeName;

                        var path = config.content.narrativeFolder;
                        const stringPath = Data.join(
                                path,
                                narrativeName,
                                'strings',
                                data.name) + '.json';

                        FileSystem.deleteFile(stringPath);

                        Log.debug('String deleted: ' + data.name);

                        const promise = App.updateGameState(state);
                        return createRequestCallback(res, promise);
                };
}

export function createNarrativesCallback (state: App.State)
{
        return (req: any, res: any) =>
                {
                        const app = state.app;
                        const config = state.config;
                        const data: {} = req.query;

                        const path = config.content.narrativeFolder;
                        const narrativeData = Data.loadNarrativeData(path);
                        const narratives = Helpers.mapFromNameArray(
                                narrativeData);

                        res.send(narratives);
                };
}

export function createValidateDataCallback (state: App.State)
{
        return (req: any, res: any) =>
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
                };
}

export function createRequestCallback (res: any, promise: Promise<any>)
{
        return promise.then(result =>
                res.sendStatus(200)
        ).catch(err => res.sendStatus(500));
}
