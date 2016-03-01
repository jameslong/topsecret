import App = require('../app');
import Careers = require('./careers');
import DBHelpers = require('../../../../game/dbhelpers');
import Log = require('../../../../game/log/log');
import Main = require('../../../../game/main');
import Player = require('../../../../game/player');
import Promises = require('../../../../game/promises');
import Request = require('../../../../game/requesttypes');
import State = require('../../../../game/state');

export function beginDemo (
        state: App.State,
        groupData: State.GameData,
        email: string,
        playerData: Careers.PlayerApplicationData,
        threadMessageName: string,
        callback: Request.Callback<any>)
{
        const app = state.app;
        const promises = app.db;

        const publicKey: string = null;
        const firstName = playerData.firstName;
        const lastName = playerData.lastName;
        const player = Player.createPlayerState(
                email, publicKey, firstName, lastName);

        const messageName = state.config.content.resignationThread;
        const threadStartName: string = null;
        const data = Main.createPlayerlessMessageData(
                groupData,
                email,
                threadMessageName,
                threadStartName,
                app.emailDomain);

        Promises.beginGame(groupData, player, data, promises).then(message =>
                callback(null, message)
        ).catch(error => callback(error, null));
}

export function endDemo (
        state: App.State, email: string, callback: Request.Callback<any>)
{
        const app = state.app;
        const promises = app.db;

        Promises.endGame(email, promises).then(result =>
                callback(null, result)
        ).catch(error => callback(error, null));
}
