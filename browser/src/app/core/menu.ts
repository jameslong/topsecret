import LocalStorage = require('./localstorage');
import Map = require('../../../../core/src/app/utils/map');

export type MainMenuOptionType =
        'CONTINUE_GAME' |
        'NEW_GAME' |
        'SAVE' |
        'LOAD' |
        'QUIT';

export type SaveMenuOptionType =
        'SAVE' |
        'NEW_SAVE';

export type LoadMenuOptionType = 'LOAD';

export interface MainMenuItem {
        id: string;
        type: MainMenuOptionType;
        text: string;
}

export interface SaveMenuItem {
        id: string;
        type: SaveMenuOptionType;
        text: string;
}

export interface LoadMenuItem {
        id: string;
        type: LoadMenuOptionType;
        text: string;
}

const mainMenuItems: MainMenuItem[] = [
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

export function getMainMenuItems (): MainMenuItem[]
{
        const saves = LocalStorage.getSaveNames();
        return saves.length ?
                mainMenuItems :
                mainMenuItems.filter(item => item.type !== 'CONTINUE_GAME');
}

export function getSaveMenuItems (): SaveMenuItem[]
{
        const saveNames = LocalStorage.getSaveNames();
        const saveItems = saveNames.map(name => {
                const item: SaveMenuItem = {
                        id: `save_${name}`,
                        type: 'SAVE',
                        text: name,
                };
                return item;
        });
        const newSaveItem: SaveMenuItem = {
                id: 'newSave',
                type: 'NEW_SAVE',
                text: 'New Save'
        };
        return saveItems.concat(newSaveItem);
}

export function getLoadMenuItems (): LoadMenuItem[]
{
        const saveNames = LocalStorage.getSaveNames();
        return saveNames.map(name => {
                const item: LoadMenuItem = {
                        id: `save_${name}`,
                        type: 'LOAD',
                        text: name,
                };
                return item;
        });
}
