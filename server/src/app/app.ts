import Profile = require('./game/profile');
import Config = require('./config');
import Data = require('./data/data');
import DBHelpers = require('./game/dbhelpers');
import DBSetup = require('./db/dbsetup');
import DBTypes = require('./game/dbtypes');
import KBPGP = require('./game/kbpgp');
import Log = require('./game/log/log');
import Map = require('./game/utils/map');
import Message = require('./game/message');
import PostHandler = require('./posthandler/posthandler');
import Request = require('./game/requesttypes');
import Sender = require('./sender');
import Server = require('./server');
import Updater = require('./game/updater');

export interface State {
        config: Config.ConfigState;
        server: Server.ServerState;
        update: UpdateState;
        app: Updater.State;
}

export function createState (
        config: Config.ConfigState,
        callback: Request.Callback<State>)
{
        const server = Server.createServerState();
        const update = createUpdateState();
        createGameState(config, server, (error, app) =>
                callback(error, { config, server, update, app })
        );
}

export function getGroupData (app: Updater.State, groupName: string)
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
        server: Server.ServerState,
        callback: Request.Callback<Updater.State>)
{
        var db = DBSetup.createDBCalls(config);
        var sendFn = Sender.createSendFn(
                server.io,
                config.useEmail,
                config.emailAPIKey,
                config.emailDomain);

        var gameDataCallback = createGameDataCallback(
                config, sendFn, db, callback);
        Data.loadAllGameData(config, gameDataCallback);
}

export function createGameDataCallback (
        config: Config.ConfigState,
        send: Sender.SendFn,
        db: DBTypes.DBCalls,
        callback: Request.Callback<Updater.State>)
{
        return (error: Request.Error, gameData: Updater.GameData[]) =>
                {
                        var gameState: Updater.State = {
                                emailDomain: config.emailDomain,
                                timeFactor: config.timeFactor,
                                immediateReplies: config.immediateReplies,
                                data: null,
                                send,
                                db,
                        };

                        if (gameData) {
                                var mappedGameData = Map.mapFromArray(gameData);
                                gameState.data = mappedGameData;
                        }

                        callback(error, gameState);
                };
}

export function updateGameState (
        state: State, callback: Request.Callback<Updater.State>)
{
        var onGameState = (error: Request.Error, gameState: Updater.State) =>
                {
                        if (!error) {
                                Log.debug('Updater.State updated');
                                state.app = gameState;
                        }
                        callback(error, gameState);
                };

        var config = state.config;
        createGameState(config, state.server, onGameState);
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

        var gameState = state.app;
        var updateState = state.update;
        var config = state.config;
        var server = state.server;

        var callback = (error: Request.Error, data: Request.GetMessagesResult) => {
                        if (!error) {
                                Log.debug('Get Messages: ', data);
                                onGetMessages(state, data);
                        } else {
                                updateState.lastEvaluatedKey = null;
                                onUpdateEnd(state);
                        }
                };

        var lastEvaluatedKey = updateState.lastEvaluatedKey;
        Log.debug('Last evaluated key', lastEvaluatedKey);
        var maxResults = config.update.maxMessagesRequestedPerUpdate;
        var getMessagesFn = gameState.db.getMessages;
        DBHelpers.getMessages(lastEvaluatedKey, maxResults, getMessagesFn, callback);
}

export function onUpdateEnd (state: State)
{
        Log.debug('Update end');

        var config = state.config;

        var updateFn = () => updateWrapper(state);
        setTimeout(updateFn, config.update.updateIntervalMs);
}

export function onGetMessages (state: State, data: Request.GetMessagesResult)
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
                Updater.update(gameState, timestampMs, message, onUpdateEndLocal);
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
                lastUpdated[message.messageId] === undefined);
}

export function storeLastUpdated (
        lastUpdated: Map.Map<number>,
        messages: Message.MessageState[],
        timestampMs: number)
{
        messages.forEach(
                (message) => lastUpdated[message.messageId] = timestampMs);
}
