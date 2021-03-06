/// <reference path="../typings/github-electron/github-electron.d.ts"/>

import Data = require('../core/src/data');
import Helpers = require('../core/src/utils/helpers');
import Main = require('../browser/src/core/main');
import electron = require('electron');
const shell = electron.shell;
const remote = electron.remote;
import State = require('../core/src/gamestate');

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
                const quit = () => remote.app.quit();
                Main.init(narratives, openFile, openExternal, quit);
        }).catch(err => {
                console.log(err);
                throw err;
        });
};
