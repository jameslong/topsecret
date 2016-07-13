import Clock = require('./../../core/src/app/clock');
import Config = require('./config');
import Data = require('../../core/src/app/data');
import DataValidation = require('../../core/src/app/datavalidation');
import FileSystem = require('../../core/src/app/filesystem');
import DBSetup = require('./db/dbsetup');
import DBTypes = require('./../../core/src/app/dbtypes');
import KBPGP = require('./../../core/src/app/kbpgp');
import Helpers = require('./../../core/src/app/utils/helpers');
import Log = require('./../../core/src/app/log');
import Main = require('./../../core/src/app/main');
import Map = require('./../../core/src/app/utils/map');
import Message = require('./../../core/src/app/message');
import PostHandler = require('./posthandler/posthandler');
import Profile = require('./../../core/src/app/profile');
import Prom = require('./../../core/src/app/utils/promise');
import Request = require('./../../core/src/app/requesttypes');
import Sender = require('./sender');
import Server = require('./server');
import State = require('./../../core/src/app/state');

export interface State {
        config: Config.ConfigState;
        server: Server.ServerState;
        lastEvaluatedKey: string;
        app: State.State;
        clock: Clock.Clock;
}

export function createState (config: Config.ConfigState)
{
        const server = Server.createServerState();
        const lastEvaluatedKey: string = null;
        const clock = Clock.createClock(config.timeFactor);

        return createGameState(config, server).then(app => {
                return { config, server, lastEvaluatedKey, app, clock };
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
        const narrativeData = Data.loadNarrativeData(path);
        const content = config.content;
        const profileSchema = FileSystem.loadJSONSync<JSON>(
                content.profileSchemaPath);
        const messageSchema = FileSystem.loadJSONSync<JSON>(
                content.messageSchemaPath);
        const replyOptionSchema = FileSystem.loadJSONSync<JSON>(
                content.replyOptionSchemaPath);
        const dataErrors = narrativeData.reduce((result, narrative) => {
                const errors = DataValidation.getDataErrors(
                        narrative,
                        profileSchema,
                        messageSchema,
                        replyOptionSchema);
                if (errors.length) {
                        result.push(errors);
                }
                return result;
        }, []);
        const promise = new Promise<State.NarrativeData[]>((resolve, reject) =>
                dataErrors.length ?
                        reject(dataErrors) :
                        resolve(narrativeData)
        );

        return promise.then(narrativeData =>
                Data.initKeyManagers(narrativeData)
        ).then(gameData =>
                onGameData(config, server, gameData)
        ).catch(err => {
                Log.error(err);
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
                config.content.htmlFooter,
                config.content.textFooter,
                config.mailgun.apiKey,
                config.emailDomain);
        const promises = DBSetup.createPromiseFactories(config, send);


        const gameState: State.State = {
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
        // Log.debug('Update wrapper');

        const paused = state.server.paused;
        const updatePromise = paused ?
                Promise.resolve(state.lastEvaluatedKey) :
                update(state);

        updatePromise.then(lastEvaluatedKey =>
                onUpdateEnd(state, lastEvaluatedKey)
        ).catch(err => {
                Log.error(err);
                onUpdateEnd(state, null);
        });
}

export function update (state: State)
{
        const gameState = state.app;
        const exclusiveStartKey = state.lastEvaluatedKey;
        state.clock = Clock.tick(state.clock);

        // Log.debug(`Update - exclusiveStartKey = ${exclusiveStartKey}`);

        return Main.tick(gameState, state.clock, exclusiveStartKey);
}

export function onUpdateEnd (state: State, lastEvaluatedKey: string)
{
        // Log.debug(`Update end - lastEvaluatedKey = ${lastEvaluatedKey}`);

        state.lastEvaluatedKey = lastEvaluatedKey;
        const config = state.config;
        const updateIntervalMs = config.updateIntervalMs;
        return Prom.delay(updateIntervalMs).then(result =>
                updateWrapper(state)
        );
}
