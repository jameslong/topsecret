import Profile = require('./../../../core/src/app/profile');
import Config = require('./config');
import Data = require('./data/data');
import DBSetup = require('./db/dbsetup');
import DBTypes = require('./../../../core/src/app/dbtypes');
import KBPGP = require('./../../../core/src/app/kbpgp');
import Helpers = require('./../../../core/src/app/utils/helpers');
import Log = require('./../../../core/src/app/log');
import Main = require('./../../../core/src/app/main');
import Map = require('./../../../core/src/app/utils/map');
import Message = require('./../../../core/src/app/message');
import PostHandler = require('./posthandler/posthandler');
import Prom = require('./../../../core/src/app/utils/promise');
import Request = require('./../../../core/src/app/requesttypes');
import Sender = require('./sender');
import Server = require('./server');
import State = require('./../../../core/src/app/state');

export interface State {
        config: Config.ConfigState;
        server: Server.ServerState;
        lastEvaluatedKey: string;
        app: State.State;
}

export function createState (config: Config.ConfigState)
{
        const server = Server.createServerState();
        const lastEvaluatedKey: string = null;
        return createGameState(config, server).then(app => {
                return { config, server, lastEvaluatedKey, app };
        });
}

export function getGroupData (app: State.State, groupName: string)
{
        return app.data[groupName];
}

export function createGameState (
        config: Config.ConfigState,
        server: Server.ServerState)
{
        const path = config.content.narrativeFolder;
        return Data.loadAllGameData(path).then(gameData =>
                onGameData(config, server, gameData)
        ).catch(err => {
                Log.info('createGameState error: ' + err);
                return onGameData(config, server, null);
        });
}

export function onGameData (
        config: Config.ConfigState,
        server: Server.ServerState,
        gameData: State.GameData[])
{
        const send = Sender.createSendFn(
                server.io,
                config.useEmail,
                config.emailAPIKey,
                config.emailDomain);
        const promises = DBSetup.createPromiseFactories(config, send);

        const gameState: State.State = {
                emailDomain: config.emailDomain,
                timeFactor: config.timeFactor,
                immediateReplies: config.immediateReplies,
                data: null,
                promises,
        };

        if (gameData) {
                const mappedGameData = Helpers.mapFromNameArray(gameData);
                gameState.data = mappedGameData;
        }

        return gameState;
}

export function updateGameState (state: State)
{
        const config = state.config;
        return createGameState(state.config, state.server).then(gameState => {
                state.app = gameState;
                return state;
        });
}

export function init (state: State)
{
        PostHandler.addRequestEndpoints(state);
        updateWrapper(state);
}

export function updateWrapper (state: State)
{
        Log.debug('Update wrapper');

        const paused = state.server.paused;
        const updatePromise = paused ?
                Promise.resolve(state.lastEvaluatedKey) :
                update(state);

        updatePromise.then(lastEvaluatedKey =>
                onUpdateEnd(state, lastEvaluatedKey)
        ).catch(err => {
                Log.info(err);
                onUpdateEnd(state, null);
        });
}

export function update (state: State)
{
        const gameState = state.app;
        const exclusiveStartKey = state.lastEvaluatedKey;
        const timestampMs = Date.now();

        Log.debug(`Update - exclusiveStartKey = ${exclusiveStartKey}`);

        return Main.tick(gameState, exclusiveStartKey, timestampMs);
}

export function onUpdateEnd (state: State, lastEvaluatedKey: string)
{
        Log.debug(`Update end - lastEvaluatedKey = ${lastEvaluatedKey}`);

        state.lastEvaluatedKey = lastEvaluatedKey;
        const config = state.config;
        const updateIntervalMs = config.update.updateIntervalMs;
        return Prom.delay(updateIntervalMs).then(result =>
                updateWrapper(state)
        );
}
