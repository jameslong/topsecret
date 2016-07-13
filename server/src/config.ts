import Data = require('../../core/src/app/data');
import FileSystem = require('../../core/src/app/filesystem');
import Helpers = require('../../core/src/app/utils/helpers');

export interface AWSConfig {
        accessKeyId: string;
        secretAccessKey: string;
        region: string;
        messagesTableName: string;
        playersTableName: string;
}

export interface MailgunConfig {
        apiKey: string;
}

export interface BasicAuthConfig {
        user: string;
        password: string;
}

export interface ConfigState {
        port: string;
        useDynamoDB: boolean;
        useEmail: boolean;
        useBasicAuth: boolean;
        debugDBTimeoutMs: number;
        aws: AWSConfig;
        basicAuth: BasicAuthConfig;
        mailgun: MailgunConfig;
        emailDomain: string;
        updateIntervalMs: number;
        content: {
                narrativeFolder: string;
                defaultNarrativeGroup: string;
                validApplicationThread: string;
                validApplicationThreadPGP: string;
                invalidApplicationThread: string;
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
        let awsConfig: AWSConfig = null;
        let authConfig: BasicAuthConfig = null;
        let mailgunConfig: MailgunConfig = null;
        try {
                awsConfig = <AWSConfig>FileSystem.loadJSONSync(
                        `${path}/credentials/aws.json`);
                authConfig = <BasicAuthConfig>FileSystem.loadJSONSync(
                        `${path}/credentials/basicauth.json`);
                mailgunConfig = <MailgunConfig>FileSystem.loadJSONSync(
                        `${path}/credentials/mailgun.json`);
        } catch (e) {
                console.log('Using example credentials');
                awsConfig = <AWSConfig>FileSystem.loadJSONSync(
                        `${path}/example_credentials/aws.json`);
                authConfig = <BasicAuthConfig>FileSystem.loadJSONSync(
                        `${path}/example_credentials/basicauth.json`);
                mailgunConfig = <MailgunConfig>FileSystem.loadJSONSync(
                        `${path}/example_credentials/mailgun.json`);
        }
        return {
                aws: awsConfig,
                basicAuth: authConfig,
                mailgun: mailgunConfig,
        };
}
