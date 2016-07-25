import Helpers = require('../../../../core/src/utils/helpers');

export interface GameSettings {
        version: string;
        beginGameMessage: string;
        initialUIMode: string;
        timeFactor: number;
}

export interface ConfigData {
        hasCustomSettings: boolean;
        settings: GameSettings;
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

function getQueryStringParams (): GameSettings
{
        const version = getQueryVariable('version') || null;
        const beginGameMessage = getQueryVariable('messageName') || null;
        const initialUIMode = getQueryVariable('uiMode') || null;
        const timeFactorParam = getQueryVariable('timeFactor');
        const timeFactor = timeFactorParam ? parseFloat(timeFactorParam) : null;
        return {
                version,
                beginGameMessage,
                initialUIMode,
                timeFactor,
        };
}

export function createConfig (): ConfigData
{
        const params = getQueryStringParams();
        const defaultSettings = {
                version: '0',
                beginGameMessage: 'welcome',
                initialUIMode: 'MAIN_MENU',
                timeFactor: 1,
        };
        const customSettings = {
                version: params.version,
                beginGameMessage: params.beginGameMessage,
                initialUIMode: params.initialUIMode || defaultSettings.initialUIMode,
                timeFactor: params.timeFactor || defaultSettings.timeFactor,
        };
        const hasCustomSettings = params.beginGameMessage !== null;
        const settings = hasCustomSettings ? customSettings : defaultSettings;

        return {
                hasCustomSettings,
                settings,
        };
}
