/// <reference path="arrow.ts" />
/// <reference path="../smart/nodecontainer.ts" />
/// <reference path="surface.ts" />
/// <reference path="surfacesvg.ts" />

module Component {
        interface EditAreaInt {
                store: Im.Store;
                onClick: (e: MouseEvent) => void,
        };
        export type EditAreaData = Immutable.Record.IRecord<EditAreaInt>;
        export const EditAreaData = Immutable.Record<EditAreaInt>({
                store: Im.Store(),
                onClick: () => {},
        }, 'EditArea');

        type EditAreaProps = Flux.Props<EditAreaData>;

        function render (props: EditAreaProps)
        {
                const data = props.data;
                const store = data.store;
                const narrative = Im.getActiveNarrative(store);
                const messages = narrative.messages;
                const messageList = messages.toList();

                const messageComponents = messageList.map(
                        message => NodeContainer({
                                key: message.name,
                                data: message
                        })
                );

                const edges = store.edges;
                const connections = edges.map(
                        edge => Arrow({
                                key: edge.name,
                                data: edge,
                        })
                );

                const editProps = {
                        className: 'edit-area',
                        onClick: data.onClick,
                };

                return Div(editProps,
                        SurfaceSVG(null, connections),
                        Surface(null, messageComponents)
                );
        }

        export const EditArea = Flux.createFactory(render, 'EditArea');
}
