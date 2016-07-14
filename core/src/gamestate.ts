import Data = require('./data');
import DBTypes = require('./dbtypes');
import Kbpgp = require('./kbpgp');
import Helpers = require('./utils/helpers');
import Map = require('./utils/map');
import Profile = require('./profile');

export interface NarrativeState extends Data.NarrativeData {
        keyManagers: Kbpgp.KeyManagers;
}
export type NarrativeStates = Map.Map<NarrativeState>;

export interface GameState {
        narratives: NarrativeStates;
        promises: DBTypes.PromiseFactories;
}

export function addKeyManagers (data: Data.NarrativeData): Promise<NarrativeState>
{
        const keyData = Helpers.arrayFromMap<Profile.Profile, Kbpgp.KeyData>(
                data.profiles, profile => {
                        return {
                                id: profile.name,
                                passphrase: profile.passphrase,
                                key: profile.privateKey,
                        };
                });
        return Kbpgp.loadFromKeyData(keyData).then(instances => {
                return {
                        name: data.name,
                        profiles: data.profiles,
                        messages: data.messages,
                        replyOptions: data.replyOptions,
                        strings: data.strings,
                        attachments: data.attachments,
                        keyManagers: instances,
                };
        });
}
