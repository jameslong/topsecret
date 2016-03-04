import Arr = require('./utils/array');
import Log = require('./log/log');
import Map = require('./utils/map');
import Message = require('./message');
import Player = require('./player');
import Profile = require('./profile');
import Str = require('./utils/string');

export function createMessageState (
        email: string,
        version: string,
        id: string,
        name: string,
        threadStartName: string,
        numberOfChildren: number)
        : Message.MessageState
{
        var childrenSent = Arr.createArray(numberOfChildren, false);

        return {
                email: email,
                version: version,
                id: id,
                name: name,
                threadStartName: threadStartName,
                reply: null,
                sentTimestampMs: null,
                childrenSent: childrenSent,
                replySent: false,
        };
}

export function getMessageGroup (messageState: Message.MessageState): string
{
        return messageState.version || 'Demo'; // This tides over first batch of players for whom version is undefined
}

export function createMessageData (
        threadMessages: Map.Map<Message.ThreadMessage>,
        name: string,
        threadStartName: string,
        playerEmail: string,
        domain: string,
        profiles: Map.Map<Profile.Profile>,
        strings: Map.Map<string>,
        vars: Player.PlayerVars): Message.MessageData
{
        const threadMessage = threadMessages[name];
        var message = threadMessage.message;
        const threadStart = threadMessages[threadStartName];
        const threadSubject = strings[threadStart.threadSubject];
        const subject = name === threadStartName ?
                threadSubject :
                'Re: ' + threadSubject;
        Log.assert(subject !== null, 'No thread subject: ', threadStartName);

        var fromProfile = profiles[message.from];
        var from = generateFriendlyEmail(fromProfile, domain);

        var to = message.to.map(function (profileName: string)
                {
                        var profile = profiles[profileName];
                        return generateFriendlyEmail(profile, domain);
                });

        const passages = message.body.map(text => strings[text]);
        const body = passages.join('\n\n');
        var customBody = (vars ? insertMessageVars(body, vars) : body);

        return {
                name: threadMessage.name,
                playerEmail: playerEmail,
                from: from,
                to: to,
                subject: subject,
                body: customBody,
        };
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
