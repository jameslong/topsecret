import Actions = require('./actions');
import MathUtils = require('../math');
import EditorMessage = require('../editormessage');
import MessageDelay = require('../messagedelay');
import Narrative = require('../narrative');
import Redux = require('../redux/redux');
import ReplyOption = require('../../../../core/src/replyoption');

function createAction<T> (type: string, parameters: T): Redux.Action<T>
{
        return {
                type: type,
                parameters: parameters,
        };
}

function createActionCreator<T> (type: string)
{
        return (parameters: T) => createAction(type, parameters);
}

function createEmptyActionCreator (type: string)
{
        return () => createAction(type, null);
}

export const undo = createEmptyActionCreator(Actions.Types.UNDO);
export const redo = createEmptyActionCreator(Actions.Types.REDO);
export const save = createEmptyActionCreator(Actions.Types.SAVE);
export const setGameData = createActionCreator<Narrative.Narratives>(Actions.Types.SET_GAME_DATA);

export const endDrag = createActionCreator<Actions.EndDragParams>(Actions.Types.END_DRAG);
export const setActiveNarrative = createActionCreator<Actions.SetActiveNarrativeParams>(Actions.Types.SET_ACTIVE_NARRATIVE);
export const openMessage = createActionCreator<Actions.OpenMessageParams>(Actions.Types.OPEN_MESSAGE);
export const closeMessage = createActionCreator<Actions.CloseMessageParams>(Actions.Types.CLOSE_MESSAGE);
export const createMessage = createActionCreator<Actions.CreateMessageParams>(Actions.Types.CREATE_MESSAGE);
export const deleteMessages = createActionCreator<Actions.DeleteMessagesParams>(Actions.Types.DELETE_MESSAGES);
export const selectMessage = createActionCreator<Actions.SelectMessageParams>(Actions.Types.SELECT_MESSAGE);
export const uniqueSelectMessage = createActionCreator<Actions.UniqueSelectMessageParams>(Actions.Types.UNIQUE_SELECT_MESSAGE);
export const deselectMessage = createActionCreator<Actions.DeselectMessageParams>(Actions.Types.DESELECT_MESSAGE);
export const deselectAllMessages = createActionCreator<Actions.DeselectAllMessagesParams>(Actions.Types.DESELECT_ALL_MESSAGES);

export const setEditedMessageName = createActionCreator<Actions.SetEditedMessageNameParams>(Actions.Types.SET_EDITED_MESSAGE_NAME);
export const setMessageName = createActionCreator<Actions.SetMessageNameParams>(Actions.Types.SET_MESSAGE_NAME);
export const setMessageSubject = createActionCreator<Actions.SetMessageSubjectParams>(Actions.Types.SET_MESSAGE_SUBJECT);
export const setMessageBody = createActionCreator<Actions.SetMessageBodyParams>(Actions.Types.SET_MESSAGE_BODY);
export const setMessageEndGame = createActionCreator<Actions.SetMessageEndGameParams>(Actions.Types.SET_MESSAGE_END_GAME);
export const setMessageEncrypted = createActionCreator<Actions.SetMessageEncryptedParams>(Actions.Types.SET_MESSAGE_ENCRYPTED);
export const setMessageAttachment = createActionCreator<Actions.SetMessageAttachmentParams>(Actions.Types.SET_MESSAGE_ATTACHMENT);
export const setMessageScript = createActionCreator<Actions.SetMessageScriptParams>(Actions.Types.SET_MESSAGE_SCRIPT);
export const setMessagePosition = createActionCreator<Actions.SetMessagePositionParams>(Actions.Types.SET_MESSAGE_POSITION);
export const setMessageContent = createActionCreator<Actions.SetMessageContentParams>(Actions.Types.SET_MESSAGE_CONTENT);
export const setMessageFallback = createActionCreator<Actions.SetMessageFallbackParams>(Actions.Types.SET_MESSAGE_FALLBACK);
export const setMessageChildren = createActionCreator<Actions.SetMessageChildrenParams>(Actions.Types.SET_MESSAGE_CHILDREN);
export const setMessageReplyOptions = createActionCreator<Actions.SetMessageReplyOptionsParams>(Actions.Types.SET_MESSAGE_REPLY_OPTIONS);

export const setString = createActionCreator<Actions.SetStringParams>(Actions.Types.SET_STRING);
