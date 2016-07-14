import Arr = require('../../../../../core/src/utils/array');
import Helpers = require('../../../../../core/src/utils/helpers');
import EditorMessage = require('../../editormessage');
import Message = require('../../../../../core/src/message');
import Narrative = require('../../narrative');
import React = require('react');
import ReplyOption = require('../../../../../core/src/replyoption');
import TextInputValidated = require('../textinputvalidated');

import ComponentHelpers = require('../helpers');
import Core = require('../core');
import Div = Core.Div;
import EditMessage = require('./editmessage');
import ReplyThreadDelay = require('./replythreaddelay');
import Multiple = require('./multiple');
import TextComponent = require('./text');
import TextList = require('./textlist');

interface ReplyOptionProps extends React.Props<any> {
        onSet: (option: ReplyOption.ReplyOption) => void;
        replyOption: ReplyOption.ReplyOption;
        messages: EditorMessage.EditorMessages;
};

function renderReplyOption (props: ReplyOptionProps)
{
        const option = props.replyOption;
        const optionType = option.type;
        const onSet = props.onSet;

        const onSetType = (value: string) =>
                setType(onSet, option, value);
        const validType = ReplyOption.isReplyOptionType(optionType);
        const typeProps = {
                placeholder: 'type',
                value: optionType,
                onChange: onSetType,
                list: 'replyOptionTypes',
        };
        const typeText  = TextInputValidated.createValidatedText(
                typeProps, validType);
        const type = ComponentHelpers.wrapInLabel('Type', typeText);

        const parameters = renderParameters(onSet, option);

        const delays = renderDelays(onSet, option, props.messages);

        return Div({ className: 'reply-option' }, type, parameters, delays);
}

const ReplyOptionComponent = React.createFactory(renderReplyOption);

function setType (
        onSet: (option: ReplyOption.ReplyOption) => void,
        option: ReplyOption.ReplyOption,
        type: string)
{
        const newOption = Helpers.assign(option, { type });
        onSet(newOption);
}

function setCondition (
        onSet: (option: ReplyOption.ReplyOption) => void,
        option: ReplyOption.ReplyOptionKeyword,
        condition: string)
{
        const parameters = Helpers.assign(option.parameters, { condition });
        const newOption = Helpers.assign(option, { parameters });
        onSet(newOption);
}

function renderParameters  (
        onSet: (option: ReplyOption.ReplyOption) => void,
        option: ReplyOption.ReplyOption)
{
        if (option.type === ReplyOption.ReplyOptionType.Keyword) {
                const keyword = <ReplyOption.ReplyOptionKeyword><any>option;
                const condition = renderCondition(onSet, keyword);
                const matches = renderMatches(onSet, keyword);
                return Div({}, condition, matches);
        } else {
                return null;
        }
}

function renderCondition (
        onSet: (option: ReplyOption.ReplyOption) => void,
        option: ReplyOption.ReplyOptionKeyword)
{
        const onSetCondition = (value: string) =>
                setCondition(onSet, option, value);
        const props = {
                placeholder: '',
                value: option.parameters.condition,
                onChange: onSetCondition,
        };
        const condition = TextComponent(props);
        return ComponentHelpers.wrapInLabel('Condition', condition);
}

function renderMatches (
        onSet: (option: ReplyOption.ReplyOption) => void,
        option: ReplyOption.ReplyOptionKeyword)
{
        const values = option.parameters.matches;
        const onChange = (newMatches: string[]) =>
                setMatches(onSet, option, newMatches);
        const valid = (values.every(match => !!match) &&
                values.length > 0);
        const props = {
                placeholder: 'match0, match1, match2',
                values: values,
                onChange: onChange,
        };
        const matches = TextInputValidated.createValidatedTextList(props, valid);
        return ComponentHelpers.wrapInLabel('Matches', matches);
}

function setMatches (
        onSet: (option: ReplyOption.ReplyOption) => void,
        option: ReplyOption.ReplyOptionKeyword,
        matches: string[])
{
        const parameters = Helpers.assign(option.parameters, { matches });
        const newOption = Helpers.assign(option, { parameters });
        onSet(newOption);
}

function setDelays (
        onSet: (option: ReplyOption.ReplyOption) => void,
        option: ReplyOption.ReplyOption,
        messageDelays: Message.ReplyThreadDelay[])
{
        const newOption = Helpers.assign(option, { messageDelays });
        onSet(newOption);
}

function onSetDelay (
        onSet: (option: ReplyOption.ReplyOption) => void,
        option: ReplyOption.ReplyOption,
        index: number,
        delay: Message.ReplyThreadDelay)
{
        const delays = Arr.set(option.messageDelays, index, delay);
        setDelays(onSet, option, delays);
}

function onAddDelay (
        onSet: (option: ReplyOption.ReplyOption) => void,
        option: ReplyOption.ReplyOption)
{
        const delay = Message.createReplyThreadDelay();
        const delays = Arr.push(option.messageDelays, delay);
        setDelays(onSet, option, delays);
}

function onRemoveDelay (
        onSet: (option: ReplyOption.ReplyOption) => void,
        option: ReplyOption.ReplyOption,
        index: number)
{
        const delays = Arr.deleteIndex(option.messageDelays, index);
        setDelays(onSet, option, delays);
}

function renderDelays (
        onSet: (option: ReplyOption.ReplyOption) => void,
        option: ReplyOption.ReplyOption,
        messages: EditorMessage.EditorMessages)
{
        const delays = option.messageDelays;
        const children = delays.map((delay, index) => {
                const onSetDelayLocal = (delay: Message.ReplyThreadDelay) =>
                        onSetDelay(onSet, option, index, delay);
                const props = {
                        delay,
                        onChange: onSetDelayLocal,
                        messages: messages,
                };
                return ReplyThreadDelay(props);
        });
        const onAdd = () => onAddDelay(onSet, option);
        const onRemove = (index: number) => onRemoveDelay(onSet, option, index);
        const multipleProps = {
                children: children,
                onAdd: onAdd,
                onRemove: onRemove,
        };
        const multiple = Multiple(multipleProps);
        return ComponentHelpers.wrapInLabel('Delays', multiple);
}

export = ReplyOptionComponent;
