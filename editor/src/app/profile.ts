import Map = require('./../../../core/src/app/utils/map');

export interface Profile {
        name: string;
        emailLocal: string;
        firstName: string;
        lastName: string;
        publicKey: string;
        privateKey: string;
        passphrase: string;
}

export type Profiles = Map.Map<Profile>;
