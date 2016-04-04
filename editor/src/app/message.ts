import Immutable = require('immutable');
import Helpers = require('./helpers');
import MathUtils = require('./math');
import MessageDelay = require('./messagedelay');
import Profile = require('./profile');
import ReplyOption = require('./replyoption');

type Strings = Immutable.Map<string, string>;

interface MessageContentMutable {
        from: string;
        to: string[];
        body: string[];
}

interface MessageContentInt {
        from: string;
        to: Immutable.List<string>;
        body: Immutable.List<string>;
};
export type MessageContent = Immutable.Record.IRecord<MessageContentInt>;
export const MessageContent = Immutable.Record<MessageContentInt>({
        from: '',
        to: Immutable.List<string>(),
        body: Immutable.List<string>(),
}, 'MessageContent');

export interface MessageMutable {
        name: string;
        threadSubject: string;
        position: MathUtils.Coord;
        endGame: boolean;
        message: MessageContentMutable;
        encrypted: boolean;
        script: string;
        receiver: string;
        replyOptions: ReplyOption.ReplyOptionMutable[];
        children: MessageDelay.MessageDelayMutable[];
        fallback: MessageDelay.MessageDelayMutable;
}

interface MessageInt {
        name: string;
        threadSubject: string;
        position: MathUtils.Coord;
        endGame: boolean;
        message: MessageContent;
        encrypted: boolean;
        script: string;
        receiver: string;
        replyOptions: ReplyOption.ReplyOptions;
        children: MessageDelay.MessageDelays;
        fallback: MessageDelay.MessageDelay;
        selected: boolean;
        valid: boolean;
};
export type Message = Immutable.Record.IRecord<MessageInt>;
export const Message = Immutable.Record<MessageInt>({
        name: '',
        threadSubject: '',
        position: MathUtils.Coord(),
        endGame: false,
        message: MessageContent(),
        encrypted: true,
        script: '',
        receiver: null,
        replyOptions: Immutable.List<ReplyOption.ReplyOption>(),
        children: Immutable.List<MessageDelay.MessageDelay>(),
        fallback: null,
        selected: false,
        valid: false,
}, 'Message');

export type Messages = Immutable.Map<string, Message>;

function convertToImmutableMessageContent (
        messageContentMutable: MessageContentMutable)
{
        return MessageContent({
                from: messageContentMutable.from,
                to: Immutable.List.of<string>(...messageContentMutable.to),
                body: Immutable.List.of<string>(...messageContentMutable.body),
        });
}

export function convertToImmutableMessage (messageMutable: MessageMutable)
{
        const messageContentMutable = messageMutable.message;
        const messageContent = messageContentMutable ?
                convertToImmutableMessageContent(messageContentMutable)
                : null;

        const fallbackMutable = messageMutable.fallback;
        const fallback = fallbackMutable ?
                MessageDelay.convertToImmutableMessageDelay(fallbackMutable) : null;

        const children = Helpers.listFromArray(
                messageMutable.children,
                MessageDelay.convertToImmutableMessageDelay);

        const positionMutable = messageMutable.position;
        const position = positionMutable ?
                MathUtils.convertToImmutableCoord(positionMutable) :
                MathUtils.Coord();

        const replyOptionsMutable = messageMutable.replyOptions;
        const replyOptions = ReplyOption.convertToImmutableReplyOptions(
                replyOptionsMutable);

        return Message({
                name: messageMutable.name,
                threadSubject: messageMutable.threadSubject,
                endGame: messageMutable.endGame,
                encrypted: messageMutable.encrypted,
                script: messageMutable.script,
                receiver: messageMutable.receiver,
                replyOptions: replyOptions,
                position: position,
                message: messageContent,
                children: children,
                fallback: fallback,
                selected: false,
                valid: false,
        });
}

export function convertToMutableMessage(
        message: Message): MessageMutable
{
        let messageMutable = message.toJS();
        delete messageMutable.selected;
        delete messageMutable.valid;
        return messageMutable;
}

export function getSelectedMessages (messages: Messages)
{
        return <Messages>messages.filter(
                message => message.selected);
}

export function getSingleSelectedMessage (messages: Messages)
{
        const selected = getSelectedMessages(messages);
        const selectedList = <Immutable.List<Message>>(selected.toList());
        return selectedList.count() === 1 ?
                selectedList.get(0).name : null;
}

export function markMessagesValid (
        messages: Messages,
        strings: Strings,
        profiles: Profile.Profiles)
{
        return <Messages>messages.map(message =>
                markMessageValid(
                        message,
                        messages,
                        strings,
                        profiles));
}

export function markMessageValid (
        message: Message,
        messages: Messages,
        strings: Strings,
        profiles: Profile.Profiles)
{
        const valid = isValidMessage(
                message, messages, strings, profiles);
        return message.set('valid', valid);
}

export function isValidMessage (
        message: Message,
        messages: Messages,
        strings: Strings,
        profiles: Profile.Profiles)
{
        return validSubject(message, strings) &&
                validContent(message, strings, profiles) &&
                validFallback(message, messages) &&
                validReplyOptions(message, messages) &&
                validChildren(message, messages);
}

function validFallback (message: Message, messages: Messages)
{
        return !message.fallback ||
                validMessageDelay(message.fallback, messages);
}

function validReplyOptions (message: Message, messages: Messages)
{
        return message.replyOptions.every(option =>
                validMessageDelay(option.messageDelay, messages));
}

function validChildren (message: Message, messages: Messages)
{
        return message.children.every(child =>
                validMessageDelay(child, messages));
}

export function validMessageDelay (
        delay: MessageDelay.MessageDelay, messages: Messages)
{
        return messages.has(delay.name);
}

function validSubject (message: Message, strings: Strings)
{
        const subject = message.threadSubject;
        return !subject || strings.get(subject);
}

function validContent (
        message: Message,
        strings: Strings,
        profiles: Profile.Profiles)
{
        const content = message.message;
        const validFrom = profiles.has(content.from);
        const validTo = content.to.every(name => profiles.has(name));
        const validBody = content.body.every(name =>
                strings.get(name) !== undefined);

        return validFrom && validTo && validBody;
}

export function createUniqueMessageName(messages: Messages)
{
        let stem = 'untitled';
        let name = '';
        let i = -1;

        while (true) {
                i += 1;
                name = `${stem}_${i}`;
                if (!messages.has(name))
                {
                        return name;
                }
        }
}
