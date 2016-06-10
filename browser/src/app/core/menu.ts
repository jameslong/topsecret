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

export function getActiveMainMenuItems (ids: string[], itemsById: Map.Map<Item>)
{
        const saves = LocalStorage.getSaveNames();
        return ids = saves.length ?
                ids :
                ids.filter(id => itemsById[id].type !== 'CONTINUE_GAME');

}
