import DBHelpers = require('../../../../core/src/app/dbhelpers');
import Request = require('../../../../core/src/app/requesttypes');
import Player = require('../../../../core/src/app/player');
import PostHandler = require('./posthandler');

export function handleAddPlayerRequest (
        email: string,
        publicKey: string,
        firstName: string,
        lastName: string,
        requestFn: Request.AddPlayerRequest,
        res: any)
{
        var callback = PostHandler.createRequestCallback(res);

        var playerState = Player.createPlayerState(
                email, publicKey, firstName, lastName);

        DBHelpers.addPlayer(playerState, requestFn, callback);
}

export function handleRemovePlayerRequest (
        email: string,
        requestFn: Request.RemovePlayerRequest,
        res: any)
{
        var callback = PostHandler.createRequestCallback(res);

        DBHelpers.removePlayer(email, requestFn, callback);
}
