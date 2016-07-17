import React = require('react');

import Core = require('../../editor/common/core');
import Div = Core.Div;

interface DraggableProps extends React.Props<any> {
        value: string;
}

function renderDraggable (props: DraggableProps)
{
        const children = props.children;

        const onStart = (e: DragEvent) => onDragStart(props, e);

        return Div({
                draggable: true,
                onDragStart: onStart,
         }, children);
}

const Draggable = React.createFactory(renderDraggable);

interface DragData {
        id: string;
        x: number;
        y: number;
}

function onDragStart (props: DraggableProps, e: DragEvent)
{
        const dragData: DragData = {
                id: props.value,
                x: e.screenX,
                y: e.screenY,
        };

        const dataPacket = JSON.stringify(dragData);

        e.dataTransfer.setData('text/plain', dataPacket);
}

export = Draggable;
