import App = require('../app');
import Careers = require('./careers');
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
        threadMessageName: string)
{
        const app = state.app;
        const promises = app.promises;

        const publicKey: string = null;
        const firstName = playerData.firstName;
        const lastName = playerData.lastName;
        const version = state.config.content.defaultNarrativeGroup;
        const player = Player.createPlayerState(
                email, publicKey, version, firstName, lastName);

        const messageName = state.config.content.resignationThread;
        const threadStartName: string = null;
        const data = Main.createPlayerlessMessageData(
                groupData,
                email,
                threadMessageName,
                threadStartName,
                app.emailDomain);

        return Promises.beginGame(groupData, player, data, promises);
}

export function endDemo (state: App.State, email: string)
{
        const app = state.app;
        const promises = app.promises;

        return Promises.endGame(email, promises);
}
