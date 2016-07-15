import Helpers = require('./../../core/src/utils/helpers');
import Map = require('./../../core/src/utils/map');
import EditorMessage = require('./editormessage');
import MessageDelay = require('./messagedelay');
import Profile = require('./profile');
import ReplyOption = require('./../../core/src/replyoption');
import State = require('./state');

export type Strings = Map.Map<string>;

export interface NarrativeData {
        name: string;
        messages: EditorMessage.EditorMessages;
        profiles: Profile.Profiles;
        replyOptions: Map.Map<ReplyOption.ReplyOptions>,
        strings: Strings;
        attachments: Strings;
}

export type NarrativesData = Map.Map<NarrativeData>;

export interface Narrative {
        name: string;
        messagesById: EditorMessage.EditorMessages;
        profilesById: Profile.Profiles;
        replyOptionsById: Map.Map<ReplyOption.ReplyOptions>;
        stringsById: Strings;
        attachments: Strings;
};

export type Narratives = Map.Map<Narrative>;

export function convertToNarrative (data: NarrativeData): Narrative
{
        return {
                name: data.name,
                messagesById: data.messages,
                profilesById: data.profiles,
                replyOptionsById: data.replyOptions,
                stringsById: data.strings,
                attachments: data.attachments,
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
        const replyOptions = narrative.replyOptionsById;
        const strings = narrative.stringsById;
        const attachments = narrative.attachments;
        const newMessages = EditorMessage.markMessagesValid(
                narrative.messagesById,
                replyOptions,
                strings,
                profiles,
                attachments);

        return Helpers.assign(narrative, { messagesById: newMessages });
}
