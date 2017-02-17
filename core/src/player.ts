import Clock = require('./clock');
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

export function gameDay(clock: Clock.Clock, player: PlayerState)
{
        const start = new Date(player.vars.utcStartDate);
        const current = new Date(Clock.gameTimeMs(clock));
        start.setUTCHours(0);
        start.setUTCMinutes(0);
        start.setUTCSeconds(0);
        start.setUTCMilliseconds(0);
        current.setUTCHours(0);
        current.setUTCMinutes(0);
        current.setUTCSeconds(0);
        current.setUTCMilliseconds(0);
        const diffMs = current.getTime() - start.getTime();
        const dayMs =1000 * 60 * 60 * 24;
        return Math.max(0, Math.floor(diffMs / dayMs));
}
