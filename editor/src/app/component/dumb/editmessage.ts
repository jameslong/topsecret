import Arr = require('../../../../../core/src/app/utils/array');
import Map = require('../../../../../core/src/app/utils/map');
import Message = require('../../message');
import MessageDelay = require('../../messagedelay');
import Misc = require('../../misc');
import Narrative = require('../../narrative');
import React = require('react');
import ReplyOption = require('../../replyoption');
import Profile = require('../../profile');
import State = require('../../state');

import ComponentHelpers = require('../helpers');
import Core = require('../core');
import Div = Core.Div;
import Option = Core.Option;
import ButtonInput = require('./buttoninput');
import Checkbox = require('./checkbox');
import InputLabel = require('./inputlabel');
import MessageContentContainer = require('../smart/messagecontentcontainer');
import MessageDelayComponent = require('./messagedelay');
import Multiple = require('./multiple');
import Optional = require('./optional');
import ReplyOptionsContainer = require('../smart/replyoptionscontainer');
import TextComponent = require('./text');

interface EditMessageProps extends React.Props<any> {
        name: string,
        store: State.Store;
        onDelete: () => void;
        onSetNameScratchpad: (newName: string) => void;
        onSetName: () => void;
        onSetSubjectName: (subjectName: string) => void;
        onSetString: (name: string, value: string) => void;
        onSetEndGame: (endGame: boolean) => void;
        onSetEncrypted: (encrypted: boolean) => void;
        onSetScript: (script: string) => void;
        onSetChildren: (delays: MessageDelay.MessageDelays) => void;
        onSetFallback: (delay: MessageDelay.MessageDelay) => void;
};

function renderEditMessage (props: EditMessageProps)
{
        const store = props.store;
        const narrativeId = store.ui.activeNarrativeId;
        const narrative = Narrative.getActiveNarrative(store);

        const messageName = props.name;
        const scratchpadName = store.data.nameScratchpad[messageName];

        const messages = narrative.messagesById;
        const message = messages[messageName];
        const profiles = narrative.profilesById;
        const strings = narrative.stringsById;

        const name = createName(
                messageName,
                scratchpadName,
                messages,
                props.onSetNameScratchpad,
                props.onSetName);

        const subject = createSubject(
                message,
                strings,
                props.onSetSubjectName,
                props.onSetString);

        const messageContent = createMessageContent(
                narrativeId, message, strings, profiles);

        const fallback = createFallback(
                props.onSetFallback, message, messages);

        const children = createChildren(
                props.onSetChildren, message, messages);

        const replyOptions = createReplyOptions(narrativeId, message, messages);

        const endGame = createEndGame(message, props.onSetEndGame);
        const encrypted = createEncrypted(message, props.onSetEncrypted);
        const script = createScript(message, props.onSetScript);

        const deleteButton = createDeleteButton(
                messageName, props.onDelete);
        const header = Div({ className: 'edit-mesage-header' },
                deleteButton);

        const dataLists = createDataLists(narrative);
        return Div({ className: 'edit-message'},
                dataLists,
                ComponentHelpers.wrapInGroup(
                        ComponentHelpers.wrapInSubgroup(header),
                        ComponentHelpers.wrapInSubgroup(name),
                        ComponentHelpers.wrapInSubgroup(subject),
                        ComponentHelpers.wrapInSubgroup(endGame, encrypted)
                ),
                ComponentHelpers.wrapInTitleGroup('Message', messageContent),
                ComponentHelpers.wrapInTitleGroup('Fallback',
                        ComponentHelpers.wrapInSubgroup(fallback)),
                ComponentHelpers.wrapInTitleGroup('Reply options', replyOptions),
                ComponentHelpers.wrapInTitleGroup('Children', children),
                ComponentHelpers.wrapInTitleGroup('Script', script)
        );
}

const EditMessage = React.createFactory(renderEditMessage);

function createName (
        messageName: string,
        scratchpadName: string,
        messages: Message.Messages,
        onSetNameScratchpad: (newName: string) => void,
        onSetName: () => void)
{
        const onSet = (name: string) => onSetNameScratchpad(name);
        const displayName = scratchpadName || messageName;
        const props = {
                placeholder: 'message_name',
                value: displayName,
                onChange: onSet,
                list: 'messageNames',
        };
        const name = TextComponent(props);

        const disabled = Map.exists(messages, displayName);
        const className: string = null;
        const buttonProps = {
                text: 'Rename',
                disabled: disabled,
                onClick: onSetName,
                className,
        };
        const setButton = ButtonInput(buttonProps);

        return Div({}, name, setButton);
}

function createMessageContent (
        narrativeId: string,
        message: Message.Message,
        strings: Narrative.Strings,
        profiles: Profile.Profiles)
{
        const messageProps = {
                profiles: profiles,
                strings: strings,
                message: message.message,
                name: message.name,
                narrativeId,
        };
        return MessageContentContainer(messageProps);
}

function createReplyOptions (
        narrativeId: string,
        message: Message.Message,
        messages: Message.Messages)
{
        const replyOptionsProps = {
                name: message.name,
                narrativeId,
                replyOptions: message.replyOptions,
                messages,
        };
        return ReplyOptionsContainer(replyOptionsProps);
}

