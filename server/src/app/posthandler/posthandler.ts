import App = require('../app');
import Careers = require('./careers');
import Data = require('../data/data');
import DataValidation = require('../data/datavalidation');
import Demo = require('./demo');
import FileSystem = require('../data/filesystem');
import Log = require('../../../../core/src/app/log/log');
import Message = require('../../../../core/src/app/message');
import Player = require('../../../../core/src/app/player');
import Reply = require('./reply');
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
                        var tableName = config.dynamoDBConfig.playersTableName;

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
                        var tableName = config.dynamoDBConfig.playersTableName;

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
                        var tableName = config.dynamoDBConfig.messagesTableName;

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
                        var tableName = config.dynamoDBConfig.messagesTableName;

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

                        var promises = state.app.promises;

                        const promise = Demo.endDemo(state, data.email);
                        return createRequestCallback(res, promise);
                };
}

export function createAddPlayerCallback (state: App.State)
{
        return (req: any, res: any) =>
                {
                        var data: {
                                email: string;
                                publicKey: string;
                                firstName: string;
                                lastName: string;
                                } = req.body;
                        var email = data.email;
                        var publicKey = (data.publicKey || null);
                        var firstName = data.firstName;
                        var lastName = data.lastName;

                        var app = state.app;
                        var promises = app.promises;

                        const player = Player.createPlayerState(
                                email, publicKey, firstName, lastName);

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
                        var data: {
                                        'sender': string;
                                        'In-Reply-To': string;
                                        'stripped-text': string;
                                        To: string;
                                        subject: string;
                                } = req.body;

                        var playerEmail = data.sender;
                        var id = data['In-Reply-To'];
                        var body = data['stripped-text'] || '';
                        var to = data['To'];
                        var subject = data.subject;

                        if (id !== null) {
                                const promise = Reply.handleReplyRequest(
                                        state,
                                        playerEmail,
                                        id,
                                        subject,
                                        body,
                                        to);
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
                        var data: {
                                        from: string;
                                        id: string;
                                        subject: string;
                                        body: string;
                                        to: string;
                                } = req.body;

                        var playerEmail = data.from;
                        var id = data.id;
                        var body = data.body || '';
                        var to = data.to;
                        var subject = data.subject;

                        const promise = Reply.handleReplyRequest(
                                state,
                                playerEmail,
                                id,
                                subject,
                                body,
                                to);
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
                        var app = state.app;
                        var config = state.config;
                        var data: {} = req.query;

                        var path = config.content.narrativeFolder;
                        var narratives = Data.loadNarratives(path);

                        res.send(narratives);
                };
}

export function createValidateDataCallback (state: App.State)
{
        return (req: any, res: any) =>
                {
                        var data: { narrativeName: string; } = req.query;

                        var app = state.app;
                        var config = state.config;

                        var path = config.content.narrativeFolder;

                        var narrativeData = Data.loadNarrative(
                                path, data.narrativeName);
                        var dataErrors = DataValidation.getDataErrors(
                                narrativeData);

                        res.send(dataErrors);
                };
}

export function createRequestCallback (res: any, promise: Promise<any>)
{
        return promise.then(result =>
                res.sendStatus(200)
        ).catch(err => res.sendStatus(500));
}
