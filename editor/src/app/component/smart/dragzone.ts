import ActionCreators = require('../../action/actioncreators');
import Core = require('../core');
import Draggable = require('./draggable');
import Div = Core.Div;
import Immutable = require('immutable');
import MathUtils = require('../../math');
import ReactUtils = require('../../redux/react');
import Redux = require('../../redux/redux');

interface DragzoneInt {
        className: string,
        narrativeId: string;
};
export type DragzoneData = Immutable.Record.IRecord<DragzoneInt>;
export const DragzoneData = Immutable.Record<DragzoneInt>({
        className: '',
        narrativeId: '',
}, 'Dragzone');

type DragzoneProps = ReactUtils.Props<DragzoneData>;

function render (props: DragzoneProps)
{
        const data = props.data;
        const narrativeId = data.narrativeId;
        const className = data.className;
        const children = props.children;

        return Div({
                className,
                onDragEnter: (e: Event) => e.preventDefault(),
                onDragOver: (e: Event) => e.preventDefault(),
                onDrop: (e: DragEvent) => onDrop(narrativeId, e),
        }, children);
}

export const Dragzone = ReactUtils.createFactory(render, 'Dragzone');

function onDrop (narrativeId: string, e: DragEvent)
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
                narrativeId,
                delta: delta,
        });

        Redux.handleAction(action);
}
