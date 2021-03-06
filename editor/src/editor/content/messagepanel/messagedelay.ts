import Arr = require('../../../../../core/src/utils/array');
import Helpers = require('../../../../../core/src/utils/helpers');
import Map = require('../../../../../core/src/utils/map');
import EditorMessage = require('../../../editormessage');
import Message = require('../../../../../core/src/message');
import Narrative = require('../../../narrative');
import React = require('react');
import TextInputValidated = require('../../common/textinputvalidated');

import ComponentHelpers = require('../../common/helpers');
import Core = require('../../common/core');
import Div = Core.Div;
import Checkbox = require('../../common/checkbox');
import NumberComponent = require('../../common/number');
import TextComponent = require('../../common/text');

interface MessageDelayProps extends React.Props<any> {
        delay: Message.ThreadDelay;
        onChange: (delay: Message.ThreadDelay) => void;
        messages: EditorMessage.EditorMessages;
};

function renderMessageDelay (props: MessageDelayProps)
{
        const messages = props.messages;
        const messageDelay = props.delay;
        const delayName = messageDelay.name;

        const onSetNameLocal = (name: string) => onSetName(props, name);
        const validName = Map.exists(messages, delayName);
        const textProps = {
                placeholder: 'message_name',
                value: delayName,
                onChange: onSetNameLocal,
                list: 'messageNames',
        };
        const nameText = TextInputValidated.createValidatedText(
                textProps, validName);
        const name = Div({ className: 'message-delay-name' },
                nameText);

        const delayCondition = messageDelay.condition;
        const onSetConditionLocal = (condition: string) =>
                onSetCondition(props, condition);
        const conditionProps = {
                placeholder: 'condition',
                value: delayCondition,
                onChange: onSetConditionLocal,
        };
        const conditionText = TextComponent(conditionProps);
        const condition = Div({ className: 'message-delay-condition' },
                conditionText);

        const onSetDayLocal = (value: number) => onSetDay(props, value);
        const onSetHourLocal = (value: number) => onSetHour(props, value);
        const onSetMinLocal = (value: number) => onSetMin(props, value);
        const dayProps = {
                placeholder: 0,
                value: messageDelay.delay[0],
                onChange: onSetDayLocal,
        };
        const hourProps = {
                placeholder: 0,
                value: messageDelay.delay[1],
                onChange: onSetHourLocal,
        };
        const minProps = {
                placeholder: 0,
                value: messageDelay.delay[2],
                onChange: onSetMinLocal,
        };
        const day = Div({ className: 'message-delay-day' },
                NumberComponent(dayProps));
        const hour = Div({ className: 'message-delay-hour' },
                NumberComponent(hourProps));
        const min = Div({ className: 'message-delay-min' },
                NumberComponent(minProps));

        const onSetAbsoluteLocal = (value: boolean) =>
                onSetAbsolute(props, value);
        const absoluteProps = {
                checked: messageDelay.absolute,
                onChange: onSetAbsoluteLocal,
        };
        const absolute = Checkbox(absoluteProps);

        const child = ComponentHelpers.wrapInLabel('Name/delay',
                name, condition, day, hour, min, absolute);

        return Div({ className: 'message-delay' }, child);
}

const MessageDelayComponent = React.createFactory(renderMessageDelay);

function onSetName (data: MessageDelayProps, name: string)
{
        const newDelay = Helpers.assign(data.delay, { name });
        data.onChange(newDelay);
}

function onSetCondition (data: MessageDelayProps, condition: string)
{
        const newDelay = Helpers.assign(data.delay, { condition });
        data.onChange(newDelay);
}

function onSetDay (data: MessageDelayProps, value: number)
{
        onSetTime(data, 0, value);
}

function onSetHour (data: MessageDelayProps, value: number)
{
        onSetTime(data, 1, value);
}

function onSetMin (data: MessageDelayProps, value: number)
{
        onSetTime(data, 2, value);
}

function onSetTime (data: MessageDelayProps, index: number, value: number)
{
        const delay = data.delay.delay;
        const newDelay = Arr.set(delay, index, value);
        const newData = Helpers.assign(data.delay, { delay: newDelay });
        data.onChange(newData);
}

function onSetAbsolute (data: MessageDelayProps, absolute: boolean)
{
        const newData = Helpers.assign(data.delay, { absolute });
        data.onChange(newData);
}

export = MessageDelayComponent;
