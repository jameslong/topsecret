module Component {
        type SurfaceSVGProps = Redux.Props<void>;

        function render (props: SurfaceSVGProps)
        {
                const data = props.data;
                const children = props.children;

                const svgProps = {
                        className: 'surface-svg',
                };

                return Core.SVG(svgProps, children);
        }

        export const SurfaceSVG = Redux.createFactory(render, 'SurfaceSvg');
}
