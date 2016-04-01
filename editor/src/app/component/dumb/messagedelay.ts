/// <reference path="number.ts" />
/// <reference path="../textinputvalidated.ts" />

module Component {
        interface MessageDelayInt {
                delay: Message.MessageDelay;
                onChange: (delay: Message.MessageDelay) => void;
                messages: Narrative.Messages;
        };
        export type MessageDelayData = Immutable.Record.IRecord<MessageDelayInt>;
        export const MessageDelayData = Immutable.Record<MessageDelayInt>({
                delay: Message.MessageDelay(),
                onChange: () => {},
                messages: Immutable.Map<string, Message.Message>(),
        }, 'MessageDelay');

        type MessageDelayProps = Redux.Props<MessageDelayData>;

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
                const textData = TextData({
                        placeholder: 'message_name',
                        value: delayName,
                        onChange: onSetNameLocal,
                        list: 'messageNames',
                });
                const nameText = createValidatedText({
                        data: textData,
                }, validName);
                const name = Core.Div({ className: 'message-delay-name' },
                        nameText);

                const delayCondition = delay.condition;
                const onSetConditionLocal = (condition: string) =>
                        onSetCondition(data, condition);
                const conditionTextData = TextData({
                        placeholder: 'condition',
                        value: delayCondition,
                        onChange: onSetConditionLocal,
                });
                const conditionText = Text(conditionTextData);
                const condition = Core.Div({ className: 'message-delay-condition' },
                        conditionText);

                const onSetDelayLocal = (delayMins: number) =>
                        onSetDelay(data, delayMins);
                const delayMinsProps = NumberData({
                        placeholder: 0,
                        value: delay.delayMins,
                        onChange: onSetDelayLocal,
                });
                const delayMins = Core.Div({ className: 'message-delay-mins' },
                        Number(delayMinsProps));

                const messageDelay = wrapInLabel('Name/delay',
                        name, condition, delayMins);

                return Core.Div({ className: 'message-delay' },
                        messageDelay);
        }

        export const MessageDelay = Redux.createFactory(render, 'MessageDelay');

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
}
