import AsyncRequest = require('./asyncrequest');
import DBTypes = require('../../../core/src/app/dbtypes');
import Helpers = require('../../../core/src/app/utils/helpers');
import LocalDB = require('../../../core/src/app/localdb');
import State = require('../../../core/src/app/state');

export function createServer ()
{
        const promises = createPromises();

        const emailDomain = 'testmail.playtopsecret.com';
        const immediateReplies = false;
        const timeFactor = 1;

        const url = 'http://127.0.0.1:3000';
        return AsyncRequest.narratives(url).then(data => {
                return {
                        emailDomain,
                        timeFactor,
                        immediateReplies,
                        data,
                        promises
                };
        });
}

function createPromises ()
{
        const db = LocalDB.createDB();
        const debugDBTimeoutMs = 0;
        const calls = LocalDB.createLocalDBCalls(debugDBTimeoutMs);
        const send: DBTypes.SendMessage = null;
        return DBTypes.createPromiseFactories(calls, send);
}
