///<reference path='../../misc.ts'/>

module Component {
        export interface DragData {
                id: string,
                x: number,
                y: number,
        }

        type DraggableProps = Redux.Props<Im.Value>;

        function render (props: DraggableProps)
        {
                const children = props.children;

                const onStart = (e: DragEvent) => onDragStart(props, e);

                return Div({
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
