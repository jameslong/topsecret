/// <reference path="../smart/dragzone.ts" />

module Component {
        type SurfaceProps = Redux.Props<void>;

        function render (props: SurfaceProps)
        {
                const data = props.data;
                const children = props.children;

                return Core.Div({ className: 'surface' },
                        Dragzone('surface-dragzone', children));
        }

        export const Surface = Redux.createFactory(render, 'Surface');
}
