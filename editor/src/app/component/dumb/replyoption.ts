/// <reference path="../dumb/textlist.ts" />

module Component {
        interface ReplyOptionInt {
                onSet: (option: Im.ReplyOption) => void;
                replyOption: Im.ReplyOption;
                messages: Im.Messages;
        };
        export type ReplyOptionData = Immutable.Record.IRecord<ReplyOptionInt>;
        export const ReplyOptionData = Immutable.Record<ReplyOptionInt>({
                onSet: () => {},
                replyOption: Im.ReplyOptionKeyword(),
                messages: Immutable.Map<string, Im.Message>(),
        }, 'ReplyOption');

        type ReplyOptionProps = Flux.Props<ReplyOptionData>;

        function render (props: ReplyOptionProps)
        {
                const data = props.data;
                const option = data.replyOption;
                const optionType = option.type;
                const onSet = data.onSet;

                const onSetType = (value: string) =>
                        setType(onSet, option, value);
                const validType = Im.isReplyOptionType(optionType);
                const typeData = TextData({
                        placeholder: 'type',
                        value: optionType,
                        onChange: onSetType,
                        list: 'replyOptionTypes',
                });
                const typeText  = createValidatedText({
                        data: typeData,
                }, validType);
                const type = wrapInLabel('Type', typeText);

                const parameters = renderParameters(onSet, option);

                const onSetDelay = (delay: Im.MessageDelay) =>
                        setMessageDelay(onSet, option, delay);
                const delayProps = MessageDelayData({
                        delay: option.messageDelay,
                        onChange: onSetDelay,
                        messages: data.messages,
                });
                const delay = MessageDelay(delayProps);

                return Div({ className: 'reply-option' },
                        type, parameters, delay);
        }

        export const ReplyOption = Flux.createFactory(render, 'ReplyOption');

        function setType (
                onSet: (option: Im.ReplyOption) => void,
                option: Im.ReplyOption,
                newType: string)
        {
                const newOption = option.set('type', newType);
                onSet(newOption);
        }

        function setMessageDelay (
                onSet: (option: Im.ReplyOption) => void,
                option: Im.ReplyOption,
                newDelay: Im.MessageDelay)
        {
                const newOption = option.set('messageDelay', newDelay);
                onSet(newOption);
        }

        function renderParameters  (
                onSet: (option: Im.ReplyOption) => void,
                option: Im.ReplyOption)
        {
                if (option.type === Im.ReplyOptionType.Keyword) {
                        const keyword =
                                <Im.ReplyOptionKeyword><any>option;
                        return renderMatches(onSet, keyword);
                } else {
                        return null;
                }
        }

        function renderMatches (
                onSet: (option: Im.ReplyOption) => void,
                option: Im.ReplyOptionKeyword)
        {
                const values = option.parameters.matches;
                const onChange = (newMatches: Immutable.List<string>) =>
                        setMatches(onSet, option, newMatches);
                const valid = (values.every(match => !!match) &&
                        values.size > 0);
                const data = TextListData({
                        placeholder: 'match0, match1, match2',
                        values: values,
                        onChange: onChange,
                });
                const matches = createValidatedTextList(
                        { data: data}, valid);
                return wrapInLabel('Matches', matches);
        }

        function setMatches (
                onSet: (option: Im.ReplyOption) => void,
                option: Im.ReplyOptionKeyword,
                newMatches: Immutable.List<string>)
        {
                const parameters = option.parameters;
                const newParameters = parameters.set('matches', newMatches);
                const newOption = option.set('parameters', newParameters);
                onSet(newOption);
        }

}
