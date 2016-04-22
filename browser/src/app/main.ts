import AsyncRequest = require('./core/asyncrequest');
import Main = require('./core/main');

const serverURL = 'http://127.0.0.1:3000';

AsyncRequest.narratives(serverURL).then(data =>
        Main.init(data)
).catch(err => {
        console.log(err);
        throw err;
});
