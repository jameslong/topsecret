import Data = require('../../../core/src/app/data');
import FileSystem = require('../../../core/src/app/filesystem');
import Helpers = require('../../../core/src/app/utils/helpers');

export enum AppMode {
        Local,
        DynamoDB,
};

export var ClientPost = {
        Local: 'Local',
        ELB: 'ELB',
};

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
        mode: AppMode;
        port: string;
        client: {
                localURL: string;
                elbURL: string;
                postDest: string;
        };
        useEmail: boolean;
        debugDBTimeoutMs: number;
        aws: AWSConfig;
        mailgun: MailgunConfig;
        emailDomain: string;
        logging: {
                console: boolean;
        },
        update: {
                maxMessagesRequestedPerUpdate: number;
                updateIntervalMs: number;
                minMessageUpdateIntervalMs: number;
        },
        content: {
                narrativeFolder: string;
                defaultNarrativeGroup: string;
                validApplicationThread: string;
                validApplicationThreadPGP: string;
                invalidApplicationThread: string;
                resignationThread: string;
                messageSchemaPath: string;
                profileSchemaPath: string;
        },
        timeFactor: number;
}

export function loadCredentials(config: ConfigState)
{
        let awsConfig: AWSConfig = null;
        let mailgunConfig: MailgunConfig = null;
        try {
                awsConfig = <AWSConfig>FileSystem.loadJSONSync(
                        'credentials/aws.json');
                mailgunConfig = <MailgunConfig>FileSystem.loadJSONSync(
                        'credentials/mailgun.json');
        } catch (e) {
                console.log('Using example credentials');
                awsConfig = <AWSConfig>FileSystem.loadJSONSync(
                        'example_credentials/aws.json');
                mailgunConfig = <MailgunConfig>FileSystem.loadJSONSync(
                        'example_credentials/mailgun.json');
        }
        Helpers.assign(config.aws, awsConfig);
}
