import Arr = require('./utils/array');
import Log = require('./log');
import Map = require('./utils/map');
import Player = require('./player');
import ReplyOption = require('./replyoption');
import Script = require('./script');
import State = require('./gamestate');
import Str = require('./utils/string');

export interface ReplyState {
        index: number;
        sent: number[];
        timestampMs: number;
        body: string;
}

export interface MessageState {
        email: string;
        id: string;
        name: string;
        reply: ReplyState;
        sentTimestampMs: number;
        childrenSent: boolean[];
        fallbackSent: boolean;
        threadStartName: string;
}

export const ThreadMessageTypes = {
        DEFAULT: 'default',
        EMPTY: 'empty',
};

export interface MessageReceiver {
        message: Message;
        receiver: string;
}

export interface Coord {
        x: number;
        y: number;
}

export interface ThreadMessage {
        name: string;
        threadSubject: string;
        position: Coord;
        endGame: boolean;
        message: Message;
        encrypted: boolean;
        script: string;
        receiver?: string; // For unsolicited player-to-character emails (where message is null)
        replyOptions: string;
        children: ThreadDelay[];
        fallback: ThreadDelay;
        attachment: string;
}

export interface ReplyThreadDelay {
        name: string;
        delay: [number, number, number]; // days, hours, minutes
}

export interface ThreadDelay {
        name: string;
        delay: [number, number, number]; // days, hours, minutes
        condition: string;
}

export interface NamedThreadDelay {
        name: string;
        matches: string[];
        threadDelay: ThreadDelay;
}

export interface Message {
        from: string;
        body: string;
}

export interface MessageData {
        name: string;
        from: string;
        to: string;
        subject: string;
        body: string;
        inReplyToId: string;
        attachment: string;
}

export interface Reply {
        id: string;
        from: string;
        to: string;
        subject: string;
        body: string;
        inReplyToId: string;
        attachment: string;
}

export interface MailgunReply extends Reply {
        strippedBody: string; // Same as body but with quoted text removed
}

export function createMessageState (
        email: string,
        id: string,
        name: string,
        sentTimestampMs: number,
        threadStartName: string,
        numberOfChildren: number)
        : MessageState
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
        groupData: State.NarrativeState,
        vars: Player.PlayerVars): MessageData
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
        options: NamedThreadDelay[],
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
        message: ThreadMessage,
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
        name: string, threadData: Map.Map<ThreadMessage>): boolean
{
        const threadMessage = threadData[name];
        return (threadMessage.replyOptions !== null);
}

export function stripBody (body: string)
{
        return Str.filterByLines(body, line => !Str.beginsWith(line, '> '));
}

export function createThreadDelay (): ThreadDelay
{
        return {
                name: '',
                condition: '',
                delay: [0, 0, 0],
        };
}

export function createReplyThreadDelay (): ReplyThreadDelay
{
        return {
                name: '',
                delay: [0, 0, 0],
        };
}
