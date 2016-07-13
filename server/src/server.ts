/// <reference path='../../typings/body-parser/body-parser.d.ts'/>
/// <reference path='../../typings/express/express.d.ts'/>
/// <reference path='../../typings/multer/multer.d.ts'/>

import Log = require('./../../core/src/app/log');
import Message = require('./../../core/src/app/message');

import express = require('express');
import bodyParser = require('body-parser');
import multer = require('multer');

export interface RequestHandler {
        (req: any, res: any, next: any): void;
}

export interface ExpressApp {
        get: (path: string, ...handler: RequestHandler[]) => void;
        post: (path: string, ...handler: RequestHandler[]) => void;
        use: any;
}

export interface ServerState {
        app: ExpressApp;
        server: any;
}

export function createServerState (): ServerState
{
        const app = express();
        app.use(bodyParser.urlencoded({
                extended: true
        }));
        app.use(bodyParser.json());
        app.use(multer({}));
        app.use(function (req: any, res: any, next: any) {
                  res.header("Access-Control-Allow-Origin", "*");
                  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                  next();
        });

        const server = require('http').Server(app);

        return {
                app,
                server,
        };
}

export function sendMail (messageData: Message.MessageData)
{
        const id = generateMessageId();
        Log.metric({
                type: 'MESSAGE_SENT',
                playerEmail: messageData.from,
                message: {
                        name: messageData.name,
                        id,
                        from: messageData.from,
                        to: messageData.to,
                        subject: messageData.subject,
                }
        });

        return Promise.resolve(id);
}

// DEBUG ONLY
let idCounter = 0;
function generateMessageId (): string
{
        const id = idCounter.toString();
        idCounter += 1;
        return id;
}
