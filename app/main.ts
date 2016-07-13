/// <reference path="../typings/github-electron/github-electron.d.ts"/>

import Data = require('../core/src/data');
import Helpers = require('../core/src/utils/helpers');
import Main = require('../browser/src/app/core/main');
import electron = require('electron');
const shell = electron.shell;
import State = require('../core/src/state');

window.onload = () => {
        const resources = (<any>process)['resourcesPath'];
        const path = `${resources}/app/build/content`;
        const data = Data.loadNarrativeData(path);
        const tasks = data.map(narrative => State.addKeyManagers(narrative));

        Promise.all(tasks).then(data =>
                Helpers.mapFromNameArray(data)
        ).then(narratives => {
                const openFile = (path: string) => shell.openItem(path);
                const openExternal = (path: string) => shell.openExternal(path);
                Main.init(narratives, openFile, openExternal);
        }).catch(err => {
                console.log(err);
                throw err;
        });
};
