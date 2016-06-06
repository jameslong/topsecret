import Config = require('./config');

var debugConfig: Config.ConfigState = {
        port: '3000',
        useDynamoDB: true,
        useEmail: true,
        debugDBTimeoutMs: 1000,
        aws: {
                accessKeyId: '',
                secretAccessKey: '',
                region: '',
                messagesTableName: 'message-dev',
                playersTableName: 'player-dev',
        },
        mailgun: {
                apiKey: '',
        },
        emailDomain: 'nsa.playtopsecret.com',
        updateIntervalMs: 1000,
        content: {
                validApplicationThread: 'transfer_request_valid',
                validApplicationThreadPGP: 'transfer_request_valid_pgp',
                invalidApplicationThread: 'transfer_request_invalid',
                resignationThread: 'resign',
                narrativeFolder: '../../topsecret-content/game',
                defaultNarrativeGroup: '0',
                messageSchemaPath: '../core/src/app/messageschema.json',
                profileSchemaPath: '../core/src/app/profileschema.json',
                replyOptionSchemaPath: '../core/src/app/replyoptionschema.json',
        },
        timeFactor: (1/60) * 1000
};

var releaseConfig: Config.ConfigState = {
        port: '3000',
        useDynamoDB: false,
        useEmail: true,
        debugDBTimeoutMs: 1000,
        aws: {
                accessKeyId: '',
                secretAccessKey: '',
                region: '',
                messagesTableName: 'message-dev',
                playersTableName: 'player-dev',
        },
        mailgun: {
                apiKey: '',
        },
        emailDomain: 'nsa.playtopsecret.com',
        updateIntervalMs: 1000,
        content: {
                validApplicationThread: 'transfer_request_valid',
                validApplicationThreadPGP: 'transfer_request_valid_pgp',
                invalidApplicationThread: 'transfer_request_invalid',
                resignationThread: 'resign',
                narrativeFolder: '../../topsecret-content/game',
                defaultNarrativeGroup: '0',
                messageSchemaPath: '../core/src/app/messageschema.json',
                profileSchemaPath: '../core/src/app/profileschema.json',
                replyOptionSchemaPath: '../core/src/app/replyoptionschema.json',
        },
        timeFactor: 1
};

export var releaseMode = false;

export var config = releaseMode ? releaseConfig : debugConfig;
