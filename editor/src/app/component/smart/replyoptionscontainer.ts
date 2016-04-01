/// <reference path="../dumb/replyoptions.ts" />

module Component {
        interface ReplyOptionsContainerInt {
                name: string;
                replyOptions: ReplyOption.ReplyOptions;
                messages: Narrative.Messages;
        };
        export type ReplyOptionsContainerData = Immutable.Record.IRecord<ReplyOptionsContainerInt>;
        export const ReplyOptionsContainerData = Immutable.Record<ReplyOptionsContainerInt>({
                name: '',
                replyOptions: Immutable.List<ReplyOption.ReplyOption>(),
                messages: Immutable.Map<string, Message.Message>(),
        }, 'ReplyOptionsContainer');

        type ReplyOptionsContainerProps = Redux.Props<ReplyOptionsContainerData>;

        function render (props: ReplyOptionsContainerProps)
        {
                const data = props.data;
                const name = data.name;

                const replyOptionsData = ReplyOptionsData({
                        name: name,
                        replyOptions: data.replyOptions,
                        messages: data.messages,
                        onSet: (options: ReplyOption.ReplyOptions) =>
                                setReplyOptions(name, options),
                });
                return ReplyOptions(replyOptionsData);
        }

        export const ReplyOptionsContainer =
                Redux.createFactory(render, 'ReplyOptionsContainer');

        function setReplyOptions (name: string, replyOptions: ReplyOption.ReplyOptions)
        {
                const action = ActionCreators.setMessageReplyOptions({
                        name: name,
                        value: replyOptions,
                });
                Redux.handleAction(action);
        }
}
