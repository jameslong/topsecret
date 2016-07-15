import Arr = require('../../../../../core/src/utils/array');
import Map = require('../../../../../core/src/utils/map');
import EditorMessage = require('../../../editormessage');
import MessageDelay = require('../../../messagedelay');
import Misc = require('../../../misc');
import Narrative = require('../../../narrative');
import React = require('react');
import ReplyOption = require('../../../../../core/src/replyoption');
import Profile = require('../../../profile');
import State = require('../../../state');

import ComponentHelpers = require('../../../component/helpers');
import Core = require('../../../component/core');
import Div = Core.Div;
import Option = Core.Option;
import ButtonInput = require('../../../component/dumb/buttoninput');
import Checkbox = require('../../../component/dumb/checkbox');
import InputLabel = require('../../../component/dumb/inputlabel');
import MessageContentContainer = require('./message/messagecontentcontainer');
import MessageDelayComponent = require('./messagedelay');
import Multiple = require('../../../component/dumb/multiple');
import Optional = require('../../../component/dumb/optional');
import ReplyOptionsContainer = require('./replyoptions/replyoptionscontainer');
import TextComponent = require('../../../component/dumb/text');
import TextInputValidated = require('../../../component/textinputvalidated');

interface EditMessageProps extends React.Props<any> {
        name: string,
        store: State.Store;
        onSetNameScratchpad: (newName: string) => void;
        onSetName: () => void;
        onSetSubject: (value: string) => void;
        onSetString: (name: string, value: string) => void;
        onSetEndGame: (endGame: boolean) => void;
        onSetEncrypted: (encrypted: boolean) => void;
        onSetAttachment: (attachment: string) => void;
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
        const replyOptions = narrative.replyOptionsById;
        const strings = narrative.stringsById;
        const attachments = narrative.attachments;

        const name = createName(
                messageName,
                scratchpadName,
                messages,
                props.onSetNameScratchpad,
                props.onSetName);

        const subject = createSubject(message, strings, props.onSetSubject);

        const messageContent = createMessageContent(
                narrativeId, message, strings, profiles);

        const fallback = createFallback(
                props.onSetFallback, message, messages);

        const children = createChildren(
                props.onSetChildren, message, messages);

        const options = createReplyOptions(
                narrativeId, message, replyOptions, messages);

        const endGame = createEndGame(message, props.onSetEndGame);
        const encrypted = createEncrypted(message, props.onSetEncrypted);
        const attachment = createAttachment(
                message, attachments, props.onSetAttachment);
        const script = createScript(message, props.onSetScript);

        const dataLists = createDataLists(narrative);
        return Div({ className: 'edit-message'},
                dataLists,
                ComponentHelpers.wrapInGroup(
                        ComponentHelpers.wrapInSubgroup(name)
                ),
                ComponentHelpers.wrapInGroup(
                        ComponentHelpers.wrapInSubgroup(subject),
                        messageContent),
                ComponentHelpers.wrapInTitleGroup('Children', children),
                ComponentHelpers.wrapInTitleGroup('Reply options', options),
                ComponentHelpers.wrapInTitleGroup('Fallback',
                        ComponentHelpers.wrapInSubgroup(fallback)),
                ComponentHelpers.wrapInTitleGroup('Attachment', attachment),
                ComponentHelpers.wrapInTitleGroup('Script', script),
                ComponentHelpers.wrapInGroup(
                        ComponentHelpers.wrapInSubgroup(endGame, encrypted)
                )
        );
}

const EditMessage = React.createFactory(renderEditMessage);

function createName (
        messageName: string,
        scratchpadName: string,
        messages: EditorMessage.EditorMessages,
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

        return Div({ className: 'edit-message-name' }, name, setButton);
}

function createMessageContent (
        narrativeId: string,
        message: EditorMessage.EditorMessage,
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
        message: EditorMessage.EditorMessage,
        replyOptions: Map.Map<ReplyOption.ReplyOptions>,
        messages: EditorMessage.EditorMessages)
{
        const messageOptions = replyOptions[message.replyOptions] || [];
        const replyOptionsProps = {
                name: message.name,
                narrativeId,
                replyOptions: messageOptions,
                messages,
        };
        return ReplyOptionsContainer(replyOptionsProps);
}

function createEndGame (
        message: EditorMessage.EditorMessage,
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
        message: EditorMessage.EditorMessage,
        onSetEncrypted: (encrypted: boolean) => void)
{
        const newEncryptedProps = {
                checked: message.encrypted,
                onChange: onSetEncrypted,
        };
        return ComponentHelpers.wrapInLabel(
                'Encrypted', Checkbox(newEncryptedProps));
}

function createAttachment (
        message: EditorMessage.EditorMessage,
        attachments: Map.Map<string>,
        onSetAttachment: (attachment: string) => void)
{
        const attachment = message.attachment;
        const messageName = message.name;

        const props = {
                placeholder: '',
                value: attachment,
                onChange: onSetAttachment,
                list: 'attachmentNames',
        };
        const validName = !attachment || Map.exists(attachments, attachment);
        return TextInputValidated.createValidatedText(
                props, validName);
}

function createScript (
        message: EditorMessage.EditorMessage,
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
        message: EditorMessage.EditorMessage,
        strings: Narrative.Strings,
        onSetSubject: (value: string) => void)
{
        const subjectName = message.threadSubject;
        const subjectValue = strings[subjectName];
        const subjectProps = {
                placeholder: 'subject',
                value: subjectValue,
                onChange: onSetSubject,
        };
        const subject = TextComponent(subjectProps);

        return Div({}, subject);
}

function onSetChild (
        onSetChildren: (delays: MessageDelay.MessageDelays) => void,
        message: EditorMessage.EditorMessage,
        delay: MessageDelay.MessageDelay,
        index: number)
{
        const children = message.children;
        const newChildren = Arr.set(children, index, delay);
        onSetChildren(newChildren);
}

function onAddChild (
        onSetChildren: (delays: MessageDelay.MessageDelays) => void,
        message: EditorMessage.EditorMessage)
{
        const newChild = MessageDelay.createMessageDelay();
        const children = message.children;
        const newChildren = Arr.push(children, newChild);
        onSetChildren(newChildren);
}

function onRemoveChild (
        onSetChildren: (delays: MessageDelay.MessageDelays) => void,
        message: EditorMessage.EditorMessage, index: number)
{
        const children = message.children;
        const newChildren = Arr.deleteIndex(children, index);
        onSetChildren(newChildren);
}

function createChildren (
        onSetChildren: (delays: MessageDelay.MessageDelays) => void,
        message: EditorMessage.EditorMessage,
        messages: EditorMessage.EditorMessages)
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
        message: EditorMessage.EditorMessage,
        messages: EditorMessage.EditorMessages)
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
        const attachments = narrative.attachments;
        const strings = narrative.stringsById;

        const messageNames = Object.keys(messages)
        const messageDataList = createDataList('messageNames', messageNames);

        const profileNames = Object.keys(profiles)
        const profileDataList = createDataList('profileNames', profileNames);

        const stringNames = Object.keys(strings);
        const stringDataList = createDataList('stringNames', stringNames);

        const attachmentNames = Object.keys(attachments);
        const attachmentDataList = createDataList(
                'attachmentNames', attachmentNames);

        const replyOptionTypes = ReplyOption.getReplyOptionTypes();
        const replyOptionDataList = createDataList(
                'replyOptionTypes', replyOptionTypes);

        return Div({},
                messageDataList,
                profileDataList,
                stringDataList,
                attachmentDataList,
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
