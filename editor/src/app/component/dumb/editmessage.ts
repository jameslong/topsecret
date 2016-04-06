import Immutable = require('immutable');
import Helpers = require('../../helpers');
import Message = require('../../message');
import MessageDelay = require('../../messagedelay');
import Misc = require('../../misc');
import Narrative = require('../../narrative');
import ReactUtils = require('../../redux/react');
import ReplyOption = require('../../replyoption');
import Profile = require('../../profile');
import State = require('../../state');

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

interface EditMessageInt {
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
export type EditMessageData = Immutable.Record.IRecord<EditMessageInt>;
export const EditMessageData = Immutable.Record<EditMessageInt>({
        name: '',
        store: State.Store(),
        onDelete: () => {},
        onSetNameScratchpad: () => {},
        onSetName: () => {},
        onSetSubjectName: () => {},
        onSetString: () => {},
        onSetEndGame: () => {},
        onSetEncrypted: () => {},
        onSetScript: () => {},
        onSetChildren: () => {},
        onSetFallback: () => {},
}, 'EditMessage');

type EditMessageProps = ReactUtils.Props<EditMessageData>;

function render (props: EditMessageProps)
{
        const data = props.data;
        const store = data.store;
        const narrative = Narrative.getActiveNarrative(store);

        const messageName = data.name;
        const scratchpadName =
                store.nameScratchpad.get(messageName);

        const messages = narrative.messagesById;
        const message = messages.get(messageName);
        const profiles = narrative.profilesById;
        const strings = narrative.stringsById;

        const name = createName(
                messageName,
                scratchpadName,
                messages,
                data.onSetNameScratchpad,
                data.onSetName);

        const subject = createSubject(
                message,
                strings,
                data.onSetSubjectName,
                data.onSetString);

        const messageContent = createMessageContent(
                message, strings, profiles);

        const fallback = createFallback(
                data.onSetFallback, message, messages);

        const children = createChildren(
                data.onSetChildren, message, messages);

        const replyOptions = createReplyOptions(
                message, messages);

        const endGame = createEndGame(message, data.onSetEndGame);
        const encrypted = createEncrypted(message, data.onSetEncrypted);
        const script = createScript(message, data.onSetScript);

        const deleteButton = createDeleteButton(
                messageName, data.onDelete);
        const header = Div({ className: 'edit-mesage-header' },
                deleteButton);

        const dataLists = createDataLists(narrative);
        return Div({ className: 'edit-message'},
                dataLists,
                wrapInGroup(
                        wrapInSubgroup(header),
                        wrapInSubgroup(name),
                        wrapInSubgroup(subject),
                        wrapInSubgroup(endGame, encrypted)
                ),
                wrapInTitleGroup('Message', messageContent),
                wrapInTitleGroup('Fallback',
                        wrapInSubgroup(fallback)),
                wrapInTitleGroup('Reply options', replyOptions),
                wrapInTitleGroup('Children', children),
                wrapInTitleGroup('Script', script)
        );
}

export const EditMessage = ReactUtils.createFactory(render, 'EditMessage');

export function wrapInLabel<P>(
        label: string, ...components: React.ReactElement<any>[])
{
        const props = Misc.KeyValue({ name: '', value: label });
        return InputLabel.InputLabel(props, ...components);
}

export function wrapInGroup(
        ...components: React.ReactElement<any>[])
{
        return Div({ className: 'edit-message-group' },
                Div({ className: 'edit-message-group-content' },
                        ...components)
        );
}

export function wrapInSubgroup(
        ...components: React.ReactElement<any>[])
{
        return Div({ className: 'edit-message-subgroup' }, ...components);
}

export function wrapInTitleGroup(
        title: string, ...components: React.ReactElement<any>[])
{
        return Div({ className: 'edit-message-group' },
                Div({ className: 'edit-message-group-title' }, title),
                Div({ className: 'edit-message-group-content' },
                        ...components)
        );
}

function createName (
        messageName: string,
        scratchpadName: string,
        messages: Message.Messages,
        onSetNameScratchpad: (newName: string) => void,
        onSetName: () => void)
{
        const onSet = (name: string) => onSetNameScratchpad(name);
        const displayName = scratchpadName || messageName;
        const data = TextComponent.TextData({
                placeholder: 'message_name',
                value: displayName,
                onChange: onSet,
                list: 'messageNames',
        });
        const name = TextComponent.Text(data);

        const disabled = messages.has(displayName);
        const buttonProps = ButtonInput.ButtonData({
                text: 'Rename',
                disabled: disabled,
                onClick: onSetName,
                className: null,
        });
        const setButton = ButtonInput.ButtonInput(buttonProps);

        return Div({}, name, setButton);
}

function createMessageContent (
        message: Message.Message,
        strings: Narrative.Strings,
        profiles: Profile.Profiles)
{
        const messageProps = MessageContentContainer.MessageContentContainerData({
                profiles: profiles,
                strings: strings,
                message: message.message,
                name: message.name,
        });
        return MessageContentContainer.MessageContentContainer(messageProps);
}

function createReplyOptions (
        message: Message.Message, messages: Message.Messages)
{
        const replyOptionsProps = ReplyOptionsContainer.ReplyOptionsContainerData({
                name: message.name,
                replyOptions: message.replyOptions,
                messages: messages,
        });
        return ReplyOptionsContainer.ReplyOptionsContainer(replyOptionsProps);
}

function createEndGame (
        message: Message.Message,
        onSetEndGame: (endGame: boolean) => void)
{
        const newEndGameProps = Checkbox.CheckboxData({
                checked: message.endGame,
                onChange: onSetEndGame,
        });
        return wrapInLabel('End game', Checkbox.Checkbox(newEndGameProps));
}

function createEncrypted (
        message: Message.Message,
        onSetEncrypted: (encrypted: boolean) => void)
{
        const newEncryptedProps = Checkbox.CheckboxData({
                checked: message.encrypted,
                onChange: onSetEncrypted,
        });
        return wrapInLabel(
                'Encrypted', Checkbox.Checkbox(newEncryptedProps));
}

function createScript (
        message: Message.Message,
        onSetScript: (script: string) => void)
{
        const script = message.script;
        const messageName = message.name;

        const nameProps = TextComponent.TextData({
                placeholder: '',
                value: script,
                onChange: onSetScript,
        });
        return TextComponent.Text({ data: nameProps });
}

function createDeleteButton (
        name: string, onDelete: () => void)
{
        const disabled = !name;
        const deleteProps = ButtonInput.ButtonData({
                text: 'Delete',
                disabled: disabled,
                onClick: onDelete,
                className: null,
        });
        return ButtonInput.ButtonInput(deleteProps);
}

function createSubject (
        message: Message.Message,
        strings: Narrative.Strings,
        onSetSubjectName: (subjectName: string) => void,
        onSetString: (name: string, value: string) => void)
{
        const subjectName = message.threadSubject;
        const subjectValue = strings.get(subjectName);
        const messageName = message.name;

        const nameProps = TextComponent.TextData({
                placeholder: 'subject_string_name',
                value: subjectName,
                onChange: onSetSubjectName,
                list: 'stringNames',
        });
        const name = TextComponent.Text({ data: nameProps });

        const onChangeString = (value: string) =>
                onSetString(subjectName, value);
        const subjectProps = TextComponent.TextData({
                placeholder: 'subject',
                value: subjectValue,
                onChange: onChangeString,
        });
        const subject = TextComponent.Text({ data: subjectProps });

        return Div({}, name, subject);
}

function onSetChild (
        onSetChildren: (delays: MessageDelay.MessageDelays) => void,
        message: Message.Message,
        delay: MessageDelay.MessageDelay,
        index: number)
{
        const children = message.children;
        const newChildren = children.set(index, delay);
        onSetChildren(newChildren);
}

function onAddChild (
        onSetChildren: (delays: MessageDelay.MessageDelays) => void,
        message: Message.Message)
{
        const newChild = MessageDelay.MessageDelay();
        const children = message.children;
        const newChildren = children.push(newChild);
        onSetChildren(newChildren);
}

function onRemoveChild (
        onSetChildren: (delays: MessageDelay.MessageDelays) => void,
        message: Message.Message, index: number)
{
        const children = message.children;
        const newChildren = children.delete(index);
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
                const props = MessageDelayComponent.MessageDelayData({
                        delay: delay,
                        onChange: onSet,
                        messages: messages,
                });
                return MessageDelayComponent.MessageDelayComponent(props);
        });
        const multipleProps = Multiple.MultipleData({
                children: children,
                onAdd: onAdd,
                onRemove: onRemove,
        });
        return Multiple.Multiple(multipleProps);
}

