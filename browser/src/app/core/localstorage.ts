import Arr = require('../../../../core/src/app/utils/array');

interface SaveData { name: string }

export function save<T extends SaveData> (data: T)
{
        let localStorage = window.localStorage;
        let existingData = localStorage.getItem('saves');
        let saves: T[] = existingData ? JSON.parse(existingData) : [];
        const index = Arr.find(saves, save => save.name === data.name);
        index !== -1 ? saves[index] = data : saves.push(data);
        localStorage.setItem('saves', JSON.stringify(saves));
}

export function loadAllSaves<T extends SaveData> (): T[]
{
        const localStorage = window.localStorage;
        const existingData = localStorage.getItem('saves');
        return existingData ? JSON.parse(existingData) : [];
}

export function load<T extends SaveData> (name: string): T
{
        const saves = loadAllSaves<T>();
        return Arr.valueOf(saves, save => save.name === name);
}

export function deleteSave (name: string)
{
        const localStorage = window.localStorage;
        const existingData = localStorage.getItem('saves');
        const saves: SaveData[] = existingData ? JSON.parse(existingData) : [];
        const newSaves = saves.filter(data => data.name !== name);
        localStorage.setItem('saves', JSON.stringify(newSaves));

}

export function getSaveNames ()
{
        const localStorage = window.localStorage;
        const existingData = localStorage.getItem('saves');
        const saves: SaveData[] = existingData ? JSON.parse(existingData) : [];
        return saves.map(data => data.name);
}

export function getMostRecentSave<T extends SaveData> (): T
{
        const saveNames = getSaveNames();
        return saveNames.length ?
                load<T>(saveNames.sort()[0]) :
                null;
}
