///<reference path='message.ts'/>
///<reference path='misc.ts'/>

module Im {
        export type ReplyOptionMutable =
                ReplyOptionKeywordMutable |
                ReplyOptionValidPGPKeyMutable |
                ReplyOptionDefaultMutable;

        export const ReplyOptionType = {
                Default: 'default',
                Keyword: 'keyword',
                ValidPGPKey: 'validPGPKey',
        }

        export function isReplyOptionType (type: string)
        {
                return (type === ReplyOptionType.Default ||
                        type === ReplyOptionType.Keyword ||
                        type === ReplyOptionType.ValidPGPKey);
        }

        export function getReplyOptionTypes ()
        {
                return Immutable.List.of<string>(
                        ReplyOptionType.Default,
                        ReplyOptionType.Keyword,
                        ReplyOptionType.ValidPGPKey);
        }

        interface ReplyOptionBaseMutable<T> {
                type: string;
                parameters: T;
                messageDelay: MessageDelayMutable;
        }

        interface KeywordParametersMutable {
                matches: string[];
        }
        interface ReplyOptionKeywordMutable extends ReplyOptionBaseMutable<KeywordParametersMutable> {}
        interface ReplyOptionValidPGPKeyMutable extends ReplyOptionBaseMutable<{}> {}
        interface ReplyOptionDefaultMutable extends ReplyOptionBaseMutable<{}> {}

        export type ReplyOptions = Immutable.List<ReplyOption>;

        export type ReplyOption =
                ReplyOptionKeyword |
                ReplyOptionValidPGPKey |
                ReplyOptionDefault;

        interface KeywordParametersInt {
                matches: Immutable.List<string>;
        };
        export type KeywordParameters = Immutable.Record.IRecord<KeywordParametersInt>;
        export const KeywordParameters = Immutable.Record<KeywordParametersInt>({
                matches: Immutable.List<string>(),
        }, 'KeywordParameters');

        interface ReplyOptionKeywordInt {
                type: string;
                parameters: KeywordParameters;
                messageDelay: MessageDelay;
        };
        export type ReplyOptionKeyword = Immutable.Record.IRecord<ReplyOptionKeywordInt>;
        export const ReplyOptionKeyword = Immutable.Record<ReplyOptionKeywordInt>({
                type: 'keyword',
                parameters: KeywordParameters(),
                messageDelay: MessageDelay(),
        }, 'ReplyOptionKeyword');

        interface ReplyOptionValidPGPKeyInt {
                type: string;
                parameters: ImObject;
                messageDelay: MessageDelay;
        };
        export type ReplyOptionValidPGPKey = Immutable.Record.IRecord<ReplyOptionValidPGPKeyInt>;
        export const ReplyOptionValidPGPKey = Immutable.Record<ReplyOptionValidPGPKeyInt>({
                type: 'validPGPKey',
                parameters: ImObject(),
                messageDelay: MessageDelay(),
        }, 'ReplyOptionValidPGPKey');

        interface ReplyOptionDefaultInt {
                type: string;
                parameters: ImObject;
                messageDelay: MessageDelay;
        };
        export type ReplyOptionDefault = Immutable.Record.IRecord<ReplyOptionDefaultInt>;
        export const ReplyOptionDefault = Immutable.Record<ReplyOptionDefaultInt>({
                type: 'default',
                parameters: ImObject(),
                messageDelay: MessageDelay(),
        }, 'ReplyOptionDefault');

        export function convertToImmutableReplyOptions (
                replyOptions: ReplyOptionMutable[])
                : Immutable.List<ReplyOption>
        {
                return listFromArray(
                        replyOptions, convertToImmutableReplyOption);
        }

        export function convertToImmutableReplyOption (
                replyOption: ReplyOptionMutable): ReplyOption
        {
                switch (replyOption.type) {
                case ReplyOptionType.Default:
                        const defaultOption = <ReplyOptionDefaultMutable>replyOption;
                        return convertToImmutableReplyOptionDefault(
                                defaultOption);
                case ReplyOptionType.Keyword:
                        const keywordOption = <ReplyOptionKeywordMutable>replyOption;
                        return convertToImmutableReplyOptionKeyword(
                                keywordOption);
                case ReplyOptionType.ValidPGPKey:
                        const keyOption = <ReplyOptionValidPGPKeyMutable>replyOption;
                        return convertToImmutableReplyOptionValidPGPKey(
                                keyOption);
                default:
                        console.log('Unrecognised reply option type' +
                                replyOption.type);
                        return null;
                }
        }

        function convertToImmutableReplyOptionDefault (
                replyOption: ReplyOptionDefaultMutable): ReplyOptionDefault
        {
                return ReplyOptionDefault({
                        type: 'default',
                        parameters: ImObject(),
                        messageDelay: convertToImmutableMessageDelay(
                                replyOption.messageDelay),
                });
        }

        function convertToImmutableReplyOptionKeyword (
                replyOption: ReplyOptionKeywordMutable): ReplyOptionKeyword
        {
                const matches = Immutable.List.of<string>(
                        ...replyOption.parameters.matches);

                return ReplyOptionKeyword({
                        type: 'keyword',
                        parameters: KeywordParameters({
                                matches: matches,
                        }),
                        messageDelay: convertToImmutableMessageDelay(
                                replyOption.messageDelay),
                });
        }

        function convertToImmutableReplyOptionValidPGPKey (
                replyOption: ReplyOptionValidPGPKeyMutable): ReplyOptionValidPGPKey
        {
                return ReplyOptionDefault({
                        type: 'validPGPKey',
                        parameters: ImObject(),
                        messageDelay: convertToImmutableMessageDelay(
                                replyOption.messageDelay),
                });
        }
}
