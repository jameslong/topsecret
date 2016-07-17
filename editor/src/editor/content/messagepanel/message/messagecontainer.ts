import Actions = require('../../../../actions/actions');
import Message = require('../../../../../../core/src/message');
import Narrative = require('../../../../narrative');
import Profile = require('../../../../../../core/src/profile');
import React = require('react');
import Redux = require('../../../../redux/redux');

import MessageComponent = require('./message');

interface MessageContainerProps extends React.Props<any> {
        message: Message.Message;
        profiles: Profile.Profiles;
        strings: Narrative.Strings;
        name: string;
        narrativeId: string;
};

function renderMessageContainer (props: MessageContainerProps)
{
        const name = props.name;
        const narrativeId = props.narrativeId;
        const onSet = (content: Message.Message) =>
                onSetMessage(narrativeId, name, content);
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
        return MessageComponent(contentProps);
}

const MessageContainer = React.createFactory(renderMessageContainer);

function onSetMessage (
        narrativeId: string, name: string, value: Message.Message)
{
        const action = Actions.setMessageContent({ narrativeId, name, value });
        Redux.handleAction(action);
}

function onSetBody (narrativeId: string, name: string, value: string)
{
        const action = Actions.setMessageBody({ narrativeId, name, value });
        Redux.handleAction(action);
}

export = MessageContainer;
