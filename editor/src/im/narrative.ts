module Im {
        export interface NarrativeMutable {
                name: string;
                messages: { [key: string]: MessageMutable; };
                profiles: { [key: string]: ProfileMutable; };
                strings: { [key: string]: string; };
        }

        export interface NarrativesMutable {
                [i: string]: NarrativeMutable;
        }

        export type Messages = Immutable.Map<string, Message>;
        export type Profiles = Immutable.Map<string, Profile>;
        export type Strings = Immutable.Map<string, string>;
        export type Narratives = Immutable.Map<string, Narrative>;

        interface NarrativeInt {
                name: string;
                messages: Messages;
                profiles: Profiles;
                strings: Strings;
        };
        export type Narrative = Immutable.Record.IRecord<NarrativeInt>;
        export const Narrative = Immutable.Record<NarrativeInt>({
                name: '',
                messages: Immutable.Map<string, Message>(),
                profiles: Immutable.Map<string, Profile>(),
                strings: Immutable.Map<string, string>(),
        }, 'Narrative');

        export function convertToImmutableNarrative (
                narrativeMutable: NarrativeMutable)
        {
                const messagesMutable = narrativeMutable.messages;
                const messages = mapFromObject(
                        messagesMutable, convertToImmutableMessage);

                const profilesMutable = narrativeMutable.profiles;
                const profiles = mapFromObject(
                        profilesMutable, convertToImmutableProfile);

                const stringsMutable = narrativeMutable.strings;
                const strings = mapFromObject(stringsMutable, text => text);

                return Narrative({
                        name: narrativeMutable.name,
                        messages: messages,
                        profiles: profiles,
                        strings: strings,
                });
        }

        export function getActiveNarrative (store: Store)
        {
                return store.narratives.get(store.activeNarrative);
        }

        export function markNarrativeValid (narrative: Narrative)
        {
                const name = narrative.name;
                const profiles = narrative.profiles;
                const strings = narrative.strings;
                const newMessages = Im.markMessagesValid(
                        narrative.messages, strings, profiles);

                return narrative.set('messages', newMessages);
        }
}
