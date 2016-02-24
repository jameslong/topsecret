import Map = require('./utils/map');

export interface Profile {
        name: string;
        emailLocal: string; // excluding '@' and domain
        firstName: string;
        lastName: string;
        publicKey: string;
        privateKey: string;
        passphrase: string;
}

export function getProfileByEmail (
        email: string, profiles: Map.Map<Profile>): Profile
{
        return Map.valueOf(profiles, function (profile)
                {
                        return (email.indexOf(profile.emailLocal) !== -1);
                });
}
