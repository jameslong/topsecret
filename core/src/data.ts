import FileSystem = require('./filesystem');
import Func = require('./utils/function');
import Helpers = require('./utils/helpers');
import Map = require('./utils/map');
import Message = require('./message');
import Profile = require('./profile');
import ReplyOption = require('./replyoption');
import State = require('./state');

export interface Path {
        basename: (path: string, ext?: string) => string;
}

export interface Stats {
        isDirectory: () => boolean;
}

export function loadNarrativeData (path: string)
{
        const groupNames = FileSystem.loadDirectoryNamesSync(path);
        return groupNames.map(name => loadNarrative(path, name));
}

export function join (...paths: string[]): string
{
        return paths.join('/');
}

export function loadGameData (path: string, name: string)
{
        const narrative = loadNarrative(path, name);
        return State.addKeyManagers(narrative);
}

export function initKeyManagers (data: State.NarrativeData[])
{
        const promises = data.map(narrative => State.addKeyManagers(narrative));
        return Promise.all(promises);
}

export function loadNarrative (stem: string, name: string): State.NarrativeData
{
        const path = join(stem, name);
        const profilesPath = join(path, 'profiles');
        const messagesPath = join(path, 'messages');
        const replyOptionsPath = join(path, 'replyoptions');
        const stringsPath = join(path, 'strings');
        const attachmentsPath = join(path, 'attachments');

        const profiles = FileSystem.loadJSONDirSync<Profile.Profile>(profilesPath);
        const messages = FileSystem.loadJSONDirSync<Message.ThreadMessage>(messagesPath);
        const replyOptions = FileSystem.loadJSONDirAsMap<ReplyOption.ReplyOption[]>(replyOptionsPath);
        const strings = FileSystem.loadJSONDirAsMap<string>(stringsPath);
        const attachmentPaths = FileSystem.readFilenamesSync(attachmentsPath);
        const attachments = Helpers.mapFromArray(
                attachmentPaths, Func.identity,
                path => join(attachmentsPath, path));

        return {
                name,
                profiles: Helpers.mapFromNameArray(profiles),
                messages: Helpers.mapFromNameArray(messages),
                replyOptions,
                strings,
                attachments,
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
