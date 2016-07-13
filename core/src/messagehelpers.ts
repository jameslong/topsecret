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
                fallbackSent: false,
        };
}

export function createMessageData (
        name: string,
        threadStartName: string,
        inReplyToId: string,
        quotedBody: string,
        to: string,
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
        const from = fromProfile.email;
        const signature = fromProfile.signature;

        const passage = strings[message.body];
        const body = (vars ? insertMessageVars(passage, vars) : passage);
        const bodyAndSig = `${body}\n\n${signature}`;
        const finalBody = quotedBody ?
                bodyAndSig + '\n\n' + Str.prependToLines('> ', quotedBody) :
                bodyAndSig;
        const attachment =
                groupData.attachments[threadMessage.attachment] || null;

        return {
                name,
                from,
                to,
                subject,
                body: finalBody,
                inReplyToId,
                attachment
        };
}

export function addDomain (local: string, domain: string): string
{
        return (local + '@' + domain);
}

export function removeFriendlyFromEmail (email: string)
{
        const index = email.indexOf('<');
        return (index !== -1) ? email.slice(index) : email;
}

export function getSelectedReply (
        options: Message.NamedThreadDelay[],
        reply: string): string
{
        const replyBodyLower = reply.toLowerCase();

        const selectedOption = Arr.valueOf(options, (option) => {
                        return Arr.every(option.matches, (match) =>
                                Str.containsWord(replyBodyLower, match))
                });

        return (selectedOption ? selectedOption.name : null);
}

export function getReplyDelay (
        replyIndex: number,
        delayIndex: number,
        message: Message.ThreadMessage,
        replyOptions: Map.Map<ReplyOption.ReplyOption[]>)
{
        const options = replyOptions[message.replyOptions];
        return options[replyIndex].messageDelays[delayIndex];
}

export function createMessageId (email: string, uid: number): string
{
        return '<' + uid.toString() + '.' + email + '>';
}

export function insertMessageVars (body: string, vars: Map.Map<Script.Atom>)
{
        const replacer = function (match: string, $1: string): string
                {
                        return (`${vars[$1]}` || match);
                };
        return body.replace(/\$(\w+)/gi, replacer);
}

export function hasReplyOptions (
        name: string, threadData: Map.Map<Message.ThreadMessage>): boolean
{
        const threadMessage = threadData[name];
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

export function createReplyThreadDelay (): Message.ReplyThreadDelay
{
        return {
                name: '',
                delay: [0, 0, 0],
        };
}
