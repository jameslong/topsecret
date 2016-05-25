import AppData = require('./data/appdata');
import Arr = require('../../../../core/src/app/utils/array');
import Clock = require('../../../../core/src/app/clock');
import Command = require('./command');
import Folder = require('./folder');
import Func = require('../../../../core/src/app/utils/function');
import Helpers = require('../../../../core/src/app/utils/helpers');
import Message = require('./message');
import MessageCore = require('../../../../core/src/app/message');
import Kbpgp = require('kbpgp');
import KbpgpHelpers = require('../../../../core/src/app/kbpgp');
import Map = require('../../../../core/src/app/utils/map');
import Player = require('./player');
import Profile = require('../../../../core/src/app/profile');

export type IdsById = Map.Map<string[]>;

export interface RuntimeData {
        player: Player.Player;
        messagesById: Map.Map<Message.Message>;
        messageIdsByFolderId: IdsById;
        clock: Clock.Clock;
}

export interface Data extends RuntimeData {
        folders: string[];
        foldersById: Map.Map<Folder.Folder>;
        commandsById: Map.Map<Command.Command>;
        commandIdsByMode: IdsById;
        menuItems: string[];
        profiles: string[];
        profilesById: Map.Map<Profile.Profile>;
        knownKeyIds: string[];
}

type Id = { id: string; }
export function getId<T extends Id>(value: T)
{
        return value.id;
}

function idMapFromArray<T extends Id>(array: T[])
{
        return Helpers.mapFromArray(array, getId, Func.identity);
}

function idMapFromParentArray<T, U extends Id>(
        array: T[], getChildren: (parent: T) => U[])
{
        return Helpers.mapFromParentArray(array, getChildren, getId);
}

function childIdsByParentIds<T extends Id, U extends Id>(
        array: T[], getChildren: (parent: T) => U[])
{
        const getChildIds = (value: T) => getChildren(value).map(getId);
        return Helpers.mapFromArray(array, getId, getChildIds)
}

function group<T, U>(
        array: T[],
        getValue: (value: T) => U,
        getGroupKey: (value: T) => string)
{
        const result: Map.Map<U[]> = {};
        return array.reduce((result, value) => {
                const groupKey = getGroupKey(value);
                const child = getValue(value);
                const group = result[groupKey] || [];
                group.push(child);
                result[groupKey] = group;
                return result;
        }, result);
}

export function createData(
        appData: AppData.AppData,
        profilesById: Map.Map<Profile.Profile>,
        player: Player.Player,
        clock: Clock.Clock): Data
{
        const { folders, commands, commandIdsByMode, menuItems } = appData;
        const getMessages = (folder: Folder.FolderData) => folder.messages;

        const foldersById = idMapFromArray(folders);
        const folderIds = folders.map(getId);
        const commandsById = idMapFromArray(commands);
        const messagesById = idMapFromParentArray(folders, getMessages);
        const messageIdsByFolderId = childIdsByParentIds(folders, getMessages);

        const profiles = Map.keys(profilesById);
        const knownKeyIds = Map.keys(profilesById);

        return {
                player,
                folders: folderIds,
                foldersById,
                commandsById,
                commandIdsByMode,
                menuItems,
                messagesById,
                messageIdsByFolderId,
                profiles,
                profilesById,
                knownKeyIds,
                clock,
        };
}

export function storeMessage (
        data: Data, message: Message.Message, folderId: string)
{
        const messageIds = data.messageIdsByFolderId[folderId];
        const newMessageIds = Arr.unshift(messageIds, message.id);
        const messageIdsByFolderId = Map.set(
                data.messageIdsByFolderId, folderId, newMessageIds);
        const messagesById = Map.set(
                data.messagesById, message.id, message);

        return Helpers.assign(data, { messagesById, messageIdsByFolderId });
}

export function updateMessage (data: Data, message: Message.Message)
{
        const messagesById = Map.set(
                data.messagesById, message.id, message);
        return Helpers.assign(data, { messagesById });
}

export function getMessage (data: Data, id: string)
{
        return data.messagesById[id];
}
