export interface MessageDelay {
        name: string;
        condition: string;
        delay: [number, number, number];
};

export function createMessageDelay (): MessageDelay
{
        return {
                name: '',
                condition: '',
                delay: [0, 0, 0],
        };
}

export type MessageDelays = MessageDelay[];
