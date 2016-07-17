import Arr = require('../../../../../../core/src/utils/array');
import EditorMessage = require('../../../../editormessage');
import Narrative = require('../../../../narrative');
import React = require('react');
import ReplyOption = require('../../../../../../core/src/replyoption');

import Core = require('../../../common/core');
import Div = Core.Div;
import Multiple = require('../../../common/multiple');
import ReplyOptionComponent = require('./replyoption');

type OnSet = (options: ReplyOption.ReplyOptions) => void;

interface ReplyOptionsProps {
        name: string;
        replyOptions: ReplyOption.ReplyOptions;
        messages: EditorMessage.EditorMessages;
        onSet: OnSet;
};

function renderReplyOptions (props: ReplyOptionsProps)
{
        const onSet = props.onSet;
        const name = props.name;
        const options = props.replyOptions;
        const messages = props.messages;
        const replyOptions = render(onSet, options, messages);

        return Div({}, replyOptions);
}

const ReplyOptions = React.createFactory(renderReplyOptions);

function onSetReplyOption (
        onSet: OnSet,
        options: ReplyOption.ReplyOptions,
        index: number,
        option: ReplyOption.ReplyOption)
{
        const newOptions = Arr.set(options, index, option);
        onSet(newOptions);
}

function onAddReplyOption (onSet: OnSet, options: ReplyOption.ReplyOptions)
{
        const option = ReplyOption.createReplyOptionKeyword();
        const newOptions = Arr.push(options, option);
        onSet(newOptions);
}

function onRemoveReplyOption (
        onSet: OnSet, options: ReplyOption.ReplyOptions, index: number)
{
        const newOptions = Arr.deleteIndex(options, index);
        onSet(newOptions);
}

function render (
        onSet: OnSet,
        options: ReplyOption.ReplyOptions,
        messages: EditorMessage.EditorMessages)
{
        const children = options.map((option, index) => {
                const onSetReplyOptionLocal = (option: ReplyOption.ReplyOption) =>
                        onSetReplyOption(onSet, options, index, option);
                const props = {
                        onSet: onSetReplyOptionLocal,
                        replyOption: option,
                        messages: messages,
                };
                return ReplyOptionComponent(props);
        });
        const onAdd = () => onAddReplyOption(onSet, options);
        const onRemove = (index: number) =>
                onRemoveReplyOption(onSet, options, index);
        const multipleProps = {
                children: children,
                onAdd: onAdd,
                onRemove: onRemove,
        };
        return Multiple(multipleProps);
}

export = ReplyOptions;
