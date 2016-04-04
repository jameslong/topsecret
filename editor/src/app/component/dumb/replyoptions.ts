/// <reference path="../dumb/replyoption.ts" />

module ReplyOptions {
        type OnSet = (options: ReplyOption.ReplyOptions) => void;

        interface ReplyOptionsInt {
                name: string;
                replyOptions: ReplyOption.ReplyOptions;
                messages: Narrative.Messages;
                onSet: OnSet;
        };
        export type ReplyOptionsData = Immutable.Record.IRecord<ReplyOptionsInt>;
        export const ReplyOptionsData = Immutable.Record<ReplyOptionsInt>({
                name: '',
                replyOptions: Immutable.List<ReplyOption.ReplyOption>(),
                messages: Immutable.Map<string, Message.Message>(),
                onSet: () => {},
        }, 'ReplyOptions');

        type ReplyOptionsProps = Redux.Props<ReplyOptionsData>;

        function render (props: ReplyOptionsProps)
        {
                const data = props.data;
                const onSet = data.onSet;
                const name = data.name;
                const options = data.replyOptions;
                const messages = data.messages;
                const replyOptions = renderReplyOptions(
                        onSet, options, messages);

                return Core.Div({}, replyOptions);
        }

        export const ReplyOptions = Redux.createFactory(render, 'ReplyOptions');

        function onSetReplyOption (
                onSet: OnSet,
                options: ReplyOption.ReplyOptions,
                index: number,
                option: ReplyOption.ReplyOption)
        {
                const newOptions = options.set(index, option);
                onSet(newOptions);
        }

        function onAddReplyOption (onSet: OnSet, options: ReplyOption.ReplyOptions)
        {
                const newOption = ReplyOption.ReplyOptionKeyword();
                const newOptions = options.push(newOption);
                onSet(newOptions);
        }

        function onRemoveReplyOption (
                onSet: OnSet, options: ReplyOption.ReplyOptions, index: number)
        {
                const newOptions = options.delete(index);
                onSet(newOptions);
        }

        function renderReplyOptions (
                onSet: OnSet,
                options: ReplyOption.ReplyOptions,
                messages: Narrative.Messages)
        {
                const children = options.map((option, index) => {
                        const onSetReplyOptionLocal = (option: ReplyOption.ReplyOption) =>
                                onSetReplyOption(onSet, options, index, option);
                        const props = ReplyOptionComponent.ReplyOptionData({
                                onSet: onSetReplyOptionLocal,
                                replyOption: option,
                                messages: messages,
                        });
                        return ReplyOptionComponent.ReplyOptionComponent(props);
                });
                const onAdd = () => onAddReplyOption(onSet, options);
                const onRemove = (index: number) =>
                        onRemoveReplyOption(onSet, options, index);
                const multipleProps = Multiple.MultipleData({
                        children: children,
                        onAdd: onAdd,
                        onRemove: onRemove,
                });
                return Multiple.Multiple(multipleProps);
        }
}
