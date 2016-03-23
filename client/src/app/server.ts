import ActionCreators = require('./action/actioncreators');
import AsyncRequest = require('./asyncrequest');
import DBTypes = require('../../../core/src/app/dbtypes');
import CoreState = require('../../../core/src/app/state');
import Helpers = require('../../../core/src/app/utils/helpers');
import LocalDB = require('../../../core/src/app/localdb');
import Main = require('../../../core/src/app/main');
import Message = require('../../../core/src/app/message');
import Player = require('../../../core/src/app/player');
import Promises = require('../../../core/src/app/promises');
import Redux = require('./redux/redux');
import State = require('./state');

interface Id {
        uid: number;
}

export interface Server {
        app: CoreState.State;
        lastEvaluatedKey: string;
        db: LocalDB.DBState;
        id: Id;
}

export function createServer ()
{
        const emailDomain = 'testmail.playtopsecret.com';
        const immediateReplies = false;
        const timeFactor = 1;
        const lastEvaluatedKey: string = null;
        const db = LocalDB.createDB();
        const id = { uid: 0 };
        const promises = createPromises(id);

        const url = 'http://127.0.0.1:3000';
        return AsyncRequest.narratives(url).then(data => {
                const app = {
                        emailDomain,
                        timeFactor,
                        immediateReplies,
                        data,
                        promises,
                };
                return { app, lastEvaluatedKey, db, id };
        });
}

function createPromises (id: Id)
{
        const debugDBTimeoutMs = 0;
        const db = LocalDB.createDB();
        const calls = LocalDB.createLocalDBCalls(db, debugDBTimeoutMs);
        const sendFn = (data: Message.MessageData) => send(id, data);
        return DBTypes.createPromiseFactories(calls, sendFn);
}

function send (id: Id, data: Message.MessageData) {
        const uid = (id.uid + 1).toString();
        id.uid += 1;

        const reply = {
                from: data.from,
                to: data.to,
                subject: data.subject,
                body: data.body,
                id: uid,
        };
        const action = ActionCreators.receiveReply(reply);
        Redux.handleAction(action);
        return Promise.resolve(uid);
}

