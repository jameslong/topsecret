/// <reference path="../dumb/editpanel.ts" />

module Component {
        type EditPanelContainerProps = Flux.Props<Im.Store>;

        function render (props: EditPanelContainerProps)
        {
                const data = props.data;
                const editPanelData = EditPanelData({
                        store: data,
                        onClick: onClick,
                });
                return EditPanel(editPanelData);
        }

        export const EditPanelContainer = Flux.createFactory(render, 'EditPanelContainer');

        function onClick (e: MouseEvent)
        {
                e.stopPropagation();

                const action = Action.closeMessage();
                Flux.handleAction(action);
        }
}
