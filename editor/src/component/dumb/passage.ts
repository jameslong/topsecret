import Narrative = require('../../narrative');
import React = require('react');
import TextInputValidated = require('../textinputvalidated');

import Core = require('../core');
import Div = Core.Div;
import TextComponent = require('./text');
import TextAreaInput = require('./textareainput');

interface PassageProps {
        strings: Narrative.Strings;
        name: string;
        onSetName: (value: string) => void;
        onSetBody: (value: string) => void;
};

function renderPassage (props: PassageProps)
{
        const name = createName(props.name, props.onSetName);
        const body = createBody(
                props.name, props.onSetBody, props.strings);

        return Div({ className: 'message-passage' },
                name, body);
}

const Passage = React.createFactory(renderPassage);

function createName (name: string, onChange: (value: string) => void)
{
        const valid = !!name;
        const props = {
                placeholder: 'passage_string_name',
                value: name,
                onChange: onChange,
                list: 'stringNames',
        };
        return TextInputValidated.createValidatedText(props, valid);
}

function createBody (
        name: string,
        onChange: (value: string) => void,
        strings: Narrative.Strings)
{
        const bodyText = strings[name] || '';
        const valid = !!bodyText;
        const props = {
                placeholder: 'Passage content',
                value: bodyText,
                onChange: onChange,
        };
        return TextInputValidated.createValidatedTextArea(props, valid);
}

export = Passage;
