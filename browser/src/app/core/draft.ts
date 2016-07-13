import Helpers = require('../../../../core/src/utils/helpers');
import Message = require('./message');
import MessageHelpers = require('../../../../core/src/messagehelpers');
import MessageCore = require('../../../../core/src/message');
import Str = require('../../../../core/src/utils/string');

export interface Draft {
        content: Message.MessageContent;
        parentId: string;
};

export function createDraft (
        content: Message.MessageContent, parentId: string): Draft
{
        return {
                content,
                parentId,
        };
}

export function createDraftFromMessage (
        sender: string, message: Message.Message): Draft
{
        const draftTo = message.from;
        const draftSubject = createReplySubject(message.subject);
        const draftBody = createReplyBody(message.body);
        const content = {
                from: sender,
                to: draftTo,
                subject: draftSubject,
                body: draftBody,
        };
        return createDraft(content, message.id);
}

function createReplySubject (subject: string)
{
        return isReplySubject(subject) ?
                subject: `Re: ${subject}`;
}

function isReplySubject (subject: string)
{
        return subject.toLowerCase().indexOf('re:') === 0;
}

function createReplyBody (body: string)
{
        return '\n\n' + Str.prependToLines('> ', body);
}

export function setBody (draft: Draft, body: string)
{
        const newContent = Helpers.assign(draft.content, { body });
        return setContent(draft, newContent);
}

export function setSubject (draft: Draft, subject: string)
{
        const newContent = Helpers.assign(draft.content, { subject });
        return setContent(draft, newContent);
}

export function setTo (draft: Draft, to: string)
{
        const newContent = Helpers.assign(draft.content, { to });
        return setContent(draft, newContent);
}

export function setContent (draft: Draft, content: Message.MessageContent)
{
        return Helpers.assign(draft, { content });
}

export function createReplyFromDraft (
        draft: Draft, id: string, inReplyToId: string): MessageCore.MailgunReply
{
        const { from, to, subject, body } = draft.content;
        const strippedBody = body;
        return {
                from,
                to,
                subject,
                body,
                strippedBody,
                id,
                inReplyToId,
                attachment: null,
        };
}

export function createMessageFromReply (
        reply: MessageCore.Reply, timestampMs: number)
{
        return Message.createMessage(reply, reply.id, timestampMs);
}
