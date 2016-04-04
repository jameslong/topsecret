import Immutable = require('immutable');
import Narrative = require('../../narrative');
import ReactUtils = require('../../redux/react');
import TextInputValidated = require('../textinputvalidated');

import Core = require('../core');
import Div = Core.Div;
import TextComponent = require('./text');
import TextAreaInput = require('./textareainput');

interface PassageInt {
        strings: Narrative.Strings;
        name: string;
        onSetName: (value: string) => void;
        onSetBody: (value: string) => void;
};
export type PassageData = Immutable.Record.IRecord<PassageInt>;
export const PassageData = Immutable.Record<PassageInt>({
        strings: Immutable.Map<string, string>(),
        name: '',
        onSetName: () => {},
        onSetBody: () => {},
}, 'Passage');

type PassageProps = ReactUtils.Props<PassageData>;

function render (props: PassageProps)
{
        const data = props.data;

        const name = createName(data.name, data.onSetName);
        const body = createBody(
                data.name, data.onSetBody, data.strings);

        return Div({ className: 'message-passage' },
                name, body);
}

export const Passage = ReactUtils.createFactory(render, 'Passage');

function createName (name: string, onChange: (value: string) => void)
{
        const valid = !!name;
        const data = TextComponent.TextData({
                placeholder: 'passage_string_name',
                value: name,
                onChange: onChange,
                list: 'stringNames',
        });
        return TextInputValidated.createValidatedText({ data: data }, valid);
}

function createBody (
        name: string,
        onChange: (value: string) => void,
        strings: Narrative.Strings)
{
        const bodyText = strings.get(name) || '';
        const valid = !!bodyText;
        const data = TextAreaInput.TextAreaData({
                placeholder: 'Passage content',
                value: bodyText,
                onChange: onChange,
        });
        return TextInputValidated.createValidatedTextArea({ data: data }, valid);
}
