/// <reference path="dumb/text.ts" />
/// <reference path="dumb/textlist.ts" />
/// <reference path="dumb/textareainput.ts" />

module TextInputValidated {
        export function createValidatedText (props: Component.TextProps, valid: boolean)
        {
                return createValidatedComponent(props, Component.Text, valid);
        }

        export function createValidatedTextList (
                props: Component.TextListProps, valid: boolean)
        {
                return createValidatedComponent(props, Component.TextList, valid);
        }

        export function createValidatedTextArea (
                props: Component.TextAreaProps, valid: boolean)
        {
                return createValidatedComponent(props, Component.TextAreaInput, valid);
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
