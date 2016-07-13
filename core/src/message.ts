import ReplyOption = require('./replyoption');

export interface ReplyState {
        index: number;
        sent: number[];
        timestampMs: number;
        body: string;
}

export interface MessageState {
        email: string;
        id: string;
        name: string;
        reply: ReplyState;
        sentTimestampMs: number;
        childrenSent: boolean[];
        fallbackSent: boolean;
        threadStartName: string;
}

export const ThreadMessageTypes = {
        DEFAULT: 'default',
        EMPTY: 'empty',
};

export interface MessageReceiver {
        message: Message;
        receiver: string;
}

export interface Coord {
        x: number;
        y: number;
}

export interface ThreadMessage {
        name: string;
        threadSubject: string;
        position: Coord;
        endGame: boolean;
        message: Message;
        encrypted: boolean;
        script: string;
        receiver?: string; // For unsolicited player-to-character emails (where message is null)
        replyOptions: string;
        children: ThreadDelay[];
        fallback: ThreadDelay;
        attachment: string;
}

export interface ReplyThreadDelay {
        name: string;
        delay: [number, number, number]; // days, hours, minutes
}

export interface ThreadDelay {
        name: string;
        delay: [number, number, number]; // days, hours, minutes
        condition: string;
}

export interface NamedThreadDelay {
        name: string;
        matches: string[];
        threadDelay: ThreadDelay;
}

export interface Message {
        from: string;
        body: string;
}

export interface MessageData {
        name: string;
        from: string;
        to: string;
        subject: string;
        body: string;
        inReplyToId: string;
        attachment: string;
}

export interface Reply {
        id: string;
        from: string;
        to: string;
        subject: string;
        body: string;
        inReplyToId: string;
        attachment: string;
}

export interface MailgunReply extends Reply {
        strippedBody: string; // Same as body but with quoted text removed
}
