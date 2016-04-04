import Immutable = require('immutable');

export interface MessageDelayMutable {
        name: string;
        condition: string;
        delayMins: number;
}

interface MessageDelayInt {
        name: string;
        condition: string;
        delayMins: number;
};
export type MessageDelay = Immutable.Record.IRecord<MessageDelayInt>;
export const MessageDelay = Immutable.Record<MessageDelayInt>({
        name: '',
        condition: '',
        delayMins: 0,
}, 'MessageDelay');

export type MessageDelays = Immutable.List<MessageDelay>;

export function convertToImmutableMessageDelay (
        messageDelayMutable: MessageDelayMutable)
{
        return MessageDelay({
                name: messageDelayMutable.name,
                condition: messageDelayMutable.condition,
                delayMins: messageDelayMutable.delayMins,
        });
}
