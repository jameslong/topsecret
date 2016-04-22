import Data = require('../../data');
import Helpers = require('../../../../../../core/src/app/utils/helpers');
import Func = require('../../../../../../core/src/app/utils/function');
import Map = require('../../../../../../core/src/app/utils/map');
import Message = require('../../message');
import SelectableRows = require('./selectablerows');
import React = require('react');

interface IndexProps extends React.Props<any> {
        activeMessageId: string;
        messages: Message.Message[];
}

function renderIndex(props: IndexProps)
{
        const selectedId = props.activeMessageId;
        const messages = props.messages;
        const unreadMessages = messages.filter(Func.not(Message.isRead));
        const highlightedIds = unreadMessages.map(Data.getId);

        const rowDataById = Helpers.mapFromArray(messages,
                Data.getId,
                (message, index) => createRowData(message, index));

        return SelectableRows({ rowDataById, selectedId, highlightedIds });
}

const Index = React.createFactory(renderIndex);

function createRowData (message: Message.Message, index: number)
{
        const meta = Message.getMeta(message);
        const date = Message.getDisplayDate(message.date);
        const from = Message.getDisplayName(message.from);
        const size = Message.getDisplaySize(message.body);
        const subject = message.subject;

        return [
                index.toString(),
                meta,
                date,
                from,
                size,
                subject
        ];
}

export = Index;
