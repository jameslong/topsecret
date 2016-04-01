///<reference path='../../misc.ts'/>

module Draggable {
        export interface DragData {
                id: string,
                x: number,
                y: number,
        }

        type DraggableProps = Redux.Props<Misc.Value>;

        function render (props: DraggableProps)
        {
                const children = props.children;

                const onStart = (e: DragEvent) => onDragStart(props, e);

                return Core.Div({
                        draggable: true,
                        onDragStart: onStart,
                 }, children);
        }

        export const Draggable = Redux.createFactory(render, 'Draggable');

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
}
