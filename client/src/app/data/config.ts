import Helpers = require('../../../core/src/app/utils/helpers');

export interface QueryStringParams {
        version: string;
        messageName: string;
}

export interface ConfigData {
        emailDomain: string;
        immediateReplies: boolean;
        timeFactor: number;
        serverURL: string;
        version: string;
        beginGameMessage: string;
}
function getQueryVariable (variable: string): string
{
        const querystring = window.location.search.substring(1);
        const vars = querystring.split('&');
        for (let i = 0; i < vars.length; i += 1) {
                const pair = vars[i].split('=');
                if (pair[0] === variable) {
                        return pair[1];
                }
        }
        console.log(`Query string variable not found: ${variable}`);
        return null;
}

function getQueryStringParams (): QueryStringParams
{
        const version = getQueryVariable('version') || 'test_data';
        const messageName = getQueryVariable('messageName') || 'reply_expired';
        return { version, messageName };
}

export function createConfig (): ConfigData
{
        const params = getQueryStringParams();
        return {
                emailDomain: 'nsa.gov',
                immediateReplies: false,
                timeFactor: 1,
                serverURL: 'http://127.0.0.1:3000',
                version: params.version,
                beginGameMessage: params.messageName,
        };
}
