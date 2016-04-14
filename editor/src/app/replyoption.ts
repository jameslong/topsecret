import MessageDelay = require('./messagedelay');

interface ReplyOptionBase<T> {
        type: string;
        parameters: T;
        messageDelay: MessageDelay.MessageDelay;
}

interface KeywordParameters {
        matches: string[];
};
export type ReplyOptionKeyword = ReplyOptionBase<KeywordParameters>;
export type ReplyOptionValidPGPKey = ReplyOptionBase<void>;
export type ReplyOptionDefault = ReplyOptionBase<void>;

export type ReplyOption =
        ReplyOptionKeyword |
        ReplyOptionValidPGPKey |
        ReplyOptionDefault;

export type ReplyOptions = ReplyOption[];
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
        return [ReplyOptionType.Default,
                ReplyOptionType.Keyword,
                ReplyOptionType.ValidPGPKey];
}
