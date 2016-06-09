import ActionCreators = require('../../action/actioncreators');
import Arr = require('../../../../../core/src/app/utils/array');
import EditorMessage = require('../../editormessage');
import MessageDelay = require('../../messagedelay');
import React = require('react');
import Redux = require('../../redux/redux');
import State = require('../../state');

import EditMessage = require('../dumb/editmessage');

interface EditMessageContainerProps extends React.Props<any> {
        name: string;
        narrativeId: string;
        store: State.Store;
};

function renderEditMessageContainer (props: EditMessageContainerProps)
{
        const name = props.name;
        const newName = props.store.data.nameScratchpad[name];
        const narrativeId = props.narrativeId;

        const onSetNameScratchpadLocal = (newName: string) =>
                onSetNameScratchpad(narrativeId, name, newName);
        const onSetNameLocal = () => onSetName(narrativeId, name, newName);
        const onSetSubjectLocal = (value: string) =>
                onSetSubject(narrativeId, name, value);
        const onSetStringLocal = (name: string, value: string) =>
                onSetString(narrativeId, name, value);
        const onSetEndGameLocal = (endGame: boolean) =>
                onSetEndGame(narrativeId, name, endGame);
        const onSetEncryptedLocal = (encrypted: boolean) =>
                onSetEncrypted(narrativeId, name, encrypted);
        const onSetAttachmentLocal = (path: string) =>
                onSetAttachment(narrativeId, name, path);
        const onSetScriptLocal = (script: string) =>
                onSetScript(narrativeId, name, script);
        const onSetChildrenLocal = (delays: MessageDelay.MessageDelays) =>
                onSetChildren(narrativeId, name, delays);
        const onSetFallbackLocal = (delay: MessageDelay.MessageDelay) =>
                onSetFallback(narrativeId, name, delay);

        const editMessageProps = {
                name,
                store: props.store,
                onSetNameScratchpad: onSetNameScratchpadLocal,
                onSetName: onSetNameLocal,
                onSetSubject: onSetSubjectLocal,
                onSetString: onSetStringLocal,
                onSetEndGame: onSetEndGameLocal,
                onSetEncrypted: onSetEncryptedLocal,
                onSetAttachment: onSetAttachmentLocal,
                onSetScript: onSetScriptLocal,
                onSetChildren: onSetChildrenLocal,
                onSetFallback: onSetFallbackLocal,
        };
        return EditMessage(editMessageProps);
}

const EditMessageContainer = React.createFactory(renderEditMessageContainer);

function onDelete (narrativeId: string, name: string)
{
        const names = [name];
        const action = ActionCreators.deleteMessages({ names, narrativeId });
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

function onSetSubject (narrativeId: string, name: string, value: string)
{
        const action = ActionCreators.setMessageSubject({
                narrativeId,
                name,
                value,
        });
        Redux.handleAction(action);
}

function onSetString (
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

function onSetAttachment (
        narrativeId: string, messageName: string, newPath: string)
{
        const action = ActionCreators.setMessageAttachment({
                narrativeId,
                name: messageName,
                value: newPath,
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
        message: EditorMessage.EditorMessage,
        delay: MessageDelay.MessageDelay,
        index: number)
{
        const children = message.children;
        const newChildren = Arr.set(children, index, delay);
        onSetChildren(narrativeId, message.name, newChildren);
}

function onSetChildren (
        narrativeId: string,
        messageName: string,
        delays: MessageDelay.MessageDelay[])
{
        const action = ActionCreators.setMessageChildren({
                narrativeId,
                name: messageName,
                value: delays,
        });
        Redux.handleAction(action);
}

function onAddChild (narrativeId: string, message: EditorMessage.EditorMessage)
{
        const newChild = MessageDelay.createMessageDelay();
        const children = message.children;
        const newChildren = Arr.push(children, newChild);
        onSetChildren(narrativeId, message.name, newChildren);
}

function onRemoveChild (
        narrativeId: string, message: EditorMessage.EditorMessage, index: number)
{
        const children = message.children;
        const newChildren = Arr.deleteIndex(children, index);
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
        const newDelay = MessageDelay.createMessageDelay();
        onSetFallback(narrativeId, messageName, newDelay);
}

function onRemoveFallback (narrativeId: string, messageName: string)
{
        onSetFallback(narrativeId, messageName, null);
}

export = EditMessageContainer;
