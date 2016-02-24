/// <reference path="../dumb/editarea.ts" />

module Component {
        type EditAreaContainerProps = Flux.Props<Im.Store>;

        function render (props: EditAreaContainerProps)
        {
                const data = props.data;
                const editAreaData = EditAreaData({
                        store: data,
                        onClick: onClick,
                });
                return EditArea(editAreaData);
        }

        export const EditAreaContainer = Flux.createFactory(render, 'EditAreaContainer');

        function onClick (event: MouseEvent)
        {
                event.stopPropagation();

                const action = Action.deselectAllMessages();
                Flux.handleAction(action);
        }
}
