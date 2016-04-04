import ActionCreators = require('../../action/actioncreators');
import Immutable = require('immutable');
import Message = require('../../message');
import Narrative = require('../../narrative');
import Profile = require('../../profile');
import ReactUtils = require('../../redux/react');
import Redux = require('../../redux/redux');

import MessageContent = require('../dumb/messagecontent');

interface MessageContentContainerInt {
        message: Message.MessageContent;
        profiles: Profile.Profiles;
        strings: Narrative.Strings;
        name: string;
};
export type MessageContentContainerData = Immutable.Record.IRecord<MessageContentContainerInt>;
export const MessageContentContainerData = Immutable.Record<MessageContentContainerInt>({
        message: Message.MessageContent(),
        profiles: Immutable.Map<string, Profile.Profile>(),
        strings: Immutable.Map<string, string>(),
        name: '',
}, 'MessageContentContainer');

type MessageContentContainerProps = ReactUtils.Props<MessageContentContainerData>;

function render (props: MessageContentContainerProps)
{
        const data = props.data;
        const name = data.name;
        const onSet = (content: Message.MessageContent) =>
                onSetMessageContent(name, content);
        const contentData = MessageContent.MessageContentData({
                message: data.message,
                profiles: data.profiles,
                strings: data.strings,
                name: data.name,
                onSet: onSet,
        });
        return MessageContent.MessageContent(contentData);
}

export const MessageContentContainer = ReactUtils.createFactory(
        render, 'MessageContentContainer');

function onSetMessageContent (
        messageName: string, newContent: Message.MessageContent)
{
        const action = ActionCreators.setMessageContent({
                name: messageName,
                value: newContent,
        });
        Redux.handleAction(action);
}