function onAddFallback (onSetFallback: (delay: MessageDelay.MessageDelay) => void)
{
        const newDelay = MessageDelay.MessageDelay();
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
        const fallbackProps = MessageDelayComponent.MessageDelayData({
                delay: delay,
                onChange: onSetFallback,
                messages: messages,
        });
        const fallback = delay ?
                MessageDelayComponent.MessageDelayComponent(fallbackProps) : null;
        const optionalProps = Optional.OptionalData({
                child: fallback,
                onAdd: onAdd,
                onRemove: onRemove,
        });
        return Optional.Optional(optionalProps);
}

function createDataLists (narrative: Narrative.Narrative)
{
        const messages = narrative.messagesById;
        const profiles = narrative.profilesById;
        const strings = narrative.stringsById;

        const messageNames = Helpers.keys(messages)
        const messageDataList = createDataList(
                'messageNames', messageNames);

        const profileNames = Helpers.keys(profiles)
        const profileDataList = createDataList(
                'profileNames', profileNames);

        const stringNames = Helpers.keys(strings);
        const stringDataList = createDataList(
                'stringNames', stringNames);

        const replyOptionTypes = ReplyOption.getReplyOptionTypes();
        const replyOptionDataList = createDataList(
                'replyOptionTypes', replyOptionTypes);

        return Div({},
                messageDataList,
                profileDataList,
                stringDataList,
                replyOptionDataList);
}

function createDataList (id: string, names: Immutable.List<string>)
{
        const options = names.map(name => Option({
                value: name,
                key: name,
         }));
        return Core.DataList({ id: id }, options);
}
