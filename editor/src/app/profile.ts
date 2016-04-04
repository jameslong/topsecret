import Immutable = require('immutable');

export interface ProfileMutable {
        name: string;
        emailLocal: string;
        firstName: string;
        lastName: string;
        publicKey: string;
        privateKey: string;
        passphrase: string;
}

interface ProfileInt extends ProfileMutable {}
export type Profile = Immutable.Record.IRecord<ProfileInt>;
export const Profile = Immutable.Record<ProfileInt>({
        name: '',
        emailLocal: '',
        firstName: '',
        lastName: '',
        publicKey: '',
        privateKey: '',
        passphrase: '',
}, 'Profile');

export type Profiles = Immutable.Map<string, Profile>;

export function convertToImmutableProfile (profileMutable: ProfileMutable)
{
        return Profile(profileMutable);
}
