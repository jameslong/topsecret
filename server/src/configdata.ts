import Config = require('./config');

const htmlFooter = `<br><div style="border-top:1px solid #CCCCCC; font-size:12px;"><p>This message is part of Top Secret, a story you signed up for. Top Secret is currently in Early Access. There are bugs and the game is unfinished. You can give feedback about the game <a href="https://docs.google.com/forms/d/1dgz3smQ1AkvH6sRLPVC6vSHFP2mYq_KYPd4CmKS-w60/viewform">here</a>.</p><p>To stop playing, email careers@nsa.playtopsecret.com with the word 'resign' in the subject line.</p></div>`;
const textFooter = `\n\n-----\nThis message is part of Top Secret, a story you signed up for. Top Secret is currently in Early Access. There are bugs and the game is unfinished. You can give feedback about the game at https://docs.google.com/forms/d/1dgz3smQ1AkvH6sRLPVC6vSHFP2mYq_KYPd4CmKS-w60/viewform.\n\nTo stop playing, email careers@nsa.playtopsecret.com with the word 'resign' in the subject line.`;

const debugConfig: Config.ConfigState = {
        port: '3000',
        useDynamoDB: false,
        useEmail: false,
        useBasicAuth: false,
        debugDBTimeoutMs: 1000,
        aws: {
                accessKeyId: '',
                secretAccessKey: '',
                region: '',
                messagesTableName: 'message-dev',
                playersTableName: 'player-dev',
        },
        basicAuth: {
                user: '',
                password: '',
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
                htmlFooter: htmlFooter,
                textFooter: textFooter,
        },
        timeFactor: (1/60) * 1000
};

const releaseConfig: Config.ConfigState = {
        port: '3000',
        useDynamoDB: true,
        useEmail: true,
        useBasicAuth: true,
        debugDBTimeoutMs: 1000,
        aws: {
                accessKeyId: '',
                secretAccessKey: '',
                region: '',
                messagesTableName: 'message-dev',
                playersTableName: 'player-dev',
        },
        basicAuth: {
                user: '',
                password: '',
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
                htmlFooter: htmlFooter,
                textFooter: textFooter,
        },
        timeFactor: 1
};

export const releaseMode = false;

export const config = releaseMode ? releaseConfig : debugConfig;
