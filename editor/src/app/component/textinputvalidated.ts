import Immutable = require('immutable');
import ReactUtils = require('../redux/react');
import TextComponent = require('./dumb/text');
import TextAreaInput = require('./dumb/textareainput');
import TextList = require('./dumb/textlist');

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
export function createValidatedComponent<U extends ReactUtils.Props<Props>> (
        props: U,
        createComponent: React.Factory<U>,
        valid: boolean)
{
        if (!valid) {
                props.data = props.data.set('className', 'invalid');
        }
        return createComponent(props);
}
