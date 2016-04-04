import ActionCreators = require('../../action/actioncreators');
import Immutable = require('immutable');
import Message = require('../../message');
import Narrative = require('../../narrative');
import ReactUtils = require('../../redux/react');
import Redux = require('../../redux/redux');
import ReplyOption = require('../../replyoption');

import ReplyOptions = require('../dumb/replyoptions');

interface ReplyOptionsContainerInt {
        name: string;
        replyOptions: ReplyOption.ReplyOptions;
        messages: Message.Messages;
};
export type ReplyOptionsContainerData = Immutable.Record.IRecord<ReplyOptionsContainerInt>;
export const ReplyOptionsContainerData = Immutable.Record<ReplyOptionsContainerInt>({
        name: '',
        replyOptions: Immutable.List<ReplyOption.ReplyOption>(),
        messages: Immutable.Map<string, Message.Message>(),
}, 'ReplyOptionsContainer');

type ReplyOptionsContainerProps = ReactUtils.Props<ReplyOptionsContainerData>;

function render (props: ReplyOptionsContainerProps)
{
        const data = props.data;
        const name = data.name;

        const replyOptionsData = ReplyOptions.ReplyOptionsData({
                name: name,
                replyOptions: data.replyOptions,
                messages: data.messages,
                onSet: (options: ReplyOption.ReplyOptions) =>
                        setReplyOptions(name, options),
        });
        return ReplyOptions.ReplyOptions(replyOptionsData);
}

export const ReplyOptionsContainer =
        ReactUtils.createFactory(render, 'ReplyOptionsContainer');

function setReplyOptions (name: string, replyOptions: ReplyOption.ReplyOptions)
{
        const action = ActionCreators.setMessageReplyOptions({
                name: name,
                value: replyOptions,
        });
        Redux.handleAction(action);
}
