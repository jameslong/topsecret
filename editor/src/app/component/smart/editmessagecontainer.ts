import ActionCreators = require('../../action/actioncreators');
import Immutable = require('immutable');
import Message = require('../../message');
import MessageDelay = require('../../messagedelay');
import ReactUtils = require('../../redux/react');
import Redux = require('../../redux/redux');
import State = require('../../state');

import EditMessage = require('../dumb/editmessage');

interface EditMessageContainerInt {
        name: string,
        store: State.Store;
};
export type EditMessageContainerData = Immutable.Record.IRecord<EditMessageContainerInt>;
export const EditMessageContainerData = Immutable.Record<EditMessageContainerInt>({
        name: '',
        store: State.Store(),
}, 'EditMessageContainer');

type EditMessageContainerProps = ReactUtils.Props<EditMessageContainerData>;

function render (props: EditMessageContainerProps)
{
        const data = props.data;
        const name = data.name;

        const onDeleteLocal = () => onDelete(name);
        const onSetNameScratchpadLocal = (newName: string) =>
                onSetNameScratchpad(name, newName);
        const onSetNameLocal = () => onSetName(name);
        const onSetSubjectNameLocal = (subjectName: string) =>
                onSetSubjectName(name, subjectName);
        const onSetStringLocal = (name: string, value: string) =>
                onSetString(name, value);
        const onSetEndGameLocal = (endGame: boolean) =>
                onSetEndGame(name, endGame);
        const onSetEncryptedLocal = (encrypted: boolean) =>
                onSetEncrypted(name, encrypted);
        const onSetScriptLocal = (script: string) =>
                onSetScript(name, script);
        const onSetChildrenLocal = (delays: MessageDelay.MessageDelays) =>
                onSetChildren(name, delays);
        const onSetFallbackLocal = (delay: MessageDelay.MessageDelay) =>
                onSetFallback(name, delay);

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

function onDelete (name: string)
{
        const action = ActionCreators.deleteMessage(name);
        Redux.handleAction(action);
}

function onSetNameScratchpad (
        messageName: string, newName: string)
{
        const action = ActionCreators.setEditedMessageName({
                name: messageName,
                value: newName,
        });
        Redux.handleAction(action);
}

function onSetName (messageName: string)
{
        const action = ActionCreators.setMessageName({
                name: messageName,
                value: null,
        });
        Redux.handleAction(action);
}

function onSetSubjectName (messageName: string, newSubject: string)
{
        const action = ActionCreators.setMessageSubject({
                name: messageName,
                value: newSubject,
        });
        Redux.handleAction(action);
}

export function onSetString (
        stringName: string, value: string)
{
        const action = ActionCreators.setString({
                name: stringName,
                value: value,
        });
        Redux.handleAction(action);
}

function onSetEndGame (messageName: string, newEndGame: boolean)
{
        const action = ActionCreators.setMessageEndGame({
                name: messageName,
                value: newEndGame,
        });
        Redux.handleAction(action);
}

function onSetEncrypted (messageName: string, newEncrypted: boolean)
{
        const action = ActionCreators.setMessageEncrypted({
                name: messageName,
                value: newEncrypted,
        });
        Redux.handleAction(action);
}

function onSetScript (messageName: string, newScript: string)
{
        const action = ActionCreators.setMessageScript({
                name: messageName,
                value: newScript,
        });
        Redux.handleAction(action);
}

function onSetChild (
        message: Message.Message,
        delay: MessageDelay.MessageDelay,
        index: number)
{
        const children = message.children;
        const newChildren = children.set(index, delay);
        onSetChildren(message.name, newChildren);
}

function onSetChildren (
        messageName: string,
        delays: Immutable.List<MessageDelay.MessageDelay>)
{
        const action = ActionCreators.setMessageChildren({
                name: messageName,
                value: delays,
        });
        Redux.handleAction(action);
}

function onAddChild (message: Message.Message)
{
        const newChild = MessageDelay.MessageDelay();
        const children = message.children;
        const newChildren = children.push(newChild);
        onSetChildren(message.name, newChildren);
}

function onRemoveChild (message: Message.Message, index: number)
{
        const children = message.children;
        const newChildren = children.delete(index);
        onSetChildren(message.name, newChildren);
}

function onSetFallback (messageName: string, newDelay: MessageDelay.MessageDelay)
{
        const action = ActionCreators.setMessageFallback({
                name: messageName,
                value: newDelay,
        });
        Redux.handleAction(action);
}

function onAddFallback (messageName: string)
{
        const newDelay = MessageDelay.MessageDelay();
        onSetFallback(messageName, newDelay);
}

function onRemoveFallback (messageName: string)
{
        onSetFallback(messageName, null);
}
