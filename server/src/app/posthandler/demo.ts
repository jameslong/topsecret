import App = require('../app');
import Careers = require('./careers');
import DBHelpers = require('../../../../core/src/app/dbhelpers');
import Log = require('../../../../core/src/app/log/log');
import Main = require('../../../../core/src/app/main');
import Player = require('../../../../core/src/app/player');
import Promises = require('../../../../core/src/app/promises');
import Request = require('../../../../core/src/app/requesttypes');
import State = require('../../../../core/src/app/state');

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
