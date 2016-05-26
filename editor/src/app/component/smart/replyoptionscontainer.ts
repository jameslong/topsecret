import ActionCreators = require('../../action/actioncreators');
import EditorMessage = require('../../editormessage');
import Narrative = require('../../narrative');
import React = require('react');
import Redux = require('../../redux/redux');
import ReplyOption = require('../../../../../core/src/app/replyoption');

import ReplyOptions = require('../dumb/replyoptions');

interface ReplyOptionsContainerProps extends React.Props<any> {
        name: string;
        narrativeId: string;
        replyOptions: ReplyOption.ReplyOptions;
        messages: EditorMessage.EditorMessages;
};

function renderReplyOptionsContainer (props: ReplyOptionsContainerProps)
{
        const name = props.name;
        const narrativeId = props.narrativeId;

        const replyOptionsProps = {
                name: name,
                replyOptions: props.replyOptions,
                messages: props.messages,
                onSet: (options: ReplyOption.ReplyOptions) =>
                        setReplyOptions(narrativeId, name, options),
        };
        return ReplyOptions(replyOptionsProps);
}

const ReplyOptionsContainer = React.createFactory(renderReplyOptionsContainer);

function setReplyOptions (
        narrativeId: string,
        name: string,
        replyOptions: ReplyOption.ReplyOptions)
{
        const action = ActionCreators.setMessageReplyOptions({
                narrativeId,
                name: name,
                value: replyOptions,
        });
        Redux.handleAction(action);
}

export = ReplyOptionsContainer;
