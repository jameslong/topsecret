import Data = require('./data/data');
import FileSystem = require('./data/filesystem');

export enum AppMode {
        Local,
        DynamoDB,
};

export var ClientPost = {
        Local: 'Local',
        ELB: 'ELB',
};

export interface DynamoDBConfig {
        configFilepath: string;
        messagesTableName: string;
        playersTableName: string;
}

export interface PrivateConfigState {
        emailAPIKey: string;
        elbURL: string;
}

export interface ConfigState {
        mode: AppMode;
        port: string;
        privateConfigPath: string;
        client: {
                localURL: string;
                elbURL: string;
                postDest: string;
        };
        useEmail: boolean;
        debugDBTimeoutMs: number;
        dynamoDBConfig: DynamoDBConfig;
        emailDomain: string;
        emailAPIKey: string;
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
        immediateReplies: boolean;
}

export function loadPrivateConfig(config: ConfigState)
{
        const configPath = Data.join('credentials', config.privateConfigPath);
        const privateConfig =
                <PrivateConfigState>FileSystem.loadJSONSync(configPath);

        config.emailAPIKey = privateConfig.emailAPIKey;
        config.client.elbURL = privateConfig.elbURL;
}
