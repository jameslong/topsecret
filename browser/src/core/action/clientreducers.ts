import Actions = require('./actions');
import Data = require('../data');
import DataReducers = require('./datareducers');
import DraftReducers = require('./draftreducers');
import Helpers = require('../../../../core/src/utils/helpers');
import Main = require('./../main');
import Redux = require('../redux/redux');
import Client = require('../client');
import UIReducers = require('./uireducers');

export function client (client: Client.Client, action: Redux.Action<any>)
        : Client.Client
{
        let temp = client;

        switch (action.type) {
                case Actions.Types.IMPORT_SAVE_DATA:
                        const saveData = <Actions.ImportSaveData><any>action;
                        temp = handleImportSaveData(temp, saveData);
                        break;

                case Actions.Types.NEW_GAME:
                        const newGame = <Actions.NewGame><any>action;
                        temp = handleNewGame(temp, newGame);
                        break;

                default:
                        break;
        }

        return clientReducer(temp, action);
}

export function clientReducer (client: Client.Client, action: Redux.Action<any>)
{
        return {
                server: client.server,
                data: DataReducers.data(client.data, action),
                ui: UIReducers.ui(client.ui, action),
                draftMessage: DraftReducers.draft(client.draftMessage, action),
                messageId: messageId(client.messageId, action),
                openFile: client.openFile,
                openExternal: client.openExternal,
        };
}

export function messageId (messageId: number, action: Redux.Action<any>)
{
        switch (action.type) {
                case Actions.Types.SEND_MESSAGE:
                        return messageId + 1;
                default:
                        return messageId;
        }
}

function handleImportSaveData (
        client: Client.Client, action: Actions.ImportSaveData)
{
        const saveData = action.parameters;
        const { openFile, openExternal } = client;
        const gameData = client.server.app.narratives;
        return Main.newGameFromSave(gameData, openFile, openExternal, saveData);
}

function handleNewGame (client: Client.Client, action: Actions.NewGame)
{
        const player = action.parameters;
        const { openFile, openExternal } = client;
        const gameData = client.server.app.narratives;
        return Main.newGame(gameData, player, openFile, openExternal);
}
