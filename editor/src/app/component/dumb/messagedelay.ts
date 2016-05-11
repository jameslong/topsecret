import Arr = require('../../../../../core/src/app/utils/array');
import Helpers = require('../../../../../core/src/app/utils/helpers');
import Map = require('../../../../../core/src/app/utils/map');
import EditorMessage = require('../../editormessage');
import MessageDelay = require('../../messagedelay');
import Narrative = require('../../narrative');
import React = require('react');
import TextInputValidated = require('../textinputvalidated');

import ComponentHelpers = require('../helpers');
import Core = require('../core');
import Div = Core.Div;
import EditMessage = require('./editmessage');
import NumberComponent = require('./number');
import TextComponent = require('./text');

interface MessageDelayProps extends React.Props<any> {
        delay: MessageDelay.MessageDelay;
        onChange: (delay: MessageDelay.MessageDelay) => void;
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

        const child = ComponentHelpers.wrapInLabel('Name/delay',
                name, condition, day, hour, min);

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

export = MessageDelayComponent;
