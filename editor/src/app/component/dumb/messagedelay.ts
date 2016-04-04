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
        const delay = data.delay;
        const delayName = delay.name;

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

        const delayCondition = delay.condition;
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

        const onSetDelayLocal = (delayMins: number) =>
                onSetDelay(data, delayMins);
        const delayMinsProps = NumberComponent.NumberData({
                placeholder: 0,
                value: delay.delayMins,
                onChange: onSetDelayLocal,
        });
        const delayMins = Div({ className: 'message-delay-mins' },
                NumberComponent.Number(delayMinsProps));

        const messageDelay = EditMessage.wrapInLabel('Name/delay',
                name, condition, delayMins);

        return Div({ className: 'message-delay' },
                messageDelay);
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

function onSetDelay (
        data: MessageDelayData, delayMins: number)
{
        const newDelay = data.delay.set('delayMins', delayMins);
        data.onChange(newDelay);
}
