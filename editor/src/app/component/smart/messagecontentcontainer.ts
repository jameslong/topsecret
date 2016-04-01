/// <reference path="../dumb/messagecontent.ts" />

module Component {
        interface MessageContentContainerInt {
                message: Im.MessageContent;
                profiles: Im.Profiles;
                strings: Im.Strings;
                name: string;
        };
        export type MessageContentContainerData = Immutable.Record.IRecord<MessageContentContainerInt>;
        export const MessageContentContainerData = Immutable.Record<MessageContentContainerInt>({
                message: Im.MessageContent(),
                profiles: Immutable.Map<string, Im.Profile>(),
                strings: Immutable.Map<string, string>(),
                name: '',
        }, 'MessageContentContainer');

        type MessageContentContainerProps = Redux.Props<MessageContentContainerData>;

        function render (props: MessageContentContainerProps)
        {
                const data = props.data;
                const name = data.name;
                const onSet = (content: Im.MessageContent) =>
                        onSetMessageContent(name, content);
                const contentData = MessageContentData({
                        message: data.message,
                        profiles: data.profiles,
                        strings: data.strings,
                        name: data.name,
                        onSet: onSet,
                });
                return MessageContent(contentData);
        }

        export const MessageContentContainer = Redux.createFactory(
                render, 'MessageContentContainer');

        function onSetMessageContent (
                messageName: string, newContent: Im.MessageContent)
        {
                const action = ActionCreators.setMessageContent({
                        name: messageName,
                        value: newContent,
                });
                Redux.handleAction(action);
        }
}
