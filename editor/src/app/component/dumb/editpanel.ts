/// <reference path="../smart/editmessagecontainer.ts" />

module EditPanel {
        interface EditPanelInt {
                store: State.Store;
                onClick: (e: MouseEvent) => void;
        };
        export type EditPanelData = Immutable.Record.IRecord<EditPanelInt>;
        export const EditPanelData = Immutable.Record<EditPanelInt>({
                store: State.Store(),
                onClick: () => {},
        }, 'EditPanel');

        type EditPanelProps = Redux.Props<EditPanelData>;

        function render (props: EditPanelProps)
        {
                const data = props.data;
                const store = data.store;
                const narrative = Narrative.getActiveNarrative(store);

                const editMessageData = EditMessageContainer.EditMessageContainerData({
                        name: store.activeMessage,
                        store: store,
                });
                const editMessage = EditMessageContainer.EditMessageContainer(editMessageData);

                const panelProps = {
                        className: 'edit-panel',
                        onClick: data.onClick,
                };

                const contentProps = {
                        className: 'edit-panel-content',
                        onClick: onClick,
                };

                return Core.Div(panelProps,
                        Core.Div(contentProps, editMessage)
                );
        }

        export const EditPanel = Redux.createFactory(render, 'EditPanel');

        function onClick (e: MouseEvent)
        {
                e.stopPropagation();
        }
}
