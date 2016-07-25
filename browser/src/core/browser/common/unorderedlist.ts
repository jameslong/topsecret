import React = require('react');

import Core = require('../common/core');
import UL = Core.UL;
import LI = Core.LI;

interface UnorderedListProps extends React.Props<any> {
        values: any[];
}

function renderUnorderedList(props: UnorderedListProps)
{
        const list = props.values.map(wrapLI);
        return UL({}, list);
}

const UnorderedList = React.createFactory(renderUnorderedList);

function wrapLI (element: any, index: number)
{
        return LI({ key: index }, element);
}

export = UnorderedList;
