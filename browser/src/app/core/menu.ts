import LocalStorage = require('./localstorage');
import Map = require('../../../../core/src/utils/map');

export type MainMenuOptionType =
        'RESUME_GAME' |
        'CONTINUE_GAME' |
        'NEW_GAME' |
        'HOW_TO_PLAY' |
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
                id: 'resume',
                type: 'RESUME_GAME',
                text: 'Resume',
        }, {
                id: 'continue',
                type: 'CONTINUE_GAME',
                text: 'Continue',
        }, {
                id: 'newGame',
                type: 'NEW_GAME',
                text: 'New Game',
        }, {
                id: 'howToPlay',
                type: 'HOW_TO_PLAY',
                text: 'How To Play',
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

export function getMainMenuItems (hasSeenInbox: boolean): MainMenuItem[]
{
        const saves = LocalStorage.getSaveNames();
        if (saves.length === 0 && !hasSeenInbox) {
                return mainMenuItems.filter(item =>
                        item.type !== 'RESUME_GAME' &&
                        item.type !== 'CONTINUE_GAME');
        } else if (hasSeenInbox) {
                return mainMenuItems.filter(
                        item => item.type !== 'CONTINUE_GAME');
        } else {
                return mainMenuItems.filter(
                        item => item.type !== 'RESUME_GAME');
        }
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
