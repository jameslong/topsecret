import Helpers = require('./../../../core/src/app/utils/helpers');
import Map = require('./../../../core/src/app/utils/map');
import Message = require('./message');
import MessageDelay = require('./messagedelay');
import Profile = require('./profile');
import State = require('./state');

export type Strings = Map.Map<string>;

export interface NarrativeData {
        name: string;
        messages: Message.Messages;
        profiles: Profile.Profiles;
        strings: Strings;
}

export type NarrativesData = Map.Map<NarrativeData>;

export interface Narrative {
        name: string;
        messagesById: Message.Messages;
        profilesById: Profile.Profiles;
        stringsById: Strings;
};

export type Narratives = Map.Map<Narrative>;

export function convertToNarrative (data: NarrativeData): Narrative
{
        return {
                name: data.name,
                messagesById: data.messages,
                profilesById: data.profiles,
                stringsById: data.strings,
        };
}

export function getActiveNarrative (store: State.Store)
{
        return store.data.narrativesById[store.ui.activeNarrativeId];
}

export function markNarrativeValid (narrative: Narrative)
{
        const name = narrative.name;
        const profiles = narrative.profilesById;
        const strings = narrative.stringsById;
        const newMessages = Message.markMessagesValid(
                narrative.messagesById, strings, profiles);

        return Helpers.assign(narrative, { messagesById: newMessages });
}
