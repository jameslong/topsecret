import Actions = require('./actions');
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

                case Actions.Types.SET_DRAFT_BODY:
                        const setDraftBody = <Actions.SetDraftBody><any>action;
                        return handleSetDraftBody(ui, setDraftBody);

                case Actions.Types.SET_DRAFT_SUBJECT:
                        const setDraftSubject = <Actions.SetDraftSubject><any>action;
                        return handleSetDraftSubject(ui, setDraftSubject);

                case Actions.Types.SET_DRAFT_TO:
                        const setDraftTo = <Actions.SetDraftTo><any>action;
                        return handleSetDraftTo(ui, setDraftTo);

                case Actions.Types.EDIT_BODY:
                        const editBody = <Actions.EditBody><any>action;
                        return handleEditBody(ui, editBody);

                case Actions.Types.EDIT_SUBJECT:
                        const editSubject = <Actions.EditSubject><any>action;
                        return handleEditSubject(ui, editSubject);

                case Actions.Types.EDIT_TO:
                        const editTo = <Actions.EditTo><any>action;
                        return handleEditTo(ui, editTo);

                case Actions.Types.START_GENERATE_KEY:
                        const startGenerateKey = <Actions.StartGenerateKey><any>action;
                        return handleStartGenerateKey(ui, startGenerateKey);

                case Actions.Types.GENERATED_KEY:
                        const generatedKey = <Actions.GeneratedKey><any>action;
                        return handleGeneratedKey(ui, generatedKey);

                case Actions.Types.SET_DRAFT_KEY_NAME:
                        const setDraftKeyName = <Actions.SetDraftKeyName><any>action;
                        return handleSetDraftKeyName(ui, setDraftKeyName);

                case Actions.Types.SET_DRAFT_KEY_PASSPHRASE:
                        const setDraftKeyPassphrase = <Actions.SetDraftKeyPassphrase><any>action;
                        return handleSetDraftKeyPassphrase(ui, setDraftKeyPassphrase);

                case Actions.Types.SET_ACTIVE_KEY:
                        const setActiveKey = <Actions.SetActiveKey><any>action;
                        return handleSetActiveKey(ui, setActiveKey);

                case Actions.Types.RECEIVE_REPLY:
                        const receiveAction = <Actions.ReceiveReply><any>action;
                        return handleReceiveReply(ui, receiveAction);

                default:
                        return ui;
        }
}

function handleBlur (ui: UI.UI, action: Actions.Blur)
{
        const editingDraftBody = false;
        const editingDraftSubject = false;
        const editingDraftTo = false;
        return Helpers.assign(ui, {
                editingDraftBody,
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

function handleSetDraftBody (ui: UI.UI, action: Actions.SetDraftBody)
{
        const editingDraftBody = false;
        return Helpers.assign(ui, { editingDraftBody });
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
        const editingDraftBody = action.parameters;
        return Helpers.assign(ui, { editingDraftBody });
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

function handleStartGenerateKey (ui: UI.UI, action: Actions.StartGenerateKey)
{
        const editingDraftKeyName = true;
        return Helpers.assign(ui, { editingDraftKeyName });
}

function handleGeneratedKey (ui: UI.UI, action: Actions.GeneratedKey)
{
        const generatingKey = false;
        return Helpers.assign(ui, { generatingKey });
}

function handleSetDraftKeyName (ui: UI.UI, action: Actions.SetDraftKeyName)
{
        const editingDraftKeyName = false;
        const editingDraftKeyPassphrase = true;
        return Helpers.assign(ui, {
                editingDraftKeyName,
                editingDraftKeyPassphrase
        });
}

function handleSetDraftKeyPassphrase (ui: UI.UI, action: Actions.SetDraftKeyPassphrase)
{
        const editingDraftKeyPassphrase = false;
        const generatingKey = true;
        return Helpers.assign(ui, {
                editingDraftKeyPassphrase,
                generatingKey,
        });
}

function handleSetActiveKey (ui: UI.UI, action: Actions.SetActiveKey)
{
        const activeKeyId = action.parameters;
        return Helpers.assign(ui, { activeKeyId });
}

function handleReceiveReply (ui: UI.UI, action: Actions.ReceiveReply)
{
        const replyId = action.parameters.id;
        const activeMessageId = ui.activeMessageId;
        return activeMessageId === null ?
                Helpers.assign(ui, { activeMessageId: replyId }) :
                ui;
}
