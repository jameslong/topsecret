module Component {
        type DragzoneProps = Redux.Props<string>;

        function render (props: DragzoneProps)
        {
                const className = props.data;
                const children = props.children;

                return Core.Div({
                        className: className,
                        onDragEnter: (e: Event) => e.preventDefault(),
                        onDragOver: (e: Event) => e.preventDefault(),
                        onDrop: onDrop,
                }, children);
        }

        export const Dragzone = Redux.createFactory(render, 'Dragzone');

        function onDrop (e: DragEvent)
        {
                e.preventDefault();

                const data =  e.dataTransfer.getData('text/plain');
                const dragData: DragData = JSON.parse(data);

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
}
