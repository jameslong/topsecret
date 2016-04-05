import Helpers = require('./helpers');
import Immutable = require('immutable');

export interface MessageDelayMutable {
        name: string;
        condition: string;
        delay: [number, number, number];
}

interface MessageDelayInt {
        name: string;
        condition: string;
        delay: Immutable.List<number>;
};
export type MessageDelay = Immutable.Record.IRecord<MessageDelayInt>;
export const MessageDelay = Immutable.Record<MessageDelayInt>({
        name: '',
        condition: '',
        delay: Immutable.List.of<number>(0, 0, 0),
}, 'MessageDelay');

export type MessageDelays = Immutable.List<MessageDelay>;

export function convertToImmutableMessageDelay (
        messageDelayMutable: MessageDelayMutable)
{
        const delay = Helpers.listFromArray(
                messageDelayMutable.delay, value => value);
        return MessageDelay({
                name: messageDelayMutable.name,
                condition: messageDelayMutable.condition,
                delay,
        });
}
