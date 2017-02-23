import Data = require('../../core/src/data');
import FileSystem = require('../../core/src/filesystem');
import Helpers = require('../../core/src/utils/helpers');

export interface Credentials {
        awsAccessKeyId: string;
        awsSecretAccessKey: string;
        awsRegion: string;
        basicAuthUser: string;
        basicAuthPassword: string;
        mailgunApiKey: string;
}

export interface ConfigState {
        port: string;
        useDynamoDB: boolean;
        useEmail: boolean;
        useBasicAuth: boolean;
        credentials: Credentials;
        debugDBTimeoutMs: number;
        messagesTableName: string;
        playersTableName: string;
        gameKeyTableName: string;
        emailDomain: string;
        updateIntervalMs: number;
        content: {
                narrativeFolder: string;
                defaultNarrativeGroup: string;
                validApplicationThread: string;
                validApplicationThreadPGP: string;
                invalidApplicationThread: string;
                invalidApplicationMissingFirstNameThread: string;
                invalidApplicationMissingLastNameThread: string;
                invalidApplicationMissingKeyThread: string;
                invalidApplicationInvalidKeyThread: string;
                resignationThread: string;
                messageSchemaPath: string;
                profileSchemaPath: string;
                replyOptionSchemaPath: string;
                htmlFooter: string;
                textFooter: string;
        },
        timeFactor: number;
}

export function loadCredentials(path: string)
{
        let credentials: Credentials = null;
        try {
                credentials = <Credentials>FileSystem.loadJSONSync(
                        `${path}/credentials.json`);
        } catch (e) {
                console.log('Using example credentials');
                credentials = <Credentials>FileSystem.loadJSONSync(
                        `${path}/example_credentials.json`);
        }

        return credentials;
}

const htmlFooter = `<br><div style="border-top:1px solid #CCCCCC; font-size:12px;"><p>This message is part of Top Secret, a story you signed up for.</p><p>To stop playing, email careers@nsa.playtopsecret.com with the word 'resign' in the subject line.</p></div>`;
const textFooter = `\n\n-----\nThis message is part of Top Secret, a story you signed up for. To stop playing, email careers@nsa.playtopsecret.com with the word 'resign' in the subject line.`;

const debugConfig: ConfigState = {
        port: '3000',
        useDynamoDB: false,
        useEmail: false,
        useBasicAuth: false,
        debugDBTimeoutMs: 1000,
        credentials: null,
        messagesTableName: 'message-dev',
        playersTableName: 'player-dev',
        gameKeyTableName: 'game-key-dev',
        emailDomain: 'nsa.playtopsecret.com',
        updateIntervalMs: 1000,
        content: {
                validApplicationThread: 'transfer_request_valid',
                validApplicationThreadPGP: 'transfer_request_valid_pgp',
                invalidApplicationThread: 'transfer_request_invalid',
                invalidApplicationMissingFirstNameThread: 'transfer_request_missing_first_name',
                invalidApplicationMissingLastNameThread: 'transfer_request_missing_last_name',
                invalidApplicationMissingKeyThread: 'transfer_request_missing_key',
                invalidApplicationInvalidKeyThread: 'transfer_request_invalid_key',
                resignationThread: 'resign',
                narrativeFolder: '../../topsecret-content/game',
                defaultNarrativeGroup: '2',
                messageSchemaPath: '../core/src/messageschema.json',
                profileSchemaPath: '../core/src/profileschema.json',
                replyOptionSchemaPath: '../core/src/replyoptionschema.json',
                htmlFooter: htmlFooter,
                textFooter: textFooter,
        },
        timeFactor: (1/60) * 1000
};

const releaseConfig: ConfigState = {
        port: '3000',
        useDynamoDB: true,
        useEmail: true,
        useBasicAuth: true,
        debugDBTimeoutMs: 1000,
        credentials: null,
        messagesTableName: 'message-dev',
        playersTableName: 'player-dev',
        gameKeyTableName: 'game-key-dev',
        emailDomain: 'nsa.playtopsecret.com',
        updateIntervalMs: 1000,
        content: {
                validApplicationThread: 'transfer_request_valid',
                validApplicationThreadPGP: 'transfer_request_valid_pgp',
                invalidApplicationThread: 'transfer_request_invalid',
                invalidApplicationMissingFirstNameThread: 'transfer_request_missing_first_name',
                invalidApplicationMissingLastNameThread: 'transfer_request_missing_last_name',
                invalidApplicationMissingKeyThread: 'transfer_request_missing_key',
                invalidApplicationInvalidKeyThread: 'transfer_request_invalid_key',
                resignationThread: 'resign',
                narrativeFolder: '../../topsecret-content/game',
                defaultNarrativeGroup: '2',
                messageSchemaPath: '../core/src/messageschema.json',
                profileSchemaPath: '../core/src/profileschema.json',
                replyOptionSchemaPath: '../core/src/replyoptionschema.json',
                htmlFooter: htmlFooter,
                textFooter: textFooter,
        },
        timeFactor: 1
};

export const releaseMode = true;
export const config = releaseMode ? releaseConfig : debugConfig;
