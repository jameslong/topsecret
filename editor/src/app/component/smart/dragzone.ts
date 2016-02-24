module Component {
        type DragzoneProps = Flux.Props<string>;

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

        export const Dragzone = Flux.createFactory(render, 'Dragzone');

        function onDrop (e: DragEvent)
        {
                e.preventDefault();

                const data =  e.dataTransfer.getData('text/plain');
                const dragData: DragData = JSON.parse(data);

                const deltaX = e.screenX - dragData.x;
                const deltaY = e.screenY - dragData.y;

                const delta = Im.Coord({
                        x: deltaX,
                        y: deltaY,
                });

                const action = Action.endDrag({
                        id: dragData.id,
                        delta: delta,
                });

                Flux.handleAction(action);
        }
}
