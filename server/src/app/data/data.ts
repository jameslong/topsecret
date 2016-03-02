import Arr = require('../../../../core/src/app/utils/array');
import Config = require('../config');
import DataValidation = require('./datavalidation');
import FileSystem = require('./filesystem');
import Kbpgp = require('../../../../core/src/app/kbpgp');
import Log = require('../../../../core/src/app/log/log');
import Map = require('../../../../core/src/app/utils/map');
import Message = require('../../../../core/src/app/message');
import Profile = require('../../../../core/src/app/profile');
import Request = require('../../../../core/src/app/requesttypes');
import State = require('../../../../core/src/app/state');

export interface Path {
        basename: (path: string, ext?: string) => string;
}

export interface Stats {
        isDirectory: () => boolean;
}

export interface NarrativeData {
        name: string;
        profiles: Map.Map<Profile.Profile>;
        messages: Map.Map<Message.ThreadMessage>;
        strings: Map.Map<string>;
}

export function loadPrivateConfig(config: Config.ConfigState)
{
        const configPath = join('credentials', config.privateConfigPath);
        var privateConfig =
                <Config.PrivateConfigState>FileSystem.loadJSONSync(configPath);

        config.emailAPIKey = privateConfig.emailAPIKey;
        config.client.elbURL = privateConfig.elbURL;
}

export function loadAllGameData (
        config: Config.ConfigState,
        callback: Request.Callback<State.GameData[]>)
{
        var content = config.content;
        var narrativeFolderPath = content.narrativeFolder;
        var groupNames = FileSystem.loadDirectoryNamesSync(narrativeFolderPath);

        var tasks = groupNames.map((groupName) => {
                        return (callback: Request.Callback<State.GameData>) =>
                                loadGameData(narrativeFolderPath, groupName, callback);
                });

        Request.sequence(tasks, callback);
}

export function join (...paths: string[]): string
{
        return paths.join('/');
}

export function loadGameData (
        path: string,
        name: string,
        callback: Request.Callback<State.GameData>)
{
        var groupData = loadGroupData(path, name);

        if (groupData) {
                var keyManagerCallback = createKeyManagerCallback(
                        groupData, callback);
                Kbpgp.loadKeyData(groupData.profiles, keyManagerCallback);
        } else {
                var error: Request.Error = {
                        code: null,
                        message: 'INVALID GAME DATA',
                };

                callback(error, groupData);
        }
}

export function createKeyManagerCallback (
        groupData: State.GameData,
        callback: Request.Callback<State.GameData>)
{
        return (error: Request.Error, keyManagers: Kbpgp.KeyManagers) =>
                {
                        groupData.keyManagers = keyManagers;
                        callback(error, groupData);
                };
}

export function loadGroupData (path: string, name: string): State.GameData
{
        var data = loadNarrative(path, name);
        var dataErrors = DataValidation.getDataErrors(data);

        if (dataErrors.length) {
                var errorText = JSON.stringify(dataErrors, null, 4);
                Log.debug('Invalid game data', errorText);

                return null;
        }

        return {
                name: name,
                keyManagers: null,
                profiles: data.profiles,
                threadData: data.messages,
                strings: data.strings,
        };
}

export function loadNarratives (path: string): Map.Map<NarrativeData>
{
        const narrativeNames = FileSystem.loadDirectoryNamesSync(path);
        const narratives = narrativeNames.map(
                name => loadNarrative(path, name));

        return Map.mapFromArray(narratives);
}

export function loadNarrative (stem: string, name: string): NarrativeData
{
        const path = join(stem, name);
        const profilesPath = join(path, 'profiles');
        const messagesPath = join(path, 'messages');
        const stringsPath = join(path, 'strings');

        const profiles = FileSystem.loadJSONDirSync<Profile.Profile>(profilesPath);
        const messages = FileSystem.loadJSONDirSync<Message.ThreadMessage>(messagesPath);
        const strings = FileSystem.loadJSONDirAsMap<string>(stringsPath);

        return {
                name: name,
                profiles: Map.mapFromArray(profiles),
                messages: Map.mapFromArray(messages),
                strings: strings,
        };
}

export function loadMessage (path: string): Message.ThreadMessage
{
        return FileSystem.loadJSONSync<Message.ThreadMessage>(path);
}

export function loadProfile (path: string): Profile.Profile
{
        return FileSystem.loadJSONSync<Profile.Profile>(path);
}

export function saveMessage (path: string, message: Message.ThreadMessage)
{
        FileSystem.saveJSONSync(path, message);
}

export function deleteMessage (path: string)
{
        FileSystem.deleteFile(path);
}
