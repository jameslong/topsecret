import ActionCreators = require('./action/actioncreators');
import ConfigData = require('./data/config');
import DBTypes = require('../../../../core/src/app/dbtypes');
import Helpers = require('../../../../core/src/app/utils/helpers');
import LocalDB = require('../../../../core/src/app/localdb');
import Main = require('../../../../core/src/app/main');
import Message = require('../../../../core/src/app/message');
import MessageHelpers = require('../../../../core/src/app/messagehelpers');
import Player = require('../../../../core/src/app/player');
import PlayerData = require('./data/player');
import Promises = require('../../../../core/src/app/promises');
import Redux = require('./redux/redux');
import State = require('../../../../core/src/app/state');

interface Id {
        uid: number;
}

export interface Server {
        app: State.State;
        lastEvaluatedKey: string;
        db: LocalDB.DBState;
        id: Id;
}

export function createServer (config: ConfigData.ConfigData, data: State.Data)
{
        const { emailDomain, immediateReplies, timeFactor, serverURL } = config;
        const lastEvaluatedKey: string = null;
        const db = LocalDB.createDB();
        const id = { uid: 0 };
        const promises = createPromises(id);

        const app = {
                emailDomain,
                timeFactor,
                immediateReplies,
                data,
                promises,
        };
        return { app, lastEvaluatedKey, db, id };
}

function createPromises (id: Id)
{
        const debugDBTimeoutMs = 0;
        const db = LocalDB.createDB();
        const calls = LocalDB.createLocalDBCalls(db, debugDBTimeoutMs);
        const sendFn = (data: Message.MessageData) => send(id, data);
        return DBTypes.createPromiseFactories(calls, sendFn);
}

export function send (id: Id, data: Message.MessageData) {
        const uid = (id.uid + 1);
        const messageId = MessageHelpers.createMessageId(data.from, uid);
        id.uid += 1;

        const reply = {
                from: data.from,
                to: data.to,
                subject: data.subject,
                body: data.body,
                id: messageId,
                inReplyToId: data.inReplyToId,
        };
        const action = ActionCreators.receiveReply(reply);
        Redux.handleAction(action);
        return Promise.resolve(messageId);
}

export function beginGame (
        playerData: PlayerData.PlayerData,
        config: ConfigData.ConfigData,
        server: Server)
{
        const { email, publicKey, firstName, lastName, timezoneOffset } = playerData;
        const { version, beginGameMessage, emailDomain } = config;

        const player = Player.createPlayerState(
                email, publicKey, version, firstName, lastName, timezoneOffset);

        const groupData = server.app.data[version];
        const promises = server.app.promises;

        return Promises.beginGame(
                beginGameMessage,
                player,
                emailDomain,
                groupData,
                promises);
}

export function tickServer (server: Server, timestampMs: number)
{
        const { app, lastEvaluatedKey } = server;

        return Main.tick(app, lastEvaluatedKey, timestampMs).then(lastEvaluatedKey => {
                console.log(`tick, lastEvaluatedKey = ${lastEvaluatedKey}`);
                server.lastEvaluatedKey = lastEvaluatedKey;
        });
}
