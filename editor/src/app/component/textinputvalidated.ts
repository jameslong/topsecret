/// <reference path="dumb/text.ts" />
/// <reference path="dumb/textlist.ts" />
/// <reference path="dumb/textareainput.ts" />

module Component {
        export function createValidatedText (props: TextProps, valid: boolean)
        {
                return createValidatedComponent(props, Text, valid);
        }

        export function createValidatedTextList (
                props: TextListProps, valid: boolean)
        {
                return createValidatedComponent(props, TextList, valid);
        }

        export function createValidatedTextArea (
                props: TextAreaProps, valid: boolean)
        {
                return createValidatedComponent(props, TextAreaInput, valid);
        }

        type Props = Immutable.Record.IRecord<{ className?: string }>;
        export function createValidatedComponent<U extends Redux.Props<Props>> (
                props: U,
                createComponent: React.Factory<U>,
                valid: boolean)
        {
                if (!valid) {
                        props.data = props.data.set('className', 'invalid');
                }
                return createComponent(props);
        }
}
