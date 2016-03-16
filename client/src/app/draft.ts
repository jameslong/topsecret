import Helpers = require('../../../core/src/app/utils/helpers');
import Message = require('./message');
import Str = require('../../../core/src/app/utils/string');

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
        const draftTo = createReplyTo(sender, message);
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

function createReplyTo (sender: string, message: Message.MessageContent)
{
        const from = message.from;
        const to = message.to.concat([from]);
        return to.filter(email => email !== sender);
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
        return Str.prependToLines('> ', body);
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

export function setTo (draft: Draft, to: string[])
{
        const newContent = Helpers.assign(draft.content, { to });
        return setContent(draft, newContent);
}

export function setContent (draft: Draft, content: Message.MessageContent)
{
        return Helpers.assign(draft, { content });
}

export function createMessageFromDraft (draft: Draft, id: string)
        : Message.Message
{
        const date = new Date().toISOString();
        const content = draft.content;
        const { from, to, subject, body } = content;
        const read = true;
        const replied = false;
        return { id, date, read, replied, from, to, subject, body };
}
