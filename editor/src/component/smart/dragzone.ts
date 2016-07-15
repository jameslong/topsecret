import Actions = require('../../actions/actions');
import Core = require('../../editor/common/core');
import Draggable = require('./draggable');
import Div = Core.Div;
import React = require('react');
import Redux = require('../../redux/redux');

interface DragzoneProps extends React.Props<any> {
        className: string,
        narrativeId: string;
};

function renderDragzone (props: DragzoneProps)
{
        const narrativeId = props.narrativeId;
        const className = props.className;
        const children = props.children;

        return Div({
                className,
                onDragEnter: (e: Event) => e.preventDefault(),
                onDragOver: (e: Event) => e.preventDefault(),
                onDrop: (e: DragEvent) => onDrop(narrativeId, e),
        }, children);
}

const Dragzone = React.createFactory(renderDragzone);

interface DragData {
        id: string;
        x: number;
        y: number;
}

function onDrop (narrativeId: string, e: DragEvent)
{
        e.preventDefault();

        const data =  e.dataTransfer.getData('text/plain');
        const dragData: DragData = JSON.parse(data);

        const deltaX = e.screenX - dragData.x;
        const deltaY = e.screenY - dragData.y;

        const delta = {
                x: deltaX,
                y: deltaY,
        };

        const action = Actions.endDrag({
                id: dragData.id,
                narrativeId,
                delta: delta,
        });

        Redux.handleAction(action);
}

export = Dragzone;
