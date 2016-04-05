import Immutable = require('immutable');
import Message = require('../../message');
import MessageDelay = require('../../messagedelay');
import Narrative = require('../../narrative');
import ReactUtils = require('../../redux/react');
import TextInputValidated = require('../textinputvalidated');

import Core = require('../core');
import Div = Core.Div;
import EditMessage = require('./editmessage');
import NumberComponent = require('./number');
import TextComponent = require('./text');

interface MessageDelayInt {
        delay: MessageDelay.MessageDelay;
        onChange: (delay: MessageDelay.MessageDelay) => void;
        messages: Message.Messages;
};
export type MessageDelayData = Immutable.Record.IRecord<MessageDelayInt>;
export const MessageDelayData = Immutable.Record<MessageDelayInt>({
        delay: MessageDelay.MessageDelay(),
        onChange: () => {},
        messages: Immutable.Map<string, Message.Message>(),
}, 'MessageDelay');

type MessageDelayProps = ReactUtils.Props<MessageDelayData>;

function render (props: MessageDelayProps)
{
        const data = props.data;
        const messages = data.messages;
        const messageDelay = data.delay;
        const delayName = messageDelay.name;

        const onSetNameLocal = (name: string) =>
                onSetName(data, name);
        const validName =
                messages.get(delayName) !== undefined;
        const textData = TextComponent.TextData({
                placeholder: 'message_name',
                value: delayName,
                onChange: onSetNameLocal,
                list: 'messageNames',
        });
        const nameText = TextInputValidated.createValidatedText({
                data: textData,
        }, validName);
        const name = Div({ className: 'message-delay-name' },
                nameText);

        const delayCondition = messageDelay.condition;
        const onSetConditionLocal = (condition: string) =>
                onSetCondition(data, condition);
        const conditionTextData = TextComponent.TextData({
                placeholder: 'condition',
                value: delayCondition,
                onChange: onSetConditionLocal,
        });
        const conditionText = TextComponent.Text(conditionTextData);
        const condition = Div({ className: 'message-delay-condition' },
                conditionText);

        const onSetDayLocal = (value: number) => onSetDay(data, value);
        const onSetHourLocal = (value: number) => onSetHour(data, value);
        const onSetMinLocal = (value: number) => onSetMin(data, value);
        const dayData = NumberComponent.NumberData({
                placeholder: 0,
                value: messageDelay.delay.get(0),
                onChange: onSetDayLocal,
        });
        const hourData = NumberComponent.NumberData({
                placeholder: 0,
                value: messageDelay.delay.get(1),
                onChange: onSetHourLocal,
        });
        const minData = NumberComponent.NumberData({
                placeholder: 0,
                value: messageDelay.delay.get(2),
                onChange: onSetMinLocal,
        });
        const day = Div({ className: 'message-delay-day' },
                NumberComponent.Number(dayData));
        const hour = Div({ className: 'message-delay-hour' },
                NumberComponent.Number(hourData));
        const min = Div({ className: 'message-delay-min' },
                NumberComponent.Number(minData));

        const child = EditMessage.wrapInLabel('Name/delay',
                name, condition, day, hour, min);

        return Div({ className: 'message-delay' }, child);
}

export const MessageDelayComponent = ReactUtils.createFactory(render, 'MessageDelay');

function onSetName (data: MessageDelayData, name: string)
{
        const newDelay = data.delay.set('name', name);
        data.onChange(newDelay);
}

function onSetCondition (data: MessageDelayData, condition: string)
{
        const newDelay = data.delay.set('condition', condition);
        data.onChange(newDelay);
}

function onSetDay (data: MessageDelayData, value: number)
{
        onSetTime(data, 0, value);
}

function onSetHour (data: MessageDelayData, value: number)
{
        onSetTime(data, 1, value);
}

function onSetMin (data: MessageDelayData, value: number)
{
        onSetTime(data, 2, value);
}

function onSetTime (data: MessageDelayData, index: number, value: number)
{
        const delay = data.delay.delay;
        const newDelay = delay.set(index, value);
        const newData = data.delay.set('delay', newDelay);
        data.onChange(newData);
}
