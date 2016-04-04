import ActionCreators = require('../../action/actioncreators');
import Core = require('../core');
import Draggable = require('./draggable');
import Div = Core.Div;
import MathUtils = require('../../math');
import ReactUtils = require('../../redux/react');
import Redux = require('../../redux/redux');

type DragzoneProps = ReactUtils.Props<string>;

function render (props: DragzoneProps)
{
        const className = props.data;
        const children = props.children;

        return Div({
                className: className,
                onDragEnter: (e: Event) => e.preventDefault(),
                onDragOver: (e: Event) => e.preventDefault(),
                onDrop: onDrop,
        }, children);
}

export const Dragzone = ReactUtils.createFactory(render, 'Dragzone');

function onDrop (e: DragEvent)
{
        e.preventDefault();

        const data =  e.dataTransfer.getData('text/plain');
        const dragData: Draggable.DragData = JSON.parse(data);

        const deltaX = e.screenX - dragData.x;
        const deltaY = e.screenY - dragData.y;

        const delta = MathUtils.Coord({
                x: deltaX,
                y: deltaY,
        });

        const action = ActionCreators.endDrag({
                id: dragData.id,
                delta: delta,
        });

        Redux.handleAction(action);
}
