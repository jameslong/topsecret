/// <reference path="../dumb/editpanel.ts" />

module EditPanelContainer {
        type EditPanelContainerProps = Redux.Props<State.Store>;

        function render (props: EditPanelContainerProps)
        {
                const data = props.data;
                const editPanelData = EditPanel.EditPanelData({
                        store: data,
                        onClick: onClick,
                });
                return EditPanel.EditPanel(editPanelData);
        }

        export const EditPanelContainer = Redux.createFactory(render, 'EditPanelContainer');

        function onClick (e: MouseEvent)
        {
                e.stopPropagation();

                const action = ActionCreators.closeMessage();
                Redux.handleAction(action);
        }
}
