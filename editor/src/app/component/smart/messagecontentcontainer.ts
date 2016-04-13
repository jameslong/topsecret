import ActionCreators = require('../../action/actioncreators');
import EditMessageContainer = require('../smart/editmessagecontainer');
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
        narrativeId: string;
};
export type MessageContentContainerData = Immutable.Record.IRecord<MessageContentContainerInt>;
export const MessageContentContainerData = Immutable.Record<MessageContentContainerInt>({
        message: Message.MessageContent(),
        profiles: Immutable.Map<string, Profile.Profile>(),
        strings: Immutable.Map<string, string>(),
        name: '',
        narrativeId: '',
}, 'MessageContentContainer');

type MessageContentContainerProps = ReactUtils.Props<MessageContentContainerData>;

function render (props: MessageContentContainerProps)
{
        const data = props.data;
        const name = data.name;
        const narrativeId = data.narrativeId;
        const onSet = (content: Message.MessageContent) =>
                onSetMessageContent(narrativeId, name, content);
        const onSetString = (name: string, value: string) =>
                EditMessageContainer.onSetString(narrativeId, name, value);
        const contentData = MessageContent.MessageContentData({
                message: data.message,
                profiles: data.profiles,
                strings: data.strings,
                name: data.name,
                onSet: onSet,
                onSetString: onSetString,
        });
        return MessageContent.MessageContent(contentData);
}

export const MessageContentContainer = ReactUtils.createFactory(
        render, 'MessageContentContainer');

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
