import Helpers = require('../../../core/src/app/utils/helpers');

export interface Message {
        id: string;
        date: string; // ISO 8601
        read: boolean;
        replied: boolean;
        from: string;
        to: string;
        subject: string;
        body: string;
};

export interface MessageContent {
        from: string;
        to: string;
        subject: string;
        body: string;
};

export interface MessageInfo {
        message: Message;
        selected: boolean;
        index: number;
};

export function createMessageContent (sender: string): MessageContent
{
        return {
                from: sender,
                to: '',
                subject: '',
                body: '',
        };
}

export function getDisplayName (from: string)
{
        const nameEnd = from.indexOf('<') - 1;
        return from.substring(0, nameEnd);
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function getDisplayDate (dateStr: string)
{
        const dateObj = new Date(dateStr);
        const date = dateObj.getDate();
        const month = months[dateObj.getMonth()];

        return `${month} ${date}`;
}

export function getMeta (message: Message)
{
        const nbsp = `\u00A0`;
        const a = message.replied ?
                'r' :
                (message.read ? nbsp : 'N');
        const b = nbsp;
        const c = message.to.length === 1 ? '+' : nbsp;
        return a + b + c;
}

export function getDisplaySize (body: string)
{
        const bytes = byteCount(body);
        return `(${bytes})`;
}

function byteCount(s: string)
{
        return encodeURI(s).split(/%..|./).length - 1;
}

export function isRead (message: Message)
{
        return message.read;
}

export function markRead(message: Message, read: boolean)
{
        return Helpers.assign(message, { read });
}

export function markReplied(message: Message, replied: boolean)
{
        return Helpers.assign(message, { replied });
}

export function createMessage (content: MessageContent, id: string): Message
{
        const date = new Date().toISOString();
        const { from, to, subject, body } = content;
        const read = false;
        const replied = false;
        return { id, date, read, replied, from, to, subject, body };
}
