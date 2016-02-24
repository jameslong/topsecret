import Command = require('./command');
import Data = require('./data');
import Draft = require('./draft');
import Folder = require('./folder');
import Helpers = require('./utils/helpers');
import Kbpgp = require('kbpgp');
import KbpgpHelpers = require('./kbpgp');
import Map = require('./map/map');
import Message = require('./message');
import Player = require('./player');
import UI = require('./ui');

export interface State {
        data: Data.Data;
        ui: UI.UI;
        draftKey: KbpgpHelpers.KeyData;
        draftMessage: Draft.Draft;
        messageId: number;
};

export function createState (
        player: Player.Player,
        commands: Command.Command[],
        commandIdsByMode: Data.IdsById,
        folders: Folder.FolderData[],
        keyManagersById: Map.Map<Kbpgp.KeyManagerInstance>): State
{
        const data = Data.createData(
                folders,
                commands,
                commandIdsByMode,
                player,
                keyManagersById);

        const folderId = data.folders[0];
        const keyId = player.activeKeyId;
        const messageId = data.messageIdsByFolderId[folderId][0];
        const ui = UI.createUI(
                UI.Modes.INDEX_INBOX, messageId, folderId, keyId);


        return {
                data,
                ui,
                draftKey: null,
                draftMessage: null,
                messageId: 0,
        };
}

export function nextMessageId (state: State)
{
        return (state.messageId + 1);
}

export function getActiveMessage (state: State)
{
        const activeMessageId = state.ui.activeMessageId;
        return state.data.messagesById[activeMessageId];
}
export function getActiveFolder (state: State)
{
        const activeFolderId = state.ui.activeFolderId;
        return state.data.foldersById[activeFolderId];
}

export function getActiveCommands (state: State)
{
        return getCommands(state.data, state.ui.mode);
}

export function getCommands (data: Data.Data, mode: string)
{
        const commandsById = data.commandsById;
        const commandIds = data.commandIdsByMode[mode];
        return commandIds.map(id => commandsById[id]);
}

export function getActiveMessages (state: State)
{
        return getMessages(state.data, state.ui.activeFolderId);
}

export function getMessages (data: Data.Data, folderId: string)
{
        const messageIds = data.messageIdsByFolderId[folderId];
        return messageIds.map(id => data.messagesById[id]);
}
