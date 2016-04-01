/// <reference path="multiple.ts" />
/// <reference path="passage.ts" />
/// <reference path="textlist.ts" />

module Component {
        type OnSet = (content: Message.MessageContent) => void;

        interface MessageContentInt {
                message: Message.MessageContent;
                profiles: Narrative.Profiles;
                strings: Narrative.Strings;
                name: string;
                onSet: OnSet;
        };
        export type MessageContentData = Immutable.Record.IRecord<MessageContentInt>;
        export const MessageContentData = Immutable.Record<MessageContentInt>({
                message: Message.MessageContent(),
                profiles: Immutable.Map<string, Profile.Profile>(),
                strings: Immutable.Map<string, string>(),
                name: '',
                onSet: () => {},
        }, 'MessageContent');

        type MessageContentProps = Redux.Props<MessageContentData>;

        function render (props: MessageContentProps)
        {
                const data = props.data;
                const onSet = data.onSet;
                const message = data.message;
                const profiles = data.profiles;
                const strings = data.strings;

                const from = createFrom(onSet, message, profiles)
                const to = createTo(onSet, message, profiles)
                const body = createBody(onSet, message, strings);

                return Div({},
                        wrapInSubgroup(from),
                        wrapInSubgroup(to),
                        wrapInSubgroup(body)
                );
        }

        export const MessageContent = Redux.createFactory(
                render, 'MessageContent');

        function onSetFrom (
                onSet: OnSet,
                content: Message.MessageContent,
                from: string)
        {
                const newContent = content.set('from', from);
                onSet(newContent);
        }

        function onSetTo (
                onSet: OnSet,
                content: Message.MessageContent,
                newTo: Immutable.List<string>)
        {
                const newContent = content.set('to', newTo);
                onSet(newContent);
        }

        function onSetPassage (
                onSet: OnSet,
                content: Message.MessageContent,
                text: string,
                index: number)
        {
                const newBody = content.body.set(index, text);
                const newContent = content.set('body', newBody);
                onSet(newContent);
        }

        function onAddPassage (onSet: OnSet, content: Message.MessageContent)
        {
                const body = content.body;
                const newBody = body.push('');
                const newContent = content.set('body', newBody);
                onSet(newContent);
        }

        function onRemovePassage (
                onSet: OnSet,
                content: Message.MessageContent,
                index: number)
        {
                const body = content.body;
                const newBody = body.delete(index);
                const newContent = content.set('body', newBody);
                onSet(newContent);
        }

        function createBody (
                onSet: OnSet,
                content: Message.MessageContent,
                strings: Narrative.Strings)
        {
                const body = content.body;

                const passages = body.map((name, index) => {
                        const onSetName = (newName: string) =>
                                onSetPassage(onSet, content, newName, index);

                        const onSetBody = (value: string) =>
                                onSetString(name, value);

                        const props = PassageData({
                                onSetName: onSetName,
                                onSetBody: onSetBody,
                                name: name,
                                strings: strings
                        });
                        return Passage(props);
                });

                const onAdd = () => onAddPassage(onSet, content);
                const onRemove = (index: number) =>
                        onRemovePassage(onSet, content, index);
                const props = MultipleData({
                        onAdd: onAdd,
                        onRemove: onRemove,
                        children: passages,
                });
                return Multiple(props);
        }

        function createFrom (
                onSet: OnSet,
                content: Message.MessageContent,
                profiles: Narrative.Profiles)
        {
                const value = content.from;
                const onChange = (text: string) =>
                        onSetFrom(onSet, content, text);
                const valid = profiles.get(value) !== undefined;
                const data = TextData({
                        placeholder: 'sarah',
                        value: value,
                        onChange: onChange,
                        list: 'profileNames',
                });
                const from = createValidatedText({ data: data }, valid);
                return wrapInLabel('From', from);
        }

        function createTo (
                onSet: OnSet,
                content: Message.MessageContent,
                profiles: Narrative.Profiles)
        {
                const values = content.to;
                const onChange = (newTo: Immutable.List<string>) =>
                        onSetTo(onSet, content, newTo);
                const valid = values.every(
                        to => profiles.get(to) !== undefined);
                const data = TextListData({
                        placeholder: 'joe, sarah, mark',
                        values: values,
                        onChange: onChange,
                });
                const to = createValidatedTextList({ data: data }, valid);
                return wrapInLabel('To', to);
        }
}
