import App = require('../app');
import Careers = require('./careers');
import DBHelpers = require('../game/dbhelpers');
import Log = require('../game/log/log');
import Player = require('../game/player');
import Request = require('../game/requesttypes');
import Updater = require('../game/updater');

export function beginDemo (
        state: App.State,
        groupData: Updater.GameData,
        email: string,
        playerData: Careers.PlayerApplicationData,
        threadMessageName: string,
        callback: Request.Callback<any>)
{
        var onBegin = (error: Request.Error, data: any) => {
                if (!error) {
                        Log.info('beginDemo', {
                                        playerEmail: email,
                                        threadMessageName: threadMessageName,
                                });
                }
                callback(error, data);
        };

        var addPlayerLocal = function (
                        params: any,
                        callback: Request.Callback<Player.PlayerState>)
                {
                        var publicKey: string = null;
                        var firstName = playerData.firstName;
                        var lastName = playerData.lastName;
                        var playerState = Player.createPlayerState(
                                email, publicKey, firstName, lastName);

                        var newCallback = (error: Request.Error, data: any) => {
                                callback(error, playerState);
                        };

                        var addPlayerFn = state.app.db.addPlayer;
                        DBHelpers.addPlayer(
                                playerState, addPlayerFn, newCallback);
                };

        var beginGameLocal = function (
                        playerState: Player.PlayerState,
                        callback: Request.Callback<any>)
                {
                        var childIndex: number = null;
                        var parentId: string = null;
                        const threadStartName: string = null;

                        var pendingMessage = Updater.generatePendingMessage(
                                threadMessageName,
                                email,
                                parentId,
                                childIndex,
                                threadStartName);

                        Updater.onNewMessage(
                                state.app,
                                groupData,
                                pendingMessage,
                                playerState,
                                callback);
                };

        var seq = Request.seq2(addPlayerLocal, beginGameLocal);

        seq(null, onBegin);
}
