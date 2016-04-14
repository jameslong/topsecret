export interface MessageDelay {
        name: string;
        condition: string;
        delay: [number, number, number];
};

export type MessageDelays = MessageDelay[];
