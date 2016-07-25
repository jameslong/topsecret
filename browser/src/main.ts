import AsyncRequest = require('./core/asyncrequest');
import Main = require('./core/main');
import Map = require('../../core/src/utils/map');

const serverURL = 'http://127.0.0.1:3000';

AsyncRequest.narratives(serverURL).then(data => {
        const openFile = (path: string) => window.open(path);
        const openExternal = (path: string) => window.open(path);
        Map.forEach(data, group => {
                group.attachments = Map.map(group.attachments,
                        attachment => `../${attachment}`);
        });
        return Main.init(data, openFile, openExternal);
}).catch(err => {
        console.log(err);
        throw err;
});
