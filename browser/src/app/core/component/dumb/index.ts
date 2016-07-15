import Arr = require('../../../../../../core/src/utils/array');
import Data = require('../../data');
import Helpers = require('../../../../../../core/src/utils/helpers');
import Func = require('../../../../../../core/src/utils/function');
import Map = require('../../../../../../core/src/utils/map');
import Message = require('../../message');
import SelectableRows = require('./selectablerows');
import React = require('react');

interface IndexProps extends React.Props<any> {
        activeMessageId: string;
        messages: Message.Message[];
}

function renderIndex(props: IndexProps)
{
        const { activeMessageId, messages } = props;
        const messageIds = Object.keys(messages);
        const selectedId = props.activeMessageId;
        const selectedIndex = Arr.find(messages,
                message => message.id === selectedId);
        const highlightedIndices = messages.reduce((result, message, index) => {
                if (!Message.isRead(message)) {
                        result.push(index);
                }
                return result;
        }, []);

        const rowData = messages.map(createRowData);
        return SelectableRows({ rowData, selectedIndex, highlightedIndices });
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
