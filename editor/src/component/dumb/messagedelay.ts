/// <reference path="number.ts" />
/// <reference path="../textinputvalidated.ts" />

module Component {
        interface MessageDelayInt {
                delay: Im.MessageDelay;
                onChange: (delay: Im.MessageDelay) => void;
                messages: Im.Messages;
        };
        export type MessageDelayData = Immutable.Record.IRecord<MessageDelayInt>;
        export const MessageDelayData = Immutable.Record<MessageDelayInt>({
                delay: Im.MessageDelay(),
                onChange: () => {},
                messages: Immutable.Map<string, Im.Message>(),
        }, 'MessageDelay');

        type MessageDelayProps = Flux.Props<MessageDelayData>;

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
                const name = Div({ className: 'message-delay-name' },
                        nameText);

                const onSetDelayLocal = (delayMins: number) =>
                        onSetDelay(data, delayMins);
                const delayMinsProps = NumberData({
                        placeholder: 0,
                        value: delay.delayMins,
                        onChange: onSetDelayLocal,
                });
                const delayMins =
                        Div({ className: 'message-delay-mins' },
                                Number(delayMinsProps));

                const messageDelay = wrapInLabel('Name/delay',
                        name, delayMins);

                return Div({ className: 'message-delay' },
                        messageDelay);
        }

        export const MessageDelay = Flux.createFactory(render, 'MessageDelay');

        function onSetName (data: MessageDelayData, name: string)
        {
                const newDelay = data.delay.set('name', name);
                data.onChange(newDelay);
        }

        function onSetDelay (
                data: MessageDelayData, delayMins: number)
        {
                const newDelay = data.delay.set('delayMins', delayMins);
                data.onChange(newDelay);
        }
}

