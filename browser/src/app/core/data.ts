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
        keyManagers: string[];
        keyManagersById: Map.Map<Kbpgp.KeyManagerInstance>;
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
        player: Player.Player,
        keyManagersById: Map.Map<Kbpgp.KeyManagerInstance>,
        clock: Clock.Clock): Data
{
        const { folders, commands, commandIdsByMode, menuItems } = appData;
        const getMessages = (folder: Folder.FolderData) => folder.messages;

        const foldersById = idMapFromArray(folders);
        const folderIds = folders.map(getId);
        const commandsById = idMapFromArray(commands);
        const messagesById = idMapFromParentArray(folders, getMessages);
        const messageIdsByFolderId = childIdsByParentIds(folders, getMessages);

        const keyManagers = Helpers.arrayFromMap(keyManagersById,
                (instance, id) => id);

        return {
                player,
                folders: folderIds,
                foldersById,
                commandsById,
                commandIdsByMode,
                menuItems,
                messagesById,
                messageIdsByFolderId,
                keyManagers,
                keyManagersById,
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

export function storeKeyManager (
        data: Data, id: string, instance: Kbpgp.KeyManagerInstance)
{
        const keyManagers = Arr.push(data.keyManagers, id);
        const keyManagersById = Map.set(data.keyManagersById, id, instance);
        return Helpers.assign(data, { keyManagers, keyManagersById });
}

export function deleteKey (data: Data, id: string)
{
        const keyManagers = Arr.removeValue(data.keyManagers, id);
        const keyManagersById = Map.remove(data.keyManagersById, id);

        const activeKeyId = data.player.activeKeyId;
        if (id === activeKeyId) {
                const player = Helpers.assign(
                        data.player, { activeKeyId: null });
                return Helpers.assign(data, {
                        player,
                        keyManagers,
                        keyManagersById,
                });
        } else {
                return Helpers.assign(data, { keyManagers, keyManagersById });
        }
}

export function createReplyEncryptData (
        reply: MessageCore.Reply, data: Data): KbpgpHelpers.EncryptData
{
        const keyManagersById = data.keyManagersById;
        const playerId = data.player.activeKeyId;
        const from = keyManagersById[playerId];
        const to = keyManagersById[reply.to];
        const text = reply.body;

        return { from, to, text };
}
