import DBHelpers = require('../../../../game/dbhelpers');
import Request = require('../../../../game/requesttypes');
import Player = require('../../../../game/player');
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
