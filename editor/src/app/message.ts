import Func = require('./../../../core/src/app/utils/function');
import Helpers = require('./../../../core/src/app/utils/helpers');
import Map = require('./../../../core/src/app/utils/map');
import MathUtils = require('./math');
import MessageDelay = require('./messagedelay');
import Profile = require('./profile');
import ReplyOption = require('./replyoption');

type Strings = Map.Map<string>;

export interface MessageContent {
        from: string;
        body: string;
};

export interface MessageData {
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
}

export interface Message extends MessageData {
        selected: boolean;
        valid: boolean;
};

export type Messages = Map.Map<Message>;

export function convertToMessage (data: MessageData): Message
{
        const selected = false;
        const valid = false;
        return {
                name: data.name,
                threadSubject: data.threadSubject,
                position: data.position,
                endGame: data.endGame,
                message: data.message,
                encrypted: data.encrypted,
                script: data.script,
                receiver: data.receiver,
                replyOptions: data.replyOptions,
                children: data.children,
                fallback: data.fallback,
                selected,
                valid,
        };
}

export function convertToMessageData (message: Message): MessageData
{
        let data = Helpers.assign(message, {});
        delete data.selected;
        delete data.valid;
        return data;
}

export function getSelectedMessages (messages: Messages)
{
        return Map.filter(messages, message => message.selected);
}

export function getSingleSelectedMessage (messages: Messages)
{
        const selected = getSelectedMessages(messages);
        const selectedList = Helpers.arrayFromMap(selected, Func.identity);
        return selectedList.length === 1 ?
                selectedList[0].name : null;
}

export function markMessagesValid (
        messages: Messages,
        strings: Strings,
        profiles: Profile.Profiles)
{
        return Map.map(messages, message =>
                markMessageValid(message, messages, strings, profiles));
}

export function markMessageValid (
        message: Message,
        messages: Messages,
        strings: Strings,
        profiles: Profile.Profiles)
{
        const valid = isValidMessage(message, messages, strings, profiles);
        return Helpers.assign(message, { valid });
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
        return Map.exists(messages, delay.name);
}

function validSubject (message: Message, strings: Strings)
{
        const subject = message.threadSubject;
        return !subject || strings[subject];
}

function validContent (
        message: Message,
        strings: Strings,
        profiles: Profile.Profiles)
{
        const content = message.message;
        const validFrom = Map.exists(profiles, content.from);
        const validBody = Map.exists(strings, content.body);

        return validFrom && validBody;
}

export function createUniqueMessageName(messages: Messages)
{
        let stem = 'untitled';
        let name = '';
        let i = -1;

        while (true) {
                i += 1;
                name = `${stem}_${i}`;
                if (!Map.exists(messages, name))
                {
                        return name;
                }
        }
}
