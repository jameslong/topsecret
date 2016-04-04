/// <reference path="../dumb/editarea.ts" />

module EditAreaContainer {
        type EditAreaContainerProps = Redux.Props<State.Store>;

        function render (props: EditAreaContainerProps)
        {
                const data = props.data;
                const editAreaData = EditArea.EditAreaData({
                        store: data,
                        onClick: onClick,
                });
                return EditArea.EditArea(editAreaData);
        }

        export const EditAreaContainer = Redux.createFactory(render, 'EditAreaContainer');

        function onClick (event: MouseEvent)
        {
                event.stopPropagation();

                const action = ActionCreators.deselectAllMessages();
                Redux.handleAction(action);
        }
}
