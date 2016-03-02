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
        emptyMessages: Map.Map<string>; // from profile name to message id
        vars: PlayerVars;
}

export function createPlayerState (
        email: string,
        publicKey: string,
        firstName: string,
        lastName: string): PlayerState
{
        return {
                email: email,
                publicKey: publicKey,
                messageUID: 0,
                emptyMessages: {},
                vars: {
                        firstName: firstName,
                        lastName: lastName,
                },
        };
}