function createEndGame (
        message: Message.Message,
        onSetEndGame: (endGame: boolean) => void)
{
        const newEndGameProps = {
                checked: message.endGame,
                onChange: onSetEndGame,
        };
        return ComponentHelpers.wrapInLabel(
                'End game', Checkbox(newEndGameProps));
}

function createEncrypted (
        message: Message.Message,
        onSetEncrypted: (encrypted: boolean) => void)
{
        const newEncryptedProps = {
                checked: message.encrypted,
                onChange: onSetEncrypted,
        };
        return ComponentHelpers.wrapInLabel(
                'Encrypted', Checkbox(newEncryptedProps));
}

function createScript (
        message: Message.Message,
        onSetScript: (script: string) => void)
{
        const script = message.script;
        const messageName = message.name;

        const props = {
                placeholder: '',
                value: script,
                onChange: onSetScript,
        };
        return TextComponent(props);
}

function createDeleteButton (
        name: string, onDelete: () => void)
{
        const disabled = !name;
        const className: string = null;
        const deleteProps = {
                text: 'Delete',
                disabled: disabled,
                onClick: onDelete,
                className,
        };
        return ButtonInput(deleteProps);
}

function createSubject (
        message: Message.Message,
        strings: Narrative.Strings,
        onSetSubjectName: (subjectName: string) => void,
        onSetString: (name: string, value: string) => void)
{
        const subjectName = message.threadSubject;
        const subjectValue = strings[subjectName];
        const messageName = message.name;

        const nameProps = {
                placeholder: 'subject_string_name',
                value: subjectName,
                onChange: onSetSubjectName,
                list: 'stringNames',
        };
        const name = TextComponent(nameProps);

        const onChangeString = (value: string) =>
                onSetString(subjectName, value);
        const subjectProps = {
                placeholder: 'subject',
                value: subjectValue,
                onChange: onChangeString,
        };
        const subject = TextComponent(subjectProps);

        return Div({}, name, subject);
}

function onSetChild (
        onSetChildren: (delays: MessageDelay.MessageDelays) => void,
        message: Message.Message,
        delay: MessageDelay.MessageDelay,
        index: number)
{
        const children = message.children;
        const newChildren = Arr.set(children, index, delay);
        onSetChildren(newChildren);
}

function onAddChild (
        onSetChildren: (delays: MessageDelay.MessageDelays) => void,
        message: Message.Message)
{
        const newChild = MessageDelay.createMessageDelay();
        const children = message.children;
        const newChildren = Arr.push(children, newChild);
        onSetChildren(newChildren);
}

function onRemoveChild (
        onSetChildren: (delays: MessageDelay.MessageDelays) => void,
        message: Message.Message, index: number)
{
        const children = message.children;
        const newChildren = Arr.deleteIndex(children, index);
        onSetChildren(newChildren);
}

function createChildren (
        onSetChildren: (delays: MessageDelay.MessageDelays) => void,
        message: Message.Message,
        messages: Message.Messages)
{
        const onAdd = () => onAddChild(onSetChildren, message);
        const onRemove = (index: number) =>
                onRemoveChild(onSetChildren, message, index);
        const delays = message.children;
        const children = delays.map((delay, index) => {
                const onSet = (delay: MessageDelay.MessageDelay) =>
                        onSetChild(onSetChildren, message, delay, index);
                const props = {
                        delay: delay,
                        onChange: onSet,
                        messages: messages,
                };
                return MessageDelayComponent(props);
        });
        const multipleProps = {
                children: children,
                onAdd: onAdd,
                onRemove: onRemove,
        };
        return Multiple(multipleProps);
}

function onAddFallback (onSetFallback: (delay: MessageDelay.MessageDelay) => void)
{
        const newDelay = MessageDelay.createMessageDelay();
        onSetFallback(newDelay);
}

function createFallback (
        onSetFallback: (delay: MessageDelay.MessageDelay) => void,
        message: Message.Message,
        messages: Message.Messages)
{
        const delay = message.fallback;
        const messageName = message.name;

        const onAdd = () => onAddFallback(onSetFallback);
        const onRemove = () => onSetFallback(null);
        const fallbackProps = {
                delay: delay,
                onChange: onSetFallback,
                messages: messages,
        };
        const fallback = delay ? MessageDelayComponent(fallbackProps) : null;
        const optionalProps = {
                child: fallback,
                onAdd: onAdd,
                onRemove: onRemove,
        };
        return Optional(optionalProps);
}

function createDataLists (narrative: Narrative.Narrative)
{
        const messages = narrative.messagesById;
        const profiles = narrative.profilesById;
        const strings = narrative.stringsById;

        const messageNames = Object.keys(messages)
        const messageDataList = createDataList('messageNames', messageNames);

        const profileNames = Object.keys(profiles)
        const profileDataList = createDataList('profileNames', profileNames);

        const stringNames = Object.keys(strings);
        const stringDataList = createDataList('stringNames', stringNames);

        const replyOptionTypes = ReplyOption.getReplyOptionTypes();
        const replyOptionDataList = createDataList(
                'replyOptionTypes', replyOptionTypes);

        return Div({},
                messageDataList,
                profileDataList,
                stringDataList,
                replyOptionDataList);
}

function createDataList (id: string, names: string[])
{
        const options = names.map(name => Option({
                value: name,
                key: name,
        }));
        return Core.DataList({ id: id }, options);
}

export = EditMessage;
