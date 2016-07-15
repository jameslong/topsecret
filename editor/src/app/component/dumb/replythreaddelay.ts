import Arr = require('../../../../../core/src/utils/array');
import Helpers = require('../../../../../core/src/utils/helpers');
import Map = require('../../../../../core/src/utils/map');
import Message = require('../../../../../core/src/message');
import EditorMessage = require('../../editormessage');
import Narrative = require('../../narrative');
import React = require('react');
import TextInputValidated = require('../textinputvalidated');

import ComponentHelpers = require('../helpers');
import Core = require('../core');
import Div = Core.Div;
import EditMessage = require('./editmessage');
import NumberComponent = require('./number');
import TextComponent = require('./text');

interface ReplyThreadDelayProps extends React.Props<any> {
        delay: Message.ReplyThreadDelay;
        onChange: (delay: Message.ReplyThreadDelay) => void;
        messages: EditorMessage.EditorMessages;
};

function renderReplyThreadDelay (props: ReplyThreadDelayProps)
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
        const name = Div({ className: 'reply-delay-name' },
                nameText);

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
        const day = Div({ className: 'reply-delay-day' },
                NumberComponent(dayProps));
        const hour = Div({ className: 'reply-delay-hour' },
                NumberComponent(hourProps));
        const min = Div({ className: 'reply-delay-min' },
                NumberComponent(minProps));

        return Div({ className: 'reply-delay' }, name, day, hour, min);
}

const ReplyThreadDelay = React.createFactory(renderReplyThreadDelay);

function onSetName (data: ReplyThreadDelayProps, name: string)
{
        const newDelay = Helpers.assign(data.delay, { name });
        data.onChange(newDelay);
}

function onSetDay (data: ReplyThreadDelayProps, value: number)
{
        onSetTime(data, 0, value);
}

function onSetHour (data: ReplyThreadDelayProps, value: number)
{
        onSetTime(data, 1, value);
}

function onSetMin (data: ReplyThreadDelayProps, value: number)
{
        onSetTime(data, 2, value);
}

function onSetTime (data: ReplyThreadDelayProps, index: number, value: number)
{
        const delay = data.delay.delay;
        const newDelay = Arr.set(delay, index, value);
        const newData = Helpers.assign(data.delay, { delay: newDelay });
        data.onChange(newData);
}

export = ReplyThreadDelay;
