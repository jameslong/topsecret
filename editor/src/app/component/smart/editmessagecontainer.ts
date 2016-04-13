import ActionCreators = require('../../action/actioncreators');
import Immutable = require('immutable');
import Message = require('../../message');
import MessageDelay = require('../../messagedelay');
import ReactUtils = require('../../redux/react');
import Redux = require('../../redux/redux');
import State = require('../../state');

import EditMessage = require('../dumb/editmessage');

interface EditMessageContainerInt {
        name: string;
        narrativeId: string;
        store: State.Store;
};
export type EditMessageContainerData = Immutable.Record.IRecord<EditMessageContainerInt>;
export const EditMessageContainerData = Immutable.Record<EditMessageContainerInt>({
        name: '',
        narrativeId: '',
        store: State.Store(),
}, 'EditMessageContainer');

type EditMessageContainerProps = ReactUtils.Props<EditMessageContainerData>;

function render (props: EditMessageContainerProps)
{
        const data = props.data;
        const name = data.name;
        const newName = data.store.data.nameScratchpad.get(name);
        const narrativeId = data.narrativeId;

        const onDeleteLocal = () => onDelete(narrativeId, name);
        const onSetNameScratchpadLocal = (newName: string) =>
                onSetNameScratchpad(narrativeId, name, newName);
        const onSetNameLocal = () => onSetName(narrativeId, name, newName);
        const onSetSubjectNameLocal = (subjectName: string) =>
                onSetSubjectName(narrativeId, name, subjectName);
        const onSetStringLocal = (name: string, value: string) =>
                onSetString(narrativeId, name, value);
        const onSetEndGameLocal = (endGame: boolean) =>
                onSetEndGame(narrativeId, name, endGame);
        const onSetEncryptedLocal = (encrypted: boolean) =>
                onSetEncrypted(narrativeId, name, encrypted);
        const onSetScriptLocal = (script: string) =>
                onSetScript(narrativeId, name, script);
        const onSetChildrenLocal = (delays: MessageDelay.MessageDelays) =>
                onSetChildren(narrativeId, name, delays);
        const onSetFallbackLocal = (delay: MessageDelay.MessageDelay) =>
                onSetFallback(narrativeId, name, delay);

        const editMessageData = EditMessage.EditMessageData({
                name: data.name,
                store: data.store,
                onDelete: onDeleteLocal,
                onSetNameScratchpad: onSetNameScratchpadLocal,
                onSetName: onSetNameLocal,
                onSetSubjectName: onSetSubjectNameLocal,
                onSetString: onSetStringLocal,
                onSetEndGame: onSetEndGameLocal,
                onSetEncrypted: onSetEncryptedLocal,
                onSetScript: onSetScriptLocal,
                onSetChildren: onSetChildrenLocal,
                onSetFallback: onSetFallbackLocal,
        });
        return EditMessage.EditMessage(editMessageData);
}

export const EditMessageContainer = ReactUtils.createFactory(render, 'EditMessageContainer');

function onDelete (narrativeId: string, name: string)
{
        const action = ActionCreators.deleteMessage({ name, narrativeId });
        Redux.handleAction(action);
}

function onSetNameScratchpad (
        narrativeId: string, messageName: string, newName: string)
{
        const action = ActionCreators.setEditedMessageName({
                narrativeId,
                name: messageName,
                value: newName,
        });
        Redux.handleAction(action);
}

function onSetName (narrativeId: string, name: string, newName: string)
{
        const action = ActionCreators.setMessageName({
                narrativeId,
                name,
                value: newName,
        });
        Redux.handleAction(action);
}

function onSetSubjectName (
        narrativeId: string, messageName: string, newSubject: string)
{
        const action = ActionCreators.setMessageSubject({
                narrativeId,
                name: messageName,
                value: newSubject,
        });
        Redux.handleAction(action);
}

export function onSetString (
        narrativeId: string, stringName: string, value: string)
{
        const action = ActionCreators.setString({
                narrativeId,
                name: stringName,
                value: value,
        });
        Redux.handleAction(action);
}

function onSetEndGame (
        narrativeId: string, messageName: string, newEndGame: boolean)
{
        const action = ActionCreators.setMessageEndGame({
                narrativeId,
                name: messageName,
                value: newEndGame,
        });
        Redux.handleAction(action);
}

function onSetEncrypted (
        narrativeId: string, messageName: string, newEncrypted: boolean)
{
        const action = ActionCreators.setMessageEncrypted({
                narrativeId,
                name: messageName,
                value: newEncrypted,
        });
        Redux.handleAction(action);
}

function onSetScript (
        narrativeId: string, messageName: string, newScript: string)
{
        const action = ActionCreators.setMessageScript({
                narrativeId,
                name: messageName,
                value: newScript,
        });
        Redux.handleAction(action);
}

function onSetChild (
        narrativeId: string,
        message: Message.Message,
        delay: MessageDelay.MessageDelay,
        index: number)
{
        const children = message.children;
        const newChildren = children.set(index, delay);
        onSetChildren(narrativeId, message.name, newChildren);
}

function onSetChildren (
        narrativeId: string,
        messageName: string,
        delays: Immutable.List<MessageDelay.MessageDelay>)
{
        const action = ActionCreators.setMessageChildren({
                narrativeId,
                name: messageName,
                value: delays,
        });
        Redux.handleAction(action);
}

function onAddChild (narrativeId: string, message: Message.Message)
{
        const newChild = MessageDelay.MessageDelay();
        const children = message.children;
        const newChildren = children.push(newChild);
        onSetChildren(narrativeId, message.name, newChildren);
}

function onRemoveChild (
        narrativeId: string, message: Message.Message, index: number)
{
        const children = message.children;
        const newChildren = children.delete(index);
        onSetChildren(narrativeId, message.name, newChildren);
}

function onSetFallback (
        narrativeId: string,
        messageName: string,
        newDelay: MessageDelay.MessageDelay)
{
        const action = ActionCreators.setMessageFallback({
                narrativeId,
                name: messageName,
                value: newDelay,
        });
        Redux.handleAction(action);
}

function onAddFallback (narrativeId: string, messageName: string)
{
        const newDelay = MessageDelay.MessageDelay();
        onSetFallback(narrativeId, messageName, newDelay);
}

function onRemoveFallback (narrativeId: string, messageName: string)
{
        onSetFallback(narrativeId, messageName, null);
}
