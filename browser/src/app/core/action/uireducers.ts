import Actions = require('./actions');
import Arr = require('../../../../../core/src/app/utils/array');
import Helpers = require('../../../../../core/src/app/utils/helpers');
import Folder = require('../folder');
import Redux = require('../redux/redux');
import UI = require('../ui');

export function ui (ui: UI.UI, action: Redux.Action<any>)
{
        switch (action.type) {
                case Actions.Types.BLUR:
                        const blur = <Actions.Blur><any>action;
                        return handleBlur(ui, blur);

                case Actions.Types.SET_ACTIVE_MESSAGE:
                        const setActiveMessage = <Actions.SetActiveMessage><any>action;
                        return handleSetActiveMessage(ui, setActiveMessage);

                case Actions.Types.DIPLAY_MESSAGE:
                        const displayMessage = <Actions.DisplayMessage><any>action;
                        return handleDisplayMessage(ui, displayMessage);

                case Actions.Types.SET_MODE:
                        const setMode = <Actions.SetMode><any>action;
                        return handleSetMode(ui, setMode);

                case Actions.Types.COMPOSE_MESSAGE:
                        const composeMessage = <Actions.ComposeMessage><any>action;
                        return handleComposeMessage(ui, composeMessage);

                case Actions.Types.COMPOSE_REPLY:
                        const composeReply = <Actions.ComposeReply><any>action;
                        return handleComposeReply(ui, composeReply);

                case Actions.Types.SEND_MESSAGE:
                        const sendMessage = <Actions.SendMessage><any>action;
                        return handleSendMessage(ui, sendMessage);

                case Actions.Types.SENDING_MESSAGE:
                        const sendingMessage = <Actions.SendingMessage><any>action;
                        return handleSendingMessage(ui, sendingMessage);

                case Actions.Types.DECRYPT_MESSAGE:
                        const decryptMessage = <Actions.DecryptMessage><any>action;
                        return handleDecryptMessage(ui, decryptMessage);

                case Actions.Types.DECRYPTING_MESSAGE:
                        const decryptingMessage = <Actions.DecryptingMessage><any>action;
                        return handleDecryptingMessage(ui, decryptingMessage);

                case Actions.Types.SET_ACTIVE_FOLDER:
                        const setActiveFolder = <Actions.SetActiveFolder><any>action;
                        return handleSetActiveFolder(ui, setActiveFolder);

                case Actions.Types.DISPLAY_FOLDER:
                        const displayFolder = <Actions.DisplayFolder><any>action;
                        return handleDisplayFolder(ui, displayFolder);

                case Actions.Types.SET_DRAFT_SUBJECT:
                        const setDraftSubject = <Actions.SetDraftSubject><any>action;
                        return handleSetDraftSubject(ui, setDraftSubject);

                case Actions.Types.SET_DRAFT_TO:
                        const setDraftTo = <Actions.SetDraftTo><any>action;
                        return handleSetDraftTo(ui, setDraftTo);

                case Actions.Types.EDIT_BODY:
                        const editBody = <Actions.EditBody><any>action;
                        return handleEditBody(ui, editBody);

                case Actions.Types.END_EDIT_BODY:
                        const endEditBody = <Actions.EndEditBody><any>action;
                        return handleEndEditBody(ui, endEditBody);

                case Actions.Types.EDIT_SUBJECT:
                        const editSubject = <Actions.EditSubject><any>action;
                        return handleEditSubject(ui, editSubject);

                case Actions.Types.EDIT_TO:
                        const editTo = <Actions.EditTo><any>action;
                        return handleEditTo(ui, editTo);

                case Actions.Types.SET_ACTIVE_KEY_INDEX:
                        const setActiveKey = <Actions.SetActiveKeyIndex><any>action;
                        return handleSetActiveKeyIndex(ui, setActiveKey);

                case Actions.Types.RECEIVE_REPLY:
                        const receiveAction = <Actions.ReceiveReply><any>action;
                        return handleReceiveReply(ui, receiveAction);

                case Actions.Types.SET_ACTIVE_MENU_INDEX:
                        const setMenuIndex = <Actions.SetActiveMenuIndex><any>action;
                        return handleSetActiveMenuIndex(ui, setMenuIndex);

                case Actions.Types.SET_ACTIVE_LOAD_MENU_INDEX:
                        const setLoadIndex = <Actions.SetActiveLoadIndex><any>action;
                        return handleSetActiveLoadIndex(ui, setLoadIndex);

                case Actions.Types.SET_ACTIVE_SAVE_MENU_INDEX:
                        const setSaveIndex = <Actions.SetActiveSaveIndex><any>action;
                        return handleSetActiveSaveIndex(ui, setSaveIndex);

                case Actions.Types.NEW_GAME:
                        const newGame = <Actions.NewGame><any>action;
                        return handleNewGame(ui, newGame);

                case Actions.Types.NEW_GAME_LOGIN:
                        const newGameLogin = <Actions.NewGameLogin><any>action;
                        return handleNewGameLogin(ui, newGameLogin);

                case Actions.Types.NEW_GAME_LOADING_INFO:
                        const loadingInfo = <Actions.NewGameLoadingInfo><any>action;
                        return handleNewGameLoadingInfo(ui, loadingInfo);

                case Actions.Types.IMPORT_SAVE_DATA:
                        const saveData = <Actions.ImportSaveData><any>action;
                        return handleImportSaveData(ui, saveData);

                default:
                        return ui;
        }
}

