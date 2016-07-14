/// <reference path='../../typings/is-my-json-valid/is-my-json-valid.d.ts'/>

import FileSystem = require('./filesystem');
import Func = require('./utils/function');
import Helpers = require('./utils/helpers');
import Map = require('./utils/map');
import Message = require('./message');
import Profile = require('./profile');
import ReplyOption = require('./replyoption');
import Script = require('./script');
import State = require('./state');
import validator = require('is-my-json-valid');

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

export function getDataErrors (
        data: State.NarrativeData,
        profileSchema: JSON,
        messageSchema: JSON,
        replyOptionSchema: JSON): Object[]
{
        const profileErrors = getJSONDirErrors(profileSchema, data.profiles);
        const messageErrors = getJSONDirErrors(messageSchema, data.messages);
        const replyOptionErrors = getJSONDirErrors(
                replyOptionSchema, data.replyOptions);

        const messageList = <Message.ThreadMessage[]>Helpers.arrayFromMap(
                data.messages);
        const scriptErrors = getListErrors(messageList,
                message => Script.getScriptErrors(message.script));

        return profileErrors.concat(
                messageErrors, replyOptionErrors, scriptErrors);
}

interface SchemaValidateFn<T> {
        (object: T): boolean;
        errors: Object[];
}

export function getJSONDirErrors<T> (
        schema: Object, data: Map.Map<T>): Object[]
{
        const validate = validator(schema);

        return Map.reduce(data, (result, element, key) => {
                const error = getError(validate, element, key);
                if (error) {
                        result.push(error);
                }
                return result;
        }, []);
}

export function getError<T> (
        validateFn: SchemaValidateFn<T>, object: T, name: string): Object
{
        return validateFn(object) ? '' : { [name]: validateFn.errors };
}

function getListErrors<T extends { name: string }> (
        list: T[], validate: (element: T) => string)
{
        return list.reduce((result, element) => {
                const error = validate(element);
                if (error) {
                        console.log('error:', element.name, error);
                        result.push({ [element.name]: error });
                }
                return result;
        }, []);
}
