import Data = require('../../../core/src/app/data');
import FileSystem = require('../../../core/src/app/filesystem');
import Helpers = require('../../../core/src/app/utils/helpers');

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

export interface ConfigState {
        port: string;
        useDynamoDB: boolean;
        useEmail: boolean;
        debugDBTimeoutMs: number;
        aws: AWSConfig;
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
        },
        timeFactor: number;
}

export function loadCredentials(path: string)
{
        let awsConfig: AWSConfig = null;
        let mailgunConfig: MailgunConfig = null;
        try {
                awsConfig = <AWSConfig>FileSystem.loadJSONSync(
                        `${path}/credentials/aws.json`);
                mailgunConfig = <MailgunConfig>FileSystem.loadJSONSync(
                        `${path}/credentials/mailgun.json`);
        } catch (e) {
                console.log('Using example credentials');
                awsConfig = <AWSConfig>FileSystem.loadJSONSync(
                        `${path}/example_credentials/aws.json`);
                mailgunConfig = <MailgunConfig>FileSystem.loadJSONSync(
                        `${path}/example_credentials/mailgun.json`);
        }
        return {
                aws: awsConfig,
                mailgun: mailgunConfig,
        };
}
