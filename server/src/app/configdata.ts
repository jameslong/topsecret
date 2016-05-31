import Config = require('./config');

var debugConfig: Config.ConfigState = {
        port: '3000',
        useDynamoDB: false,
        useEmail: false,
        debugDBTimeoutMs: 1000,
        aws: {
                accessKeyId: '',
                secretAccessKey: '',
                region: '',
                messagesTableName: 'messages-dev',
                playersTableName: 'players-dev',
        },
        mailgun: {
                apiKey: '',
        },
        emailDomain: 'nsa.playtopsecret.com',
        updateIntervalMs: 1000,
        content: {
                validApplicationThread: 'transferRequest_valid',
                validApplicationThreadPGP: 'transferRequest_valid_pgp',
                invalidApplicationThread: 'transferRequest_invalid',
                resignationThread: 'resignation_0',
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
                messagesTableName: 'messages',
                playersTableName: 'players',
        },
        mailgun: {
                apiKey: '',
        },
        emailDomain: 'testmail.playtopsecret.com',
        updateIntervalMs: 1000,
        content: {
                validApplicationThread: 'transferRequest_valid',
                validApplicationThreadPGP: 'transferRequest_valid_pgp',
                invalidApplicationThread: 'transferRequest_invalid',
                resignationThread: 'resignation_0',
                narrativeFolder: '../content',
                defaultNarrativeGroup: 'sample_data',
                messageSchemaPath: '../core/src/app/messageschema.json',
                profileSchemaPath: '../core/src/app/profileschema.json',
                replyOptionSchemaPath: '../core/src/app/replyoptionschema.json',
        },
        timeFactor: 1
};

export var releaseMode = false;

export var config = releaseMode ? releaseConfig : debugConfig;
