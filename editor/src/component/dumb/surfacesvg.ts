module Component {
        type SurfaceSVGProps = Flux.Props<void>;

        function render (props: SurfaceSVGProps)
        {
                const data = props.data;
                const children = props.children;

                const svgProps = {
                        className: 'surface-svg',
                };

                return SVG(svgProps, children);
        }

        export const SurfaceSVG = Flux.createFactory(render, 'SurfaceSvg');
}
