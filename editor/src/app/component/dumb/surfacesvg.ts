import ReactUtils = require('../../redux/react');

import Core = require('../core');
import SVG = Core.SVG;

type SurfaceSVGProps = ReactUtils.Props<void>;

function render (props: SurfaceSVGProps)
{
        const data = props.data;
        const children = props.children;

        const svgProps = {
                className: 'surface-svg',
        };

        return SVG(svgProps, children);
}

export const SurfaceSVG = ReactUtils.createFactory(render, 'SurfaceSvg');
