import Map = require('../../../../../core/src/app/utils/map');
import Menu = require('../menu');

export const items: Menu.Item[] = [
        {
                id: 'continue',
                type: 'CONTINUE',
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
