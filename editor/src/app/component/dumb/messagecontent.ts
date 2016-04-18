import Arr = require('../../../../../core/src/app/utils/array');
import Helpers = require('../../../../../core/src/app/utils/helpers');
import Map = require('../../../../../core/src/app/utils/map');
import Message = require('../../message');
import Narrative = require('../../narrative');
import Profile = require('../../profile');
import React = require('react');
import TextInputValidated = require('../textinputvalidated');

import ComponentHelpers = require('../helpers');
import Core = require('../core');
import Div = Core.Div;
import EditMessage = require('./editmessage');
import Multiple = require('./multiple');
import Passage = require('./passage');
import TextComponent = require('./text');
import TextList = require('./textlist');

type OnSet = (content: Message.MessageContent) => void;
type OnSetString = (name: string, value: string) => void;

interface MessageContentProps extends React.Props<any> {
        message: Message.MessageContent;
        profiles: Profile.Profiles;
        strings: Narrative.Strings;
        name: string;
        onSet: OnSet;
        onSetString: OnSetString;
};

function renderMessageContent (props: MessageContentProps)
{
        const onSet = props.onSet;
        const onSetString = props.onSetString;
        const message = props.message;
        const profiles = props.profiles;
        const strings = props.strings;

        const from = createFrom(onSet, message, profiles)
        const to = createTo(onSet, message, profiles)
        const body = createBody(onSet, onSetString, message, strings);

        return Div({},
                ComponentHelpers.wrapInSubgroup(from),
                ComponentHelpers.wrapInSubgroup(to),
                ComponentHelpers.wrapInSubgroup(body)
        );
}

const MessageContent = React.createFactory(renderMessageContent);

function onSetFrom (
        onSet: OnSet,
        content: Message.MessageContent,
        from: string)
{
        const newContent = Helpers.assign(content, { from });
        onSet(newContent);
}

function onSetTo (
        onSet: OnSet,
        content: Message.MessageContent,
        to: string[])
{
        const newContent = Helpers.assign(content, { to });
        onSet(newContent);
}

function onSetPassage (
        onSet: OnSet,
        content: Message.MessageContent,
        text: string,
        index: number)
{
        const body = Arr.set(content.body, index, text);
        const newContent = Helpers.assign(content, { body });
        onSet(newContent);
}

function onAddPassage (onSet: OnSet, content: Message.MessageContent)
{
        const body = Arr.push(content.body, '');
        const newContent = Helpers.assign(content, { body });
        onSet(newContent);
}

function onRemovePassage (
        onSet: OnSet,
        content: Message.MessageContent,
        index: number)
{
        const body = Arr.deleteIndex(content.body, index);
        const newContent = Helpers.assign(content, { body });
        onSet(newContent);
}

function createBody (
        onSet: OnSet,
        onSetString: OnSetString,
        content: Message.MessageContent,
        strings: Narrative.Strings)
{
        const body = content.body;

        const passages = body.map((name, index) => {
                const onSetName = (newName: string) =>
                        onSetPassage(onSet, content, newName, index);

                const onSetBody = (value: string) => onSetString(name, value);

                const props = {
                        onSetName: onSetName,
                        onSetBody: onSetBody,
                        name: name,
                        strings: strings
                };
                return Passage(props);
        });

        const onAdd = () => onAddPassage(onSet, content);
        const onRemove = (index: number) =>
                onRemovePassage(onSet, content, index);
        const props = {
                onAdd: onAdd,
                onRemove: onRemove,
                children: passages,
        };
        return Multiple(props);
}

function createFrom (
        onSet: OnSet,
        content: Message.MessageContent,
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

function createTo (
        onSet: OnSet,
        content: Message.MessageContent,
        profiles: Profile.Profiles)
{
        const values = content.to;
        const onChange = (newTo: string[]) => onSetTo(onSet, content, newTo);
        const valid = values.every(to => Map.exists(profiles, to));
        const props = {
                placeholder: 'joe, sarah, mark',
                values: values,
                onChange: onChange,
        };
        const to = TextInputValidated.createValidatedTextList(props, valid);
        return ComponentHelpers.wrapInLabel('To', to);
}

export = MessageContent;
