import Config = require('./config');

var debugConfig: Config.ConfigState = {
        mode: Config.AppMode.Local,
        port: '3000',
        useEmail: false,
        debugDBTimeoutMs: 1000,
        logging: {
                console: true,
        },
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
        emailDomain: 'testmail.playtopsecret.com',
        client: {
                localURL: 'http://localhost',
                elbURL: null,
                postDest: Config.ClientPost.Local,
        },
        update: {
                maxMessagesRequestedPerUpdate: 2,
                updateIntervalMs: 1000,
                minMessageUpdateIntervalMs: 10000,
        },
        content: {
                validApplicationThread: 'transferRequest_valid',
                validApplicationThreadPGP: 'transferRequest_valid_pgp',
                invalidApplicationThread: 'transferRequest_invalid',
                resignationThread: 'resignation_0',
                narrativeFolder: '../content',
                defaultNarrativeGroup: 'sample_data',
                messageSchemaPath: '../core/src/app/messageschema.json',
                profileSchemaPath: '../core/src/app/profileschema.json',
        },
        timeFactor: (1/60) * 1000
};

var releaseConfig: Config.ConfigState = {
        mode: Config.AppMode.DynamoDB,
        port: '3000',
        useEmail: true,
        debugDBTimeoutMs: 1000,
        logging: {
                console: false,
        },
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
        client: {
                localURL: 'http://localhost',
                elbURL: null,
                postDest: Config.ClientPost.Local,
        },
        update: {
                maxMessagesRequestedPerUpdate: 2,
                updateIntervalMs: 1000,
                minMessageUpdateIntervalMs: 120000,
        },
        content: {
                validApplicationThread: 'transferRequest_valid',
                validApplicationThreadPGP: 'transferRequest_valid_pgp',
                invalidApplicationThread: 'transferRequest_invalid',
                resignationThread: 'resignation_0',
                narrativeFolder: '../content',
                defaultNarrativeGroup: 'sample_data',
                messageSchemaPath: 'src/app/data/messageschema.json',
                profileSchemaPath: 'src/app/data/profileschema.json',
        },
        timeFactor: 1
};

export var releaseMode = false;

export var config = releaseMode ? releaseConfig : debugConfig;
