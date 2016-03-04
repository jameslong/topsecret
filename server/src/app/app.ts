import Profile = require('./../../../core/src/app/profile');
import Config = require('./config');
import Data = require('./data/data');
import DBSetup = require('./db/dbsetup');
import DBTypes = require('./../../../core/src/app/dbtypes');
import KBPGP = require('./../../../core/src/app/kbpgp');
import Helpers = require('./../../../core/src/app/utils/helpers');
import Log = require('./../../../core/src/app/log/log');
import Main = require('./../../../core/src/app/main');
import Map = require('./../../../core/src/app/utils/map');
import Message = require('./../../../core/src/app/message');
import PostHandler = require('./posthandler/posthandler');
import Request = require('./../../../core/src/app/requesttypes');
import Sender = require('./sender');
import Server = require('./server');
import State = require('./../../../core/src/app/state');

export interface State {
        config: Config.ConfigState;
        server: Server.ServerState;
        update: UpdateState;
        app: State.State;
}

export function createState (config: Config.ConfigState)
{
        const server = Server.createServerState();
        const update = createUpdateState();
        return createGameState(config, server).then(app => {
                return { config, server, update, app };
        });
}

export function getGroupData (app: State.State, groupName: string)
{
        return app.data[groupName];
}

export interface UpdateState {
        lastEvaluatedKey: string;
        lastUpdated: Map.Map<number>;
}

function createUpdateState (): UpdateState
{
        return {
                lastEvaluatedKey: null,
                lastUpdated: {},
        };
}

export function createGameState (
        config: Config.ConfigState,
        server: Server.ServerState)
{
        return Data.loadAllGameData(config).then(gameData =>
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
        const encrypt = KBPGP.signEncrypt;
        const send = Sender.createSendFn(
                server.io,
                config.useEmail,
                config.emailAPIKey,
                config.emailDomain);
        const promises = DBSetup.createPromiseFactories(config, send, encrypt);

        const gameState: State.State = {
                emailDomain: config.emailDomain,
                timeFactor: config.timeFactor,
                immediateReplies: config.immediateReplies,
                data: null,
                promises,
        };

        if (gameData) {
                var mappedGameData = Helpers.mapFromNameArray(gameData);
                gameState.data = mappedGameData;
        }

        return gameState;
}

export function updateGameState (state: State)
{
        var config = state.config;
        return createGameState(state.config, state.server).then(gameState => {
                state.app = gameState;
                return gameState;
        });
}

export function init (state: State)
{
        var gameState = state.app;
        var config = state.config;

        PostHandler.addRequestEndpoints(state);

        updateWrapper(state);
}

export function updateWrapper (state: State)
{
        Log.debug('Update wrapper');

        try {
                if (!state.server.paused) {
                        update(state);
                } else {
                        onUpdateEnd(state);
                }
        } catch (error) {
                Log.info('Exception thrown', error);
                onUpdateEnd(state);
        }
}

export function update (state: State)
{
        Log.debug('Update');

        const gameState = state.app;
        const updateState = state.update;
        const config = state.config;
        const server = state.server;

        const lastEvaluatedKey = updateState.lastEvaluatedKey;
        Log.debug('Last evaluated key', lastEvaluatedKey);
        const maxResults = config.update.maxMessagesRequestedPerUpdate;

        const getMessages = gameState.promises.getMessages;
        const params = { startKey: lastEvaluatedKey, maxResults };

        getMessages(params).then(data =>
                onGetMessages(state, data)
        ).catch(err => {
                updateState.lastEvaluatedKey = null;
                onUpdateEnd(state);
        });
}

export function onUpdateEnd (state: State)
{
        Log.debug('Update end');

        var config = state.config;

        var updateFn = () => updateWrapper(state);
        setTimeout(updateFn, config.update.updateIntervalMs);
}

export function onGetMessages (state: State, data: DBTypes.GetMessagesResult)
{
        Log.debug('onGetMessages');

        var timestampMs = Date.now();

        var gameState = state.app;
        var updateState = state.update;
        var config = state.config;

        updateState.lastEvaluatedKey = data.lastEvaluatedKey;

        var messages = data.messages;
        var message: Message.MessageState = null;

        if (messages.length === 2) {
                message = messages[Math.floor(Math.random() * messages.length)]; // HACK TO PREVENT STARVATION
        } else {
                message = (messages.length ? messages[messages.length - 1] : null);
        }
        const onUpdateEndLocal = (error: Request.Error) =>
                onUpdateEnd(state);

        if (message) {
                gameState.promises.getPlayer(message.email).then(player =>
                        Main.update(
                                gameState,
                                timestampMs,
                                message,
                                player)
                ).then(result =>
                        onUpdateEndLocal(null)
                ).catch(onUpdateEndLocal);
        } else {
                onUpdateEndLocal(null);
        }
}

export function updateLastUpdated (
        state: UpdateState, timestampMs: number, minUpdateIntervalMs: number)
{
        var shouldNotUpdate = (lastUpdateMs: number) =>
                ((timestampMs - lastUpdateMs) < minUpdateIntervalMs);

        state.lastUpdated = Map.filter(state.lastUpdated, shouldNotUpdate);
}

export function getMessagesToUpdate (
        lastUpdated: Map.Map<number>,
        messages: Message.MessageState[])
        : Message.MessageState[]
{
        return messages.filter((message) =>
                lastUpdated[message.id] === undefined);
}

export function storeLastUpdated (
        lastUpdated: Map.Map<number>,
        messages: Message.MessageState[],
        timestampMs: number)
{
        messages.forEach(
                (message) => lastUpdated[message.id] = timestampMs);
}
