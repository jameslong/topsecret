import Clock = require('./../../core/src/clock');
import Config = require('./config');
import Data = require('../../core/src/data');
import DataValidation = require('../../core/src/datavalidation');
import DynamoDB = require('./dynamodb');
import FileSystem = require('../../core/src/filesystem');
import DBTypes = require('./../../core/src/dbtypes');
import KBPGP = require('./../../core/src/kbpgp');
import Helpers = require('./../../core/src/utils/helpers');
import LocalDB = require('../../core/src/localdb');
import Log = require('./../../core/src/log');
import Main = require('./../../core/src/main');
import Mailgun = require('./mailgun');
import Map = require('./../../core/src/utils/map');
import Message = require('./../../core/src/message');
import PostHandler = require('./requesthandler');
import Profile = require('./../../core/src/profile');
import Prom = require('./../../core/src/utils/promise');
import Request = require('./../../core/src/requesttypes');
import Server = require('./server');
import State = require('./../../core/src/state');

export interface State {
        config: Config.ConfigState;
        clock: Clock.Clock;
        game: State.State;
        lastEvaluatedKey: string; // Used to request next message from db
        paused: boolean;
        server: Server.ServerState;
}

export function createState (config: Config.ConfigState)
{
        const server = Server.createServerState();
        const lastEvaluatedKey: string = null;
        const clock = Clock.createClock(config.timeFactor);
        const paused = false;

        return createGameState(config, server).then(game => {
                return {
                        config,
                        clock,
                        game,
                        lastEvaluatedKey,
                        paused,
                        server,
                };
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
        const { useEmail, emailDomain } = config;
        const { htmlFooter, textFooter } = config.content;
        const emailAPIKey = config.credentials.mailgunApiKey;
        const mailgun = Mailgun.createMailgun(emailAPIKey, emailDomain);
        const send = (data: Message.MessageData) => useEmail ?
                Mailgun.sendMail(mailgun, htmlFooter, textFooter, data) :
                Server.sendMail(data);

        const calls = config.useDynamoDB ?
                DynamoDB.createDynamoDBCalls(config) :
                LocalDB.createLocalDBCalls(
                        LocalDB.createDB(), config.debugDBTimeoutMs);
        const promises = DBTypes.createPromiseFactories(calls, send);

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
                state.game = gameState;
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

        const paused = state.paused;
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
        const gameState = state.game;
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
