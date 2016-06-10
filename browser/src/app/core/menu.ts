import LocalStorage = require('./localstorage');
import Map = require('../../../../core/src/app/utils/map');

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

const mainMenuItems: Item[] = [
        {
                id: 'continue',
                type: 'CONTINUE_GAME',
                text: 'Continue',
        }, {
                id: 'newGame',
                type: 'NEW_GAME',
                text: 'New Game',
        }, {
                id: 'save',
                type: 'SAVE',
                text: 'Save',
        }, {
                id: 'load',
                type: 'LOAD',
                text: 'Load',
        }, {
                id: 'quit',
                type: 'QUIT',
                text: 'Quit',
        }
];

export function getMainMenuItems (): Item[]
{
        const saves = LocalStorage.getSaveNames();
        return saves.length ?
                mainMenuItems :
                mainMenuItems.filter(item => item.type !== 'CONTINUE_GAME');
}
