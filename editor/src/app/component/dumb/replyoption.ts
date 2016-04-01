/// <reference path="../dumb/textlist.ts" />

module ReplyOptionComponent {
        interface ReplyOptionInt {
                onSet: (option: ReplyOption.ReplyOption) => void;
                replyOption: ReplyOption.ReplyOption;
                messages: Narrative.Messages;
        };
        export type ReplyOptionData = Immutable.Record.IRecord<ReplyOptionInt>;
        export const ReplyOptionData = Immutable.Record<ReplyOptionInt>({
                onSet: () => {},
                replyOption: ReplyOption.ReplyOptionKeyword(),
                messages: Immutable.Map<string, Message.Message>(),
        }, 'ReplyOption');

        type ReplyOptionProps = Redux.Props<ReplyOptionData>;

        function render (props: ReplyOptionProps)
        {
                const data = props.data;
                const option = data.replyOption;
                const optionType = option.type;
                const onSet = data.onSet;

                const onSetType = (value: string) =>
                        setType(onSet, option, value);
                const validType = ReplyOption.isReplyOptionType(optionType);
                const typeData = TextComponent.TextData({
                        placeholder: 'type',
                        value: optionType,
                        onChange: onSetType,
                        list: 'replyOptionTypes',
                });
                const typeText  = TextInputValidated.createValidatedText({
                        data: typeData,
                }, validType);
                const type = EditMessage.wrapInLabel('Type', typeText);

                const parameters = renderParameters(onSet, option);

                const onSetDelay = (delay: Message.MessageDelay) =>
                        setMessageDelay(onSet, option, delay);
                const delayProps = MessageDelay.MessageDelayData({
                        delay: option.messageDelay,
                        onChange: onSetDelay,
                        messages: data.messages,
                });
                const delay = MessageDelay.MessageDelay(delayProps);

                return Core.Div({ className: 'reply-option' },
                        type, parameters, delay);
        }

        export const ReplyOptionComponent = Redux.createFactory(render, 'ReplyOption');

        function setType (
                onSet: (option: ReplyOption.ReplyOption) => void,
                option: ReplyOption.ReplyOption,
                newType: string)
        {
                const newOption = option.set('type', newType);
                onSet(newOption);
        }

        function setMessageDelay (
                onSet: (option: ReplyOption.ReplyOption) => void,
                option: ReplyOption.ReplyOption,
                newDelay: Message.MessageDelay)
        {
                const newOption = option.set('messageDelay', newDelay);
                onSet(newOption);
        }

        function renderParameters  (
                onSet: (option: ReplyOption.ReplyOption) => void,
                option: ReplyOption.ReplyOption)
        {
                if (option.type === ReplyOption.ReplyOptionType.Keyword) {
                        const keyword =
                                <ReplyOption.ReplyOptionKeyword><any>option;
                        return renderMatches(onSet, keyword);
                } else {
                        return null;
                }
        }

        function renderMatches (
                onSet: (option: ReplyOption.ReplyOption) => void,
                option: ReplyOption.ReplyOptionKeyword)
        {
                const values = option.parameters.matches;
                const onChange = (newMatches: Immutable.List<string>) =>
                        setMatches(onSet, option, newMatches);
                const valid = (values.every(match => !!match) &&
                        values.size > 0);
                const data = TextList.TextListData({
                        placeholder: 'match0, match1, match2',
                        values: values,
                        onChange: onChange,
                });
                const matches = TextInputValidated.createValidatedTextList(
                        { data: data}, valid);
                return EditMessage.wrapInLabel('Matches', matches);
        }

        function setMatches (
                onSet: (option: ReplyOption.ReplyOption) => void,
                option: ReplyOption.ReplyOptionKeyword,
                newMatches: Immutable.List<string>)
        {
                const parameters = option.parameters;
                const newParameters = parameters.set('matches', newMatches);
                const newOption = option.set('parameters', newParameters);
                onSet(newOption);
        }
}
