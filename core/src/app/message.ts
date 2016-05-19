import ReplyOption = require('./replyoption');

export interface ReplyState {
        indices: number[];
        sent: number[];
        timestampMs: number;
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

export var ThreadMessageTypes = {
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
        from: string;
        to: string;
        subject: string;
        body: string;
        inReplyToId: string;
}

export interface Reply extends MessageData {
        id: string;
}
