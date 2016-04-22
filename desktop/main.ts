import Data = require('../core/src/app/data');
import Helpers = require('../core/src/app/utils/helpers');
import Main = require('../client/src/app/core/main');
import State = require('../core/src/app/state');

window.onload = () => {
        const path = '../content';
        const data = Data.loadNarrativeData(path);
        const tasks = data.map(narrative => State.addKeyManagers(narrative));

        Promise.all(tasks).then(data =>
                Helpers.mapFromNameArray(data)
        ).then(narratives =>
                Main.init(narratives)
        ).catch(err => {
                console.log(err);
                throw err;
        });
};
