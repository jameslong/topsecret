import Arr = require('./utils/array');
import Log = require('./log');
import Map = require('./utils/map');
import Message = require('./message');
import Player = require('./player');
import Profile = require('./profile');
import ReplyOption = require('./replyoption');
import Script = require('./script');
import State = require('./state');
import Str = require('./utils/string');

export function createMessageState (
        email: string,
        id: string,
        name: string,
        sentTimestampMs: number,
        threadStartName: string,
        numberOfChildren: number)
        : Message.MessageState
{
        const childrenSent = Arr.createArray(numberOfChildren, false);

        return {
                email,
                id,
                name,
                threadStartName,
                reply: null,
                sentTimestampMs,
                childrenSent,
                replySent: false,
        };
}

export function createMessageData (
        name: string,
        threadStartName: string,
        inReplyToId: string,
        to: string,
        domain: string,
        groupData: State.GameData,
        vars: Player.PlayerVars): Message.MessageData
{
        const { messages, strings, profiles } = groupData;

        const threadMessage = messages[name];
        const message = threadMessage.message;
        const messageThreadSubject = threadMessage.threadSubject;
        const parentThreadSubject = threadStartName ?
                messages[threadStartName].threadSubject :
                null;
        const subject = messageThreadSubject ?
                strings[messageThreadSubject] :
                'Re: ' + strings[parentThreadSubject];
        Log.assert(subject !== null, 'No thread subject: ', threadStartName);

        const fromProfile = profiles[message.from];
        const from = generateFriendlyEmail(fromProfile, domain);

        const passage = strings[message.body];
        const body = (vars ? insertMessageVars(passage, vars) : passage);

        return { from, to, subject, body, inReplyToId };
}

export function addDomain (local: string, domain: string): string
{
        return (local + '@' + domain);
}

export function generateFriendlyEmail (
        profile: Profile.Profile, domain: string)
{
        var friendly = (profile.firstName + ' ' + profile.lastName);
        var email = '<' + addDomain(profile.emailLocal, domain) + '>';

        return friendly + ' ' + email;
}

export function getSelectedReply (
        options: Message.NamedThreadDelay[],
        reply: string): string
{
        var replyBodyLower = reply.toLowerCase();

        var selectedOption = Arr.valueOf(options, (option) => {
                        return Arr.every(option.matches, (match) =>
                                Str.containsWord(replyBodyLower, match))
                });

        return (selectedOption ? selectedOption.name : null);
}

export function getReplyDelay (
        replyIndex: number,
        message: Message.ThreadMessage,
        replyOptions: Map.Map<ReplyOption.ReplyOption[]>): Message.ThreadDelay
{
        return replyOptions[message.replyOptions][replyIndex].messageDelay;
}

export function createMessageId (email: string, uid: number): string
{
        return '<' + uid.toString() + '.' + email + '>';
}

export function insertMessageVars (body: string, vars: Map.Map<Script.Atom>)
{
        var replacer = function (match: string, $1: string): string
                {
                        return (`${vars[$1]}` || match);
                };
        return body.replace(/\$(\w+)/gi, replacer);
}

export function hasReplyOptions (
        name: string, threadData: Map.Map<Message.ThreadMessage>): boolean
{
        var threadMessage = threadData[name];
        return (threadMessage.replyOptions !== null);
}

export function stripBody (body: string)
{
        return Str.filterByLines(body, line => !Str.beginsWith(line, '> '));
}

export function createThreadDelay (): Message.ThreadDelay
{
        return {
                name: '',
                condition: '',
                delay: [0, 0, 0],
        };
}
