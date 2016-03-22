import Arr = require('./utils/array');
import Log = require('./log');
import Map = require('./utils/map');
import Message = require('./message');
import Player = require('./player');
import Profile = require('./profile');
import State = require('./state');
import Str = require('./utils/string');

export function createMessageState (
        email: string,
        id: string,
        name: string,
        threadStartName: string,
        numberOfChildren: number)
        : Message.MessageState
{
        var childrenSent = Arr.createArray(numberOfChildren, false);

        return {
                email: email,
                id: id,
                name: name,
                threadStartName: threadStartName,
                reply: null,
                sentTimestampMs: null,
                childrenSent: childrenSent,
                replySent: false,
        };
}

export function createMessageData (
        name: string,
        threadStartName: string,
        to: string,
        domain: string,
        groupData: State.GameData,
        vars: Player.PlayerVars): Message.MessageData
{
        const { threadData, strings, profiles } = groupData;

        const threadMessage = threadData[name];
        const message = threadMessage.message;
        const messageThreadSubject = threadMessage.threadSubject;
        const parentThreadSubject = threadStartName ?
                threadData[threadStartName].threadSubject :
                null;
        const subject = messageThreadSubject ?
                strings[messageThreadSubject] :
                'Re: ' + strings[parentThreadSubject];
        Log.assert(subject !== null, 'No thread subject: ', threadStartName);

        const fromProfile = profiles[message.from];
        const from = generateFriendlyEmail(fromProfile, domain);

        const passages = message.body.map(text => strings[text]);
        const joined = passages.join('\n\n');
        const body = (vars ? insertMessageVars(joined, vars) : joined);

        return { from, to, subject, body };
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

export function calculateFallbackEndTimestampMs (
        threadMessage: Message.ThreadMessage,
        beginTimestampMs: number,
        timeFactor: number)
        : number
{
        var delayMins = threadMessage.fallback.delayMins;
        return calculateDelayEndTimestampMs(
                threadMessage, delayMins, beginTimestampMs, timeFactor);
}

export function calculateDelayEndTimestampMs (
        threadMessage: Message.ThreadMessage,
        delayMins: number,
        beginTimestampMs: number,
        timeFactor: number)
        : number
{
        var fallbackDelayMs = (delayMins * 1000 * 60 * timeFactor);

        return (beginTimestampMs + fallbackDelayMs);
}

export function getReplyDelay (
        replyIndex: number, threadMessage: Message.ThreadMessage): Message.ThreadDelay
{
        return threadMessage.replyOptions[replyIndex].messageDelay;
}

export function createMessageId (email: string, uid: number): string
{
        return '<' + uid.toString() + '.' + email + '>';
}

export function insertMessageVars (body: string, vars: Map.Map<string>)
{
        var replacer = function (match: string, $1: string): string
                {
                        return (vars[$1] || match);
                };
        return body.replace(/\$(\w+)/gi, replacer);
}

export function hasReplyOptions (
        name: string, threadData: Map.Map<Message.ThreadMessage>): boolean
{
        var threadMessage = threadData[name];
        return (threadMessage.replyOptions !== null);
}
