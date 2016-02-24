/// <reference path="../dumb/replyoptions.ts" />

module Component {
        interface ReplyOptionsContainerInt {
                name: string;
                replyOptions: Im.ReplyOptions;
                messages: Im.Messages;
        };
        export type ReplyOptionsContainerData = Immutable.Record.IRecord<ReplyOptionsContainerInt>;
        export const ReplyOptionsContainerData = Immutable.Record<ReplyOptionsContainerInt>({
                name: '',
                replyOptions: Immutable.List<Im.ReplyOption>(),
                messages: Immutable.Map<string, Im.Message>(),
        }, 'ReplyOptionsContainer');

        type ReplyOptionsContainerProps = Flux.Props<ReplyOptionsContainerData>;

        function render (props: ReplyOptionsContainerProps)
        {
                const data = props.data;
                const name = data.name;

                const replyOptionsData = ReplyOptionsData({
                        name: name,
                        replyOptions: data.replyOptions,
                        messages: data.messages,
                        onSet: (options: Im.ReplyOptions) =>
                                setReplyOptions(name, options),
                });
                return ReplyOptions(replyOptionsData);
        }

        export const ReplyOptionsContainer =
                Flux.createFactory(render, 'ReplyOptionsContainer');

        function setReplyOptions (name: string, replyOptions: Im.ReplyOptions)
        {
                const action = Action.setMessageReplyOptions({
                        name: name,
                        value: replyOptions,
                });
                Flux.handleAction(action);
        }
}
