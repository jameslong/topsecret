/// <reference path="arrow.ts" />
/// <reference path="../smart/nodecontainer.ts" />
/// <reference path="surface.ts" />
/// <reference path="surfacesvg.ts" />

module EditArea {
        interface EditAreaInt {
                store: State.Store;
                onClick: (e: MouseEvent) => void,
        };
        export type EditAreaData = Immutable.Record.IRecord<EditAreaInt>;
        export const EditAreaData = Immutable.Record<EditAreaInt>({
                store: State.Store(),
                onClick: () => {},
        }, 'EditArea');

        type EditAreaProps = Redux.Props<EditAreaData>;

        function render (props: EditAreaProps)
        {
                const data = props.data;
                const store = data.store;
                const narrative = Narrative.getActiveNarrative(store);
                const messages = narrative.messages;
                const messageList = messages.toList();

                const messageComponents = messageList.map(
                        message => NodeContainer.NodeContainer({
                                key: message.name,
                                data: message
                        })
                );

                const edges = store.edges;
                const connections = edges.map(
                        edge => Arrow.Arrow({
                                key: edge.name,
                                data: edge,
                        })
                );

                const editProps = {
                        className: 'edit-area',
                        onClick: data.onClick,
                };

                return Core.Div(editProps,
                        SurfaceSVG.SurfaceSVG(null, connections),
                        Surface.Surface(null, messageComponents)
                );
        }

        export const EditArea = Redux.createFactory(render, 'EditArea');
}
