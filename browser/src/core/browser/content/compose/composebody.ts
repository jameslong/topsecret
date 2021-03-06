import Draft = require('../../../draft');
import Helpers = require('../../common/helpers');
import Message = require('../../../message');
import React = require('react');
import UI = require('../../../ui');

import Core = require('../../common/core');
import Div = Core.Div;

import TextAreaInput = require('../../common/textareainput');

interface ComposeProps extends React.Props<any> {
        draft: Draft.Draft;
        onChange: (e: KeyboardEvent, text: string) => void;
        onKeyDown: (e: KeyboardEvent) => void;
}

function renderCompose(props: ComposeProps)
{
        const draft = props.draft;
        const body = draft.content.body;

        const textArea = TextAreaInput({
                placeholder: '',
                value: body,
                onChange: props.onChange,
                onKeyDown: props.onKeyDown,
                autofocus: true,
                cursorPosition: 0,
        });

        return Div({ className: 'compose-body' }, textArea);
}

const Compose = React.createFactory(renderCompose);

export = Compose;
