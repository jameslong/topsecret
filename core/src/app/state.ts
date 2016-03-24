import DBTypes = require('./dbtypes');
import Kbpgp = require('./kbpgp');
import Helpers = require('./utils/helpers');
import Map = require('./utils/map');
import Message = require('./message');
import Profile = require('./profile');
import Request = require('./requesttypes');

export interface NarrativeData {
        name: string;
        profiles: Map.Map<Profile.Profile>;
        messages: Map.Map<Message.ThreadMessage>;
        strings: Map.Map<string>;
}

export interface GameData extends NarrativeData {
        keyManagers: Kbpgp.KeyManagers;
}

export type Narratives = Map.Map<NarrativeData>;
export type Data = Map.Map<GameData>;

export interface State {
        emailDomain: string;
        timeFactor: number;
        immediateReplies: boolean;
        data: Data;
        promises: DBTypes.PromiseFactories;
}

export function addKeyManagers (data: NarrativeData): Promise<GameData>
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
                        strings: data.strings,
                        keyManagers: instances,
                };
        });
}
