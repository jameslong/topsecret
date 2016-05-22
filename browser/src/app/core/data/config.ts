export interface QueryStringParams {
        version: string;
        messageName: string;
}

export interface ConfigData {
        emailDomain: string;
        timeFactor: number;
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
        const version = getQueryVariable('version') || '0';
        const messageName = getQueryVariable('messageName') || 'welcome';
        return { version, messageName };
}

export function createConfig (): ConfigData
{
        const params = getQueryStringParams();
        return {
                emailDomain: 'nsa.gov',
                timeFactor: 1,
                version: params.version,
                beginGameMessage: params.messageName,
        };
}
