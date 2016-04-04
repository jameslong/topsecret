import Immutable = require('immutable');
import Message = require('../../message');
import MessageDelay = require('../../messagedelay');
import Narrative = require('../../narrative');
import ReactUtils = require('../../redux/react');
import ReplyOption = require('../../replyoption');
import TextInputValidated = require('../textinputvalidated');

import Core = require('../core');
import Div = Core.Div;
import EditMessage = require('./editmessage');
import MessageDelayComponent = require('./messagedelay');
import TextComponent = require('./text');
import TextList = require('./textlist');

interface ReplyOptionInt {
        onSet: (option: ReplyOption.ReplyOption) => void;
        replyOption: ReplyOption.ReplyOption;
        messages: Message.Messages;
};
export type ReplyOptionData = Immutable.Record.IRecord<ReplyOptionInt>;
export const ReplyOptionData = Immutable.Record<ReplyOptionInt>({
        onSet: () => {},
        replyOption: ReplyOption.ReplyOptionKeyword(),
        messages: Immutable.Map<string, Message.Message>(),
}, 'ReplyOption');

type ReplyOptionProps = ReactUtils.Props<ReplyOptionData>;

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

        const onSetDelay = (delay: MessageDelay.MessageDelay) =>
                setMessageDelay(onSet, option, delay);
        const delayProps = MessageDelayComponent.MessageDelayData({
                delay: option.messageDelay,
                onChange: onSetDelay,
                messages: data.messages,
        });
        const delay = MessageDelayComponent.MessageDelayComponent(delayProps);

        return Div({ className: 'reply-option' },
                type, parameters, delay);
}

export const ReplyOptionComponent = ReactUtils.createFactory(render, 'ReplyOption');

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
        newDelay: MessageDelay.MessageDelay)
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
