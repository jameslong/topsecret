/// <reference path="../dumb/editarea.ts" />

module Component {
        type EditAreaContainerProps = Redux.Props<State.Store>;

        function render (props: EditAreaContainerProps)
        {
                const data = props.data;
                const editAreaData = EditAreaData({
                        store: data,
                        onClick: onClick,
                });
                return EditArea(editAreaData);
        }

        export const EditAreaContainer = Redux.createFactory(render, 'EditAreaContainer');

        function onClick (event: MouseEvent)
        {
                event.stopPropagation();

                const action = ActionCreators.deselectAllMessages();
                Redux.handleAction(action);
        }
}
