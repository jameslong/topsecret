import Arr = require('../../../../../core/src/app/utils/array');
import Helpers = require('../../../../../core/src/app/utils/helpers');
import Map = require('../../../../../core/src/app/utils/map');
import Message = require('../../../../../core/src/app/message');
import EditorMessage = require('../../editormessage');
import Narrative = require('../../narrative');
import Profile = require('../../profile');
import React = require('react');
import TextInputValidated = require('../textinputvalidated');

import ComponentHelpers = require('../helpers');
import Core = require('../core');
import Div = Core.Div;
import EditMessage = require('./editmessage');
import TextComponent = require('./text');
import TextList = require('./textlist');

type OnSet = (content: Message.Message) => void;
type OnSetBody = (value: string) => void;

interface MessageContentProps extends React.Props<any> {
        message: Message.Message;
        profiles: Profile.Profiles;
        strings: Narrative.Strings;
        name: string;
        onSet: OnSet;
        onSetBody: OnSetBody;
};

function renderMessageContent (props: MessageContentProps)
{
        const onSet = props.onSet;
        const onSetBody = props.onSetBody;
        const message = props.message;
        const profiles = props.profiles;
        const strings = props.strings;

        const from = createFrom(onSet, message, profiles)
        const body = createBody(onSetBody, message, strings);

        return Div({},
                ComponentHelpers.wrapInSubgroup(from),
                ComponentHelpers.wrapInSubgroup(body)
        );
}

const MessageContent = React.createFactory(renderMessageContent);

function onSetFrom (
        onSet: OnSet,
        content: Message.Message,
        from: string)
{
        const newContent = Helpers.assign(content, { from });
        onSet(newContent);
}

function createBody (
        onSetBody: OnSetBody,
        content: Message.Message,
        strings: Narrative.Strings)
{
        const stringName = content.body;
        const value = strings[stringName];
        const onChange = (value: string) => onSetBody(value);

        const valid = Map.exists(strings, stringName);
        const props = {
                placeholder: 'Message body',
                value,
                onChange,
        };
        const textArea = TextInputValidated.createValidatedTextArea(props, valid);
        return Div({ className: 'message-body' }, textArea);
}

function createFrom (
        onSet: OnSet,
        content: Message.Message,
        profiles: Profile.Profiles)
{
        const value = content.from;
        const onChange = (text: string) =>
                onSetFrom(onSet, content, text);
        const valid = Map.exists(profiles, value);
        const props = {
                placeholder: 'sarah',
                value: value,
                onChange: onChange,
                list: 'profileNames',
        };
        const from = TextInputValidated.createValidatedText(props, valid);
        return ComponentHelpers.wrapInLabel('From', from);
}

export = MessageContent;
