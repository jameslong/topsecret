import React = require('react');

import Core = require('../core');
import SVG = Core.SVG;

interface SurfaceSVGProps extends React.Props<any> {};

function renderSurfaceSVG (props: SurfaceSVGProps)
{
        const children = props.children;
        const svgProps = { className: 'surface-svg' };
        return SVG(svgProps, children);
}

const SurfaceSVG = React.createFactory(renderSurfaceSVG);

export = SurfaceSVG;
