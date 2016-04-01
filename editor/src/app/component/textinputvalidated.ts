/// <reference path="dumb/text.ts" />
/// <reference path="dumb/textlist.ts" />
/// <reference path="dumb/textareainput.ts" />

module TextInputValidated {
        export function createValidatedText (props: TextComponent.TextProps, valid: boolean)
        {
                return createValidatedComponent(props, TextComponent.Text, valid);
        }

        export function createValidatedTextList (
                props: TextList.TextListProps, valid: boolean)
        {
                return createValidatedComponent(props, TextList.TextList, valid);
        }

        export function createValidatedTextArea (
                props: TextAreaInput.TextAreaProps, valid: boolean)
        {
                return createValidatedComponent(props, TextAreaInput.TextAreaInput, valid);
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
