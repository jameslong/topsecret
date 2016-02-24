///<reference path='math.ts'/>

module Im {
        interface MessageContentMutable {
                from: string;
                to: string[];
                body: string[];
        }

        interface MessageContentInt {
                from: string;
                to: Immutable.List<string>;
                body: Immutable.List<string>;
        };
        export type MessageContent = Immutable.Record.IRecord<MessageContentInt>;
        export const MessageContent = Immutable.Record<MessageContentInt>({
                from: '',
                to: Immutable.List<string>(),
                body: Immutable.List<string>(),
        }, 'MessageContent');

        export interface MessageDelayMutable {
                name: string;
                delayMins: number;
        }

        interface MessageDelayInt {
                name: string;
                delayMins: number;
        };
        export type MessageDelay = Immutable.Record.IRecord<MessageDelayInt>;
        export const MessageDelay = Immutable.Record<MessageDelayInt>({
                name: '',
                delayMins: 0,
        }, 'MessageDelay');

        export type MessageDelays = Immutable.List<MessageDelay>;

        export interface MessageMutable {
                name: string;
                threadSubject: string;
                position: Coord;
                endGame: boolean;
                message: MessageContentMutable;
                encrypted: boolean;
                receiver: string;
                replyOptions: ReplyOptionMutable[];
                children: MessageDelayMutable[];
                fallback: MessageDelayMutable;
        }

        interface MessageInt {
                name: string;
                threadSubject: string;
                position: Coord;
                endGame: boolean;
                message: MessageContent;
                encrypted: boolean;
                receiver: string;
                replyOptions: ReplyOptions;
                children: MessageDelays;
                fallback: MessageDelay;
                selected: boolean;
                valid: boolean;
        };
        export type Message = Immutable.Record.IRecord<MessageInt>;
        export const Message = Immutable.Record<MessageInt>({
                name: '',
                threadSubject: '',
                position: Coord(),
                endGame: false,
                message: MessageContent(),
                encrypted: true,
                receiver: null,
                replyOptions: Immutable.List<ReplyOption>(),
                children: Immutable.List<MessageDelay>(),
                fallback: null,
                selected: false,
                valid: false,
        }, 'Message');

        function convertToImmutableMessageContent (
                messageContentMutable: MessageContentMutable)
        {
                return MessageContent({
                        from: messageContentMutable.from,
                        to: Immutable.List.of<string>(...messageContentMutable.to),
                        body: Immutable.List.of<string>(...messageContentMutable.body),
                });
        }

        export function convertToImmutableMessageDelay (
                messageDelayMutable: MessageDelayMutable)
        {
                return MessageDelay({
                        name: messageDelayMutable.name,
                        delayMins: messageDelayMutable.delayMins,
                });
        }

        function convertToImmutableCoord (coordMutable: Coord)
        {
                return Coord({
                        x: coordMutable.x,
                        y: coordMutable.y,
                });
        }

        export function convertToImmutableMessage (messageMutable: MessageMutable)
        {
                const messageContentMutable = messageMutable.message;
                const messageContent = messageContentMutable ?
                        convertToImmutableMessageContent(messageContentMutable)
                        : null;

                const fallbackMutable = messageMutable.fallback;
                const fallback = fallbackMutable ?
                        convertToImmutableMessageDelay(fallbackMutable) : null;

                const children = listFromArray(
                        messageMutable.children,
                        convertToImmutableMessageDelay);

                const positionMutable = messageMutable.position;
                const position = positionMutable ?
                        convertToImmutableCoord(positionMutable) :
                        Coord();

                const replyOptionsMutable = messageMutable.replyOptions;
                const replyOptions = convertToImmutableReplyOptions(
                        replyOptionsMutable);

                return Message({
                        name: messageMutable.name,
                        threadSubject: messageMutable.threadSubject,
                        endGame: messageMutable.endGame,
                        encrypted: messageMutable.encrypted,
                        receiver: messageMutable.receiver,
                        replyOptions: replyOptions,
                        position: position,
                        message: messageContent,
                        children: children,
                        fallback: fallback,
                        selected: false,
                        valid: false,
                });
        }

        export function convertToMutableMessage(
                message: Message): MessageMutable
        {
                let messageMutable = message.toJS();
                delete messageMutable.selected;
                delete messageMutable.valid;
                return messageMutable;
        }

        export function getSelectedMessages (messages: Im.Messages)
        {
                return <Im.Messages>messages.filter(
                        message => message.selected);
        }

        export function markMessagesValid (
                messages: Messages,
                strings: Strings,
                profiles: Profiles)
        {
                return <Messages>messages.map(message =>
                        markMessageValid(
                                message,
                                messages,
                                strings,
                                profiles));
        }

        export function markMessageValid (
                message: Message,
                messages: Messages,
                strings: Strings,
                profiles: Profiles)
        {
                const valid = isValidMessage(
                        message, messages, strings, profiles);
                return message.set('valid', valid);
        }

        export function isValidMessage (
                message: Message,
                messages: Messages,
                strings: Strings,
                profiles: Profiles)
        {
                return validSubject(message, strings) &&
                        validContent(message, strings, profiles) &&
                        validFallback(message, messages) &&
                        validReplyOptions(message, messages) &&
                        validChildren(message, messages);
        }

        function validSubject (message: Message, strings: Im.Strings)
        {
                const subject = message.threadSubject;
                return !subject || strings.get(subject);
        }

        function validContent (
                message: Message,
                strings: Strings,
                profiles: Profiles)
        {
                const content = message.message;
                const validFrom = profiles.has(content.from);
                const validTo = content.to.every(name => profiles.has(name));
                const validBody = content.body.every(name =>
                        strings.get(name) !== undefined);

                return validFrom && validTo && validBody;
        }

        function validMessageDelay (delay: MessageDelay, messages: Messages)
        {
                return messages.has(delay.name);
        }

        function validFallback (message: Message, messages: Messages)
        {
                return !message.fallback ||
                        validMessageDelay(message.fallback, messages);
        }

        function validReplyOptions (message: Message, messages: Messages)
        {
                return message.replyOptions.every(option =>
                        validMessageDelay(option.messageDelay, messages));
        }

        function validChildren (message: Message, messages: Messages)
        {
                return message.children.every(child =>
                        validMessageDelay(child, messages));
        }

        export function createUniqueMessageName(messages: Messages)
        {
                let stem = 'untitled';
                let name = '';
                let i = -1;

                while (true) {
                        i += 1;
                        name = `${stem}_${i}`;
                        if (!messages.has(name))
                        {
                                return name;
                        }
                }
        }
}
