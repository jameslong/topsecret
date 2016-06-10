export type OptionType =
        'CONTINUE_GAME' |
        'NEW_GAME' |
        'SAVE' |
        'LOAD' |
        'QUIT';

export interface Item {
        id: string;
        type: OptionType;
        text: string;
}
