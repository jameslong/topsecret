import Immutable = require('immutable');
import Helpers = require('./helpers');
import Message = require('./message');
import MessageDelay = require('./messagedelay');
import Profile = require('./profile');
import State = require('./state');

export interface NarrativeMutable {
        name: string;
        messages: { [key: string]: Message.MessageMutable; };
        profiles: { [key: string]: Profile.ProfileMutable; };
        strings: { [key: string]: string; };
}

export interface NarrativesMutable {
        [i: string]: NarrativeMutable;
}

export type Strings = Immutable.Map<string, string>;
export type Narratives = Immutable.Map<string, Narrative>;

interface NarrativeInt {
        name: string;
        messagesById: Message.Messages;
        profilesById: Profile.Profiles;
        stringsById: Strings;
};
export type Narrative = Immutable.Record.IRecord<NarrativeInt>;
export const Narrative = Immutable.Record<NarrativeInt>({
        name: '',
        messagesById: Immutable.Map<string, Message.Message>(),
        profilesById: Immutable.Map<string, Profile.Profile>(),
        stringsById: Immutable.Map<string, string>(),
}, 'Narrative');

export function convertToImmutableNarrative (
        narrativeMutable: NarrativeMutable)
{
        const messagesMutable = narrativeMutable.messages;
        const messagesById = Helpers.mapFromObject(
                messagesMutable, Message.convertToImmutableMessage);

        const profilesMutable = narrativeMutable.profiles;
        const profilesById = Helpers.mapFromObject(
                profilesMutable, Profile.convertToImmutableProfile);

        const stringsMutable = narrativeMutable.strings;
        const stringsById = Helpers.mapFromObject(stringsMutable, text => text);

        return Narrative({
                name: narrativeMutable.name,
                messagesById,
                profilesById,
                stringsById,
        });
}

export function getActiveNarrative (store: State.Store)
{
        return store.narratives.get(store.activeNarrative);
}

export function markNarrativeValid (narrative: Narrative)
{
        const name = narrative.name;
        const profiles = narrative.profilesById;
        const strings = narrative.stringsById;
        const newMessages = Message.markMessagesValid(
                narrative.messagesById, strings, profiles);

        return narrative.set('messagesById', newMessages);
}
