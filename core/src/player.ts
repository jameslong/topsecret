import Map = require('./utils/map');
import Script = require('./script');

export interface PlayerVars {
        [k: string]: Script.Atom;
        firstName: string;
        lastName: string;
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
                },
        };
}
