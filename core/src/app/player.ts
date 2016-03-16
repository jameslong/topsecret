import Map = require('./utils/map');

export interface PlayerVars {
        [k: string]: string;
        firstName: string;
        lastName: string;
}

export interface PlayerState {
        email: string;
        publicKey: string;
        messageUID: number;
        version: string;
        emptyMessages: Map.Map<string>; // from profile name to message id
        vars: PlayerVars;
}

export function createPlayerState (
        email: string,
        publicKey: string,
        version: string,
        firstName: string,
        lastName: string): PlayerState
{
        return {
                email,
                publicKey,
                messageUID: 0,
                version,
                emptyMessages: {},
                vars: {
                        firstName,
                        lastName,
                },
        };
}