export function init (getState: () => State.State)
{
        createServer().then(server => {
                const email = 'john.smith@gmail.com';
                const publicKey = "-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: fnContact PGP \/ Keybase OpenPGP v1.0.0\nComment: https:\/\/fncontact.com\n\nxsBNBFYK0ZMBCACb+C8Wns+tqz8\/9lEfIuPmCBfh1VPPG2hmU1tQn4vFeJkkWWnT\n3lWmgQMA0Gb0kj4XO2LyhR5c3x7sAkcO6vBXFM7lXwFauCmH1fQCPV2RAMsAzy+V\nRm5+32tLxw1uUBmJ8kpPbMl2bGeCbu24rN1nQ128ThegUyvcTX1lxwRS2RcCcli\/\nrzDRRe0g\/LgrOVWcZ+TjtY00+\/dlniRshCO8fNo\/\/vz9pPf2oApYw3y+KyDTbvjm\nrgP1Cw6qeP7uZNF4IJ45Y\/C+rkEJ228foq1hCEMX72bKrLPhn0syR4Oj\/SitYKqK\nP5TEmK84ZrGUitdUom0yMuSpXLI1Wi2oxFsFABEBAAHNN01pY2hhZWwgQWxleGFu\nZGVyIDxkaXJlY3RvckB0ZXN0bWFpbC5wbGF5dG9wc2VjcmV0LmNvbT7CwG0EEwEK\nABcFAlYK0ZMCGy8DCwkHAxUKCAIeAQIXgAAKCRA7mh\/ZPUNOWLo4B\/9F7+qxpdPV\nTEDLGYOZ9BfOfvnIE5x8OfobuVyMePmkm2oYXRKyeKmKXY1q5rcgDTp19C2Glzxs\nz\/5jF\/UYUrqzmU47PtP5XZ+aSiUatTt70QsMDsu\/zieQqHkXUGWAkVINWOjCwE85\n0Q49QN3f0KTadAelp8kPAWhmvO2FEyXwoUy9Cd7tKGFMOpHPEPZpFSFRD7Gk\/w6R\njQZ0Ap2sI843VZVGfgWCKaFOUwTecPKoxV\/jKQdmxUTENu7xowx22V2C7LcMvJFp\ndx4AfIcU1UElLnJpUTPcC3Si6IwUF3kD5WY+2kj1XFMGiSLAGu8\/KkXzYxSsqGAi\ndJRuM5slhpVZzo0EVgrRkwEEALzS29haFDI\/y8Fjos0sO+DQEXvXtDs\/BR4+IcRV\n0MutTnJfnoe43nV5BMOWbausy6IPwSPBEimDwekQBDCWjuoBe1lcwGWLymsQApg5\ncXdiYsJYdrorly6c+7aqfUmepGVX0000eedUO\/\/gJkMZkKPJTeH0fEJXqdTUZf1p\npERDABEBAAHCwQMEGAEKAA8FAlYK0ZMFCQ8JnAACGy4AqAkQO5of2T1DTlidIAQZ\nAQoABgUCVgrRkwAKCRA\/po7WdwBDutpPBACtkgKFrMzCQUByezG3siz8rURi9yPV\nG2Dxbq6xA5DN0lf2aBsV583+qTKOTdOsL7N+ANMqBDwwsSuiCePezg\/MngENLZ4h\n1yX3lrrMEk1kHK4ait9xgVT14ioRLxyZmiRnK7Qq4WP2d9y9vFPM1W0jJ7bTk0oh\nF5nbfOIbG6cNDj6nB\/9vvravds0VMCvQ9m75VD5EsKUWAETeDxNmLfXywNslYf6I\nl03CSm0jYZL\/waHmn\/DyoDze2pFusmIAbUmrRaUMBvU2DPV+2PPkl60Hz9JK7iEx\nruPy0qAsXOBWz1wLTjx8RWFRIGNjhBOxi5McKT61vXRPOjxn3MvfKwjDGrsRjr58\nPnRw4SzugI\/jtXKub8buD5h2fTXX7RhmWIj24PkEGqMGvF\/Byaacn5dhyZ\/CTrp3\nYPXTYgkA63iQSXusveK1cM+JmS1TMplaWdz0l2s6oW4jJqeJSnSCLdEXa+G7N6Fg\npjrIKImIrDTlBZsIs82LQ52sXyTf8GAB1nPqTDfJzo0EVgrRkwEEAKW4N9eP6g5v\naSB2dou\/31vIUc7KD8PfbzTuHopr\/uKBH9E5YjinUNXhlcL\/Hne4qHInI0lGZcl5\nR7u2vFW8ldU1+XNwneWhp3qtT73CZsZj6pK+Q8I+zNvVlzWDZOyXRGO9m3yYJevy\noDRWv82lKN0INqqc2fKUAjdbrpIE110JABEBAAHCwQMEGAEKAA8FAlYK0ZMFCQ8J\nnAACGy4AqAkQO5of2T1DTlidIAQZAQoABgUCVgrRkwAKCRCAFFM0XM0U3mqBBACP\ndySSPffdppSMNen9RJtbz6qUD5sNDU1slzcppLeXYbaPqSYC\/TeWFsncYZhjoCFT\nwMib5QyKgdGCscURIjjyQ6stoiTrfgJBWAuQ6NYmg\/IknEAGiyJqL8M+3S9grygL\nxhLHUb87H4O2A8F9pMnuFFw41Ey2UeHPL0UNNFxWQ3TQB\/90pFbYaFrlkC6J6kwQ\nXiVCKaAU1i8n+7HhmIjXVPx96C5z9t1qeCFIENvAsEwRh5gMDOX8x5pMvobhWCs8\nOXTJnpi1zc7qkqvXS3sVNu35auLcIN3WXERKCD8U7yXNBN5AwtC82DuU4wu1Nwrl\n+5qiz\/54lZ\/g8mtjnOuQJlVwqCJHoUhS0a4wNucjFsFx1dNmbPELIejltoAqb\/Pu\nJZWWBySM3Sf6JFABRB3hWzC4mgkw7TrJjr5WZeRwPQOGOtaf5xyg45RTbvxg5gf+\ndQvDF5NArr3BGVbV+wemV2ZB0ZlZ3Y7aaAo81F+ec6q79QYeaGv0nuZlGKEXqrev\nizGi\n=qeqx\n-----END PGP PUBLIC KEY BLOCK-----";
                const version = 'test_data';
                const firstName = 'John';
                const lastName = 'Smith';
                const player = Player.createPlayerState(
                        email, publicKey, version, firstName, lastName);

                const messageName = 'begingame';
                const domain = 'nsa.gov';
                const groupData = server.app.data[version];
                const promises = server.app.promises;

                Promises.beginGame(
                        messageName,
                        player,
                        domain,
                        groupData,
                        promises).then(result => start(getState, server));
        });
}

export function start (getState: () => State.State, server: Server)
{
        const state = getState();
        const timestampMs = Date.now();
        const { app, lastEvaluatedKey } = server;
        const intervalMs = 1000;

        Main.tick(app, lastEvaluatedKey, timestampMs).then(lastEvaluatedKey => {
                console.log(`tick, lastEvaluatedKey = ${lastEvaluatedKey}`);
                server.lastEvaluatedKey = lastEvaluatedKey;
                setTimeout(() => start(getState, server), intervalMs);
        }).catch(err => console.log('Server error: ', err));
}
