import Map = require('./utils/map');
import Script = require('./script');

export interface PlayerVars {
        [k: string]: Script.Atom;
        firstName: string;
        lastName: string;
        utcStartDate: number;
}

export interface PlayerState {
        email: string;
        publicKey: string;
        messageUID: number;
        version: string;
        utcOffset: number;
        emptyMessages: Map.Map<string>; // from profile name to message id
        vars: PlayerVars;
}

export function createPlayerState (
        email: string,
        publicKey: string,
        version: string,
        firstName: string,
        lastName: string,
        utcOffset: number): PlayerState
{
        return {
                email,
                publicKey,
                messageUID: 0,
                version,
                utcOffset,
                emptyMessages: {},
                vars: {
                        firstName,
                        lastName,
                        utcStartDate: 4105126861000, // If unset, no absolute delays will expire
                },
        };
}

export function gameVars(player: PlayerState)
{
        return Map.filter(player.vars, (variable, name) => isGameVar(name));
}

export function messagesSent(player: PlayerState)
{
        return Map.filter(player.vars, (variable, name) => isGameVar(name));
}

function isGameVar(variableName: string)
{
        return variableName.toUpperCase() == variableName;
}
