import Misc = require('../../misc');

import Core = require('../core');
import Div = Core.Div;
import ReactUtils = require('../../redux/react');

export interface DragData {
        id: string,
        x: number,
        y: number,
}

type DraggableProps = ReactUtils.Props<Misc.Value>;

function render (props: DraggableProps)
{
        const children = props.children;

        const onStart = (e: DragEvent) => onDragStart(props, e);

        return Div({
                draggable: true,
                onDragStart: onStart,
         }, children);
}

export const Draggable = ReactUtils.createFactory(render, 'Draggable');

function onDragStart (props: DraggableProps, e: DragEvent)
{
        const data = props.data;

        const dragData: DragData = {
                id: data.value,
                x: e.screenX,
                y: e.screenY,
        };

        const dataPacket = JSON.stringify(dragData);

        e.dataTransfer.setData('text/plain', dataPacket);
}
