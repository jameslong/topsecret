/// <reference path="../dumb/replyoption.ts" />

module Component {
        type OnSet = (options: Im.ReplyOptions) => void;

        interface ReplyOptionsInt {
                name: string;
                replyOptions: Im.ReplyOptions;
                messages: Im.Messages;
                onSet: OnSet;
        };
        export type ReplyOptionsData = Immutable.Record.IRecord<ReplyOptionsInt>;
        export const ReplyOptionsData = Immutable.Record<ReplyOptionsInt>({
                name: '',
                replyOptions: Immutable.List<Im.ReplyOption>(),
                messages: Immutable.Map<string, Im.Message>(),
                onSet: () => {},
        }, 'ReplyOptions');

        type ReplyOptionsProps = Flux.Props<ReplyOptionsData>;

        function render (props: ReplyOptionsProps)
        {
                const data = props.data;
                const onSet = data.onSet;
                const name = data.name;
                const options = data.replyOptions;
                const messages = data.messages;
                const replyOptions = renderReplyOptions(
                        onSet, options, messages);

                return Div({}, replyOptions);
        }

        export const ReplyOptions = Flux.createFactory(render, 'ReplyOptions');

        function onSetReplyOption (
                onSet: OnSet,
                options: Im.ReplyOptions,
                index: number,
                option: Im.ReplyOption)
        {
                const newOptions = options.set(index, option);
                onSet(newOptions);
        }

        function onAddReplyOption (onSet: OnSet, options: Im.ReplyOptions)
        {
                const newOption = Im.ReplyOptionKeyword();
                const newOptions = options.push(newOption);
                onSet(newOptions);
        }

        function onRemoveReplyOption (
                onSet: OnSet, options: Im.ReplyOptions, index: number)
        {
                const newOptions = options.delete(index);
                onSet(newOptions);
        }

        function renderReplyOptions (
                onSet: OnSet,
                options: Im.ReplyOptions,
                messages: Im.Messages)
        {
                const children = options.map((option, index) => {
                        const onSetReplyOptionLocal = (option: Im.ReplyOption) =>
                                onSetReplyOption(onSet, options, index, option);
                        const props = ReplyOptionData({
                                onSet: onSetReplyOptionLocal,
                                replyOption: option,
                                messages: messages,
                        });
                        return ReplyOption(props);
                });
                const onAdd = () => onAddReplyOption(onSet, options);
                const onRemove = (index: number) =>
                        onRemoveReplyOption(onSet, options, index);
                const multipleProps = MultipleData({
                        children: children,
                        onAdd: onAdd,
                        onRemove: onRemove,
                });
                return Multiple(multipleProps);
        }
}