function handleBlur (ui: UI.UI, action: Actions.Blur)
{
        const editingDraftSubject = false;
        const editingDraftTo = false;
        return Helpers.assign(ui, {
                editingDraftSubject,
                editingDraftTo
        });
}

function handleSetActiveMessage (ui: UI.UI, action: Actions.SetActiveMessage)
{
        const activeMessageId = action.parameters;
        return Helpers.assign(ui, { activeMessageId });
}

function handleDisplayMessage (ui: UI.UI, action: Actions.DisplayMessage)
{
        const temp = handleSetActiveMessage(ui, action);
        return UI.setMode(temp, UI.Modes.PAGER);
}

function handleSetMode (ui: UI.UI, action: Actions.SetMode)
{
        return UI.setMode(ui, action.parameters);
}

function handleComposeMessage (ui: UI.UI, action: Actions.ComposeMessage)
{
        return UI.setMode(ui, UI.Modes.COMPOSE);
}

function handleComposeReply (ui: UI.UI, action: Actions.ComposeReply)
{
        return UI.setMode(ui, UI.Modes.COMPOSE);
}

function handleSendMessage (ui: UI.UI, action: Actions.SendMessage)
{
        const sending = false;
        const temp = Helpers.assign(ui, { sending });
        return UI.setMode(temp, UI.Modes.INDEX_INBOX);
}

function handleSendingMessage (ui: UI.UI, action: Actions.SendingMessage)
{
        const sending = action.parameters;
        return Helpers.assign(ui, { sending });
}

function handleDecryptMessage (ui: UI.UI, action: Actions.DecryptMessage)
{
        const decrypting = false;
        return Helpers.assign(ui, { decrypting });
}

function handleDecryptingMessage (ui: UI.UI, action: Actions.DecryptingMessage)
{
        const decrypting = action.parameters;
        return Helpers.assign(ui, { decrypting });
}

function handleSetActiveFolder (ui: UI.UI, action: Actions.SetActiveFolder)
{
        const activeFolderId = action.parameters;
        return Helpers.assign(ui, { activeFolderId });
}

function handleDisplayFolder (ui: UI.UI, action: Actions.DisplayFolder)
{
        const parameters = action.parameters;
        const activeFolderId = parameters.folderId;
        const activeMessageId = parameters.messageId;
        const folderType = parameters.folderType;
        const temp = Helpers.assign(ui, { activeFolderId, activeMessageId });
        const mode = folderType === Folder.Types.INBOX ?
                UI.Modes.INDEX_INBOX : UI.Modes.INDEX_SENT;
        return UI.setMode(temp, mode);
}

function handleSetDraftSubject (ui: UI.UI, action: Actions.SetDraftSubject)
{
        const editingDraftSubject = false;
        return Helpers.assign(ui, { editingDraftSubject });
}

function handleSetDraftTo (ui: UI.UI, action: Actions.SetDraftTo)
{
        const editingDraftTo = false;
        return Helpers.assign(ui, { editingDraftTo });
}

function handleEditBody (ui: UI.UI, action: Actions.EditBody)
{
        return UI.setMode(ui, UI.Modes.COMPOSE_BODY);
}

function handleEndEditBody (ui: UI.UI, action: Actions.EditBody)
{
        return UI.setMode(ui, UI.Modes.COMPOSE);
}

function handleEditSubject (ui: UI.UI, action: Actions.EditSubject)
{
        const editingDraftSubject = action.parameters;
        return Helpers.assign(ui, { editingDraftSubject });
}

function handleEditTo (ui: UI.UI, action: Actions.EditTo)
{
        const editingDraftTo = action.parameters;
        return Helpers.assign(ui, { editingDraftTo });
}

function handleSetActiveKeyIndex (ui: UI.UI, action: Actions.SetActiveKeyIndex)
{
        const activeKeyIndex = action.parameters;
        return Helpers.assign(ui, { activeKeyIndex });
}

function handleReceiveReply (ui: UI.UI, action: Actions.ReceiveReply)
{
        const replyId = action.parameters.id;
        const activeMessageId = ui.activeMessageId;
        return activeMessageId === null ?
                Helpers.assign(ui, { activeMessageId: replyId }) :
                ui;
}

function handleSetActiveMenuIndex (
        ui: UI.UI, action: Actions.SetActiveMenuIndex)
{
        const activeMainMenuIndex = action.parameters;
        return Helpers.assign(ui, { activeMainMenuIndex });
}

function handleSetActiveLoadIndex (
        ui: UI.UI, action: Actions.SetActiveLoadIndex)
{
        const activeLoadIndex = action.parameters;
        return Helpers.assign(ui, { activeLoadIndex });
}

function handleSetActiveSaveIndex (
        ui: UI.UI, action: Actions.SetActiveSaveIndex)
{
        const activeSaveIndex = action.parameters;
        return Helpers.assign(ui, { activeSaveIndex });
}

function handleNewGame (ui: UI.UI, action: Actions.NewGame)
{
        return UI.setMode(ui, UI.Modes.INDEX_INBOX);
}

function handleNewGameLogin (ui: UI.UI, action: Actions.NewGameLogin)
{
        return UI.setMode(ui, UI.Modes.NEW_GAME_LOADING);
}

function handleNewGameLoadingInfo (
        ui: UI.UI, action: Actions.NewGameLoadingInfo)
{
        const max = 8;
        const info = action.parameters;
        const loadingInfo = Arr.push(ui.loadingInfo, info)

        return Helpers.assign(ui, { loadingInfo });
}

function handleImportSaveData (ui: UI.UI, action: Actions.ImportSaveData)
{
        return UI.setMode(ui, UI.Modes.INDEX_INBOX);
}
