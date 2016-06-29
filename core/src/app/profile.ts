import Map = require('./utils/map');

export interface Profile {
        name: string;
        email: string;
        firstName: string;
        lastName: string;
        signature: string;
        publicKey: string;
        privateKey: string;
        passphrase: string;
}

export function getProfileByEmail (
        email: string, profiles: Map.Map<Profile>): Profile
{
        return Map.valueOf(profiles, profile => profile.email === email);
}
