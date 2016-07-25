import Map = require('../../../core/src/utils/map');

export interface Player {
        email: string;
        firstName: string;
        lastName: string;
        timezoneOffset: number;
        publicKey: string;
        privateKey: string;
        passphrase: string;
}
