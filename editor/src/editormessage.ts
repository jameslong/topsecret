import Func = require('./../../core/src/utils/function');
import Helpers = require('./../../core/src/utils/helpers');
import Map = require('./../../core/src/utils/map');
import Message = require('../../core/src/message');
import Profile = require('./profile');
import ReplyOption = require('./../../core/src/replyoption');

type Strings = Map.Map<string>;

export interface EditorMessage extends Message.ThreadMessage {
        selected: boolean;
        valid: boolean;
};

export type EditorMessages = Map.Map<EditorMessage>;

export function convertToMessage (data: Message.ThreadMessage): EditorMessage
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
                attachment: data.attachment,
                selected,
                valid,
        };
}

export function convertToMessageData (message: EditorMessage): Message.ThreadMessage
{
        let data = Helpers.assign(message, {});
        delete data.selected;
        delete data.valid;
        return data;
}

export function getSelectedMessages (messages: EditorMessages)
{
        return Map.filter(messages, message => message.selected);
}

export function getSingleSelectedMessage (messages: EditorMessages)
{
        const selected = getSelectedMessages(messages);
        const selectedList = Helpers.arrayFromMap(selected, Func.identity);
        return selectedList.length === 1 ?
                selectedList[0].name : null;
}

export function markMessagesValid (
        messages: EditorMessages,
        replyOptions: Map.Map<ReplyOption.ReplyOptions>,
        strings: Strings,
        profiles: Profile.Profiles,
        attachments: Strings)
{
        return Map.map(messages, message =>
                markMessageValid(
                        message,
                        messages,
                        replyOptions,
                        strings,
                        profiles,
                        attachments));
}

export function markMessageValid (
        message: EditorMessage,
        messages: EditorMessages,
        replyOptions: Map.Map<ReplyOption.ReplyOptions>,
        strings: Strings,
        profiles: Profile.Profiles,
        attachments: Strings)
{
        const valid = isValidMessage(
                message,
                messages,
                replyOptions,
                strings,
                profiles,
                attachments);
        return message.valid === valid ?
                message :
                Helpers.assign(message, { valid });
}

export function isValidMessage (
        message: EditorMessage,
        messages: EditorMessages,
        replyOptions: Map.Map<ReplyOption.ReplyOptions>,
        strings: Strings,
        profiles: Profile.Profiles,
        attachments: Strings)
{
        return validSubject(message, strings) &&
                validContent(message, strings, profiles) &&
                validFallback(message, messages) &&
                validReplyOptions(message, messages, replyOptions) &&
                validChildren(message, messages) &&
                validAttachment(message, attachments);
}

function validFallback (message: EditorMessage, messages: EditorMessages)
{
        return !message.fallback ||
                validMessageDelay(message.fallback, messages);
}

function validReplyOptions (
        message: EditorMessage,
        messages: EditorMessages,
        replyOptions: Map.Map<ReplyOption.ReplyOptions>)
{
        const messageOptions = replyOptions[message.replyOptions] || [];
        const delays = messageOptions.reduce<Message.ReplyThreadDelay[]>((result, option) => {
                result.push(...option.messageDelays);
                return result;
        }, []);
        return delays.every(option => validMessageDelay(option, messages));
}

function validChildren (message: EditorMessage, messages: EditorMessages)
{
        return message.children.every(child =>
                validMessageDelay(child, messages));
}

function validAttachment (message: EditorMessage, attachments: Strings)
{
        const attachment = message.attachment;
        return !attachment || Map.exists(attachments, attachment);
}

export function validMessageDelay (
        delay: Message.ReplyThreadDelay, messages: EditorMessages)
{
        return Map.exists(messages, delay.name);
}

function validSubject (message: EditorMessage, strings: Strings)
{
        const subject = message.threadSubject;
        return !subject || strings[subject];
}

function validContent (
        message: EditorMessage,
        strings: Strings,
        profiles: Profile.Profiles)
{
        const content = message.message;
        const validFrom = Map.exists(profiles, content.from);
        const validBody = Map.exists(strings, content.body);

        return validFrom && validBody;
}

export function createUniqueMessageName(messages: EditorMessages)
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
