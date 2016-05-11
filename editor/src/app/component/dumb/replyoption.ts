import Helpers = require('../../../../../core/src/app/utils/helpers');
import EditorMessage = require('../../editormessage');
import MessageDelay = require('../../messagedelay');
import Narrative = require('../../narrative');
import React = require('react');
import ReplyOption = require('../../../../../core/src/app/replyoption');
import TextInputValidated = require('../textinputvalidated');

import ComponentHelpers = require('../helpers');
import Core = require('../core');
import Div = Core.Div;
import EditMessage = require('./editmessage');
import MessageDelayComponent = require('./messagedelay');
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

        const onSetDelay = (delay: MessageDelay.MessageDelay) =>
                setMessageDelay(onSet, option, delay);
        const delayProps = {
                delay: option.messageDelay,
                onChange: onSetDelay,
                messages: props.messages,
        };
        const delay = MessageDelayComponent(delayProps);

        return Div({ className: 'reply-option' },
                type, parameters, delay);
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

function setMessageDelay (
        onSet: (option: ReplyOption.ReplyOption) => void,
        option: ReplyOption.ReplyOption,
        messageDelay: MessageDelay.MessageDelay)
{
        const newOption = Helpers.assign(option, { messageDelay });
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

export = ReplyOptionComponent;
