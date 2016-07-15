import Actions = require('../../../actions/actions');
import MessageDelay = require('../../../messagedelay');
import React = require('react');
import Redux = require('../../../redux/redux');
import State = require('../../../state');

import MessagePanel = require('./messagepanel');

interface MessagePanelContainerProps extends React.Props<any> {
        store: State.Store
}

function renderMessagePanelContainer (props: MessagePanelContainerProps)
{
        const store = props.store;
        const narrativeId = store.ui.activeNarrativeId;
        const name = store.ui.activeMessageId;
        const newName = props.store.data.nameScratchpad[name];

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
        const onBlurLocal = (e: MouseEvent) => onBlur(narrativeId, e);

        const messagePanelProps = {
                name,
                store,
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
                onBlur: onBlurLocal,
        };
        return MessagePanel(messagePanelProps);
}

const MessagePanelContainer = React.createFactory(renderMessagePanelContainer);

function onDelete (narrativeId: string, name: string)
{
        const names = [name];
        const action = Actions.deleteMessages({ names, narrativeId });
        Redux.handleAction(action);
}

function onSetNameScratchpad (
        narrativeId: string, messageName: string, newName: string)
{
        const action = Actions.setEditedMessageName({
                narrativeId,
                name: messageName,
                value: newName,
        });
        Redux.handleAction(action);
}

function onSetName (narrativeId: string, name: string, newName: string)
{
        const action = Actions.setMessageName({
                narrativeId,
                name,
                value: newName,
        });
        Redux.handleAction(action);
}

function onSetSubject (narrativeId: string, name: string, value: string)
{
        const action = Actions.setMessageSubject({
                narrativeId,
                name,
                value,
        });
        Redux.handleAction(action);
}

function onSetString (
        narrativeId: string, stringName: string, value: string)
{
        const action = Actions.setString({
                narrativeId,
                name: stringName,
                value: value,
        });
        Redux.handleAction(action);
}

function onSetEndGame (
        narrativeId: string, messageName: string, newEndGame: boolean)
{
        const action = Actions.setMessageEndGame({
                narrativeId,
                name: messageName,
                value: newEndGame,
        });
        Redux.handleAction(action);
}

function onSetEncrypted (
        narrativeId: string, messageName: string, newEncrypted: boolean)
{
        const action = Actions.setMessageEncrypted({
                narrativeId,
                name: messageName,
                value: newEncrypted,
        });
        Redux.handleAction(action);
}

function onSetAttachment (
        narrativeId: string, messageName: string, newPath: string)
{
        const action = Actions.setMessageAttachment({
                narrativeId,
                name: messageName,
                value: newPath,
        });
        Redux.handleAction(action);
}

function onSetScript (
        narrativeId: string, messageName: string, newScript: string)
{
        const action = Actions.setMessageScript({
                narrativeId,
                name: messageName,
                value: newScript,
        });
        Redux.handleAction(action);
}

function onSetChildren (
        narrativeId: string,
        messageName: string,
        delays: MessageDelay.MessageDelay[])
{
        const action = Actions.setMessageChildren({
                narrativeId,
                name: messageName,
                value: delays,
        });
        Redux.handleAction(action);
}

function onSetFallback (
        narrativeId: string,
        messageName: string,
        newDelay: MessageDelay.MessageDelay)
{
        const action = Actions.setMessageFallback({
                narrativeId,
                name: messageName,
                value: newDelay,
        });
        Redux.handleAction(action);
}

function onBlur (narrativeId: string, e: MouseEvent)
{
        e.stopPropagation();

        const action = Actions.closeMessage(narrativeId);
        Redux.handleAction(action);
}

export = MessagePanelContainer;
