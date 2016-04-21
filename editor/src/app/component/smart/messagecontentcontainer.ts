import ActionCreators = require('../../action/actioncreators');
import EditMessageContainer = require('../smart/editmessagecontainer');
import Message = require('../../message');
import Narrative = require('../../narrative');
import Profile = require('../../profile');
import React = require('react');
import Redux = require('../../redux/redux');

import MessageContent = require('../dumb/messagecontent');

interface MessageContentContainerProps extends React.Props<any> {
        message: Message.MessageContent;
        profiles: Profile.Profiles;
        strings: Narrative.Strings;
        name: string;
        narrativeId: string;
};

function renderMessageContentContainer (props: MessageContentContainerProps)
{
        const name = props.name;
        const narrativeId = props.narrativeId;
        const onSet = (content: Message.MessageContent) =>
                onSetMessageContent(narrativeId, name, content);
        const onSetBodyLocal = (value: string) =>
                onSetBody(narrativeId, name, value);
        const contentProps = {
                message: props.message,
                profiles: props.profiles,
                strings: props.strings,
                name: props.name,
                onSet,
                onSetBody: onSetBodyLocal,
        };
        return MessageContent(contentProps);
}

const MessageContentContainer =
        React.createFactory(renderMessageContentContainer);

function onSetMessageContent (
        narrativeId: string,
        messageName: string,
        newContent: Message.MessageContent)
{
        const action = ActionCreators.setMessageContent({
                narrativeId,
                name: messageName,
                value: newContent,
        });
        Redux.handleAction(action);
}

function onSetBody (narrativeId: string, name: string, value: string)
{
        const action = ActionCreators.setMessageBody({
                narrativeId,
                name,
                value,
        });
        Redux.handleAction(action);
}

export = MessageContentContainer;
