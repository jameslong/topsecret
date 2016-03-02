/// <reference path='../../typings/body-parser/body-parser.d.ts'/>
/// <reference path='../../typings/express/express.d.ts'/>
/// <reference path='../../typings/multer/multer.d.ts'/>

import Log = require('./../../../game/src/app/log/log');
import Message = require('./../../../game/src/app/message');
import Request = require('./../../../game/src/app/requesttypes');

import express = require('express');
import bodyParser = require('body-parser');
import multer = require('multer');

const app = express();

export interface RequestHandler {
        (req: any, res: any): void;
}

export interface ExpressApp {
        get: (path: string, handler: RequestHandler) => void;
        post: (path: string, handler: RequestHandler) => void;
        use: any;
}

export interface ServerState {
        app: ExpressApp;
        io: any;
        server: any;
        paused: boolean;
}

export function createServerState (): ServerState
{
        app.use(bodyParser.urlencoded({
                extended: true
        }));
        app.use(bodyParser.json());
        app.use(multer({}));
        app.use(function(req: any, res: any, next: any) {
                          res.header("Access-Control-Allow-Origin", "*");
                          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                          next();
                });

        var server = require('http').Server(app);

        var io = require('socket.io')(server);
        io.on('connection', (socket: any) => {
                        Log.debug('New websocket connection');
                });

        return {
                app: app,
                io: io,
                server: server,
                paused: false,
        };
}

export function sendMail (
        io: any,
        messageData: Message.MessageData,
        callback: Request.Callback<string>)
{
        const messageId = generateMessageId();
        var to = [messageData.playerEmail].concat(messageData.to);

        var message: Message.MessagePacket = {
                id: messageId,
                from: messageData.from,
                to: to,
                subject: messageData.subject,
                body: messageData.body,
        };

        io.sockets.emit('message', message);
        callback(null, messageId);
}

// DEBUG ONLY
let idCounter = 0;
function generateMessageId (): string
{
        var id = idCounter.toString();
        idCounter += 1;
        return id;
}
