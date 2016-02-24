/// <reference path="../smart/dragzone.ts" />

module Component {
        type SurfaceProps = Flux.Props<void>;

        function render (props: SurfaceProps)
        {
                const data = props.data;
                const children = props.children;

                return Div({ className: 'surface' },
                        Dragzone('surface-dragzone', children));
        }

        export const Surface = Flux.createFactory(render, 'Surface');
}
