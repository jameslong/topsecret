import InfoBar = require('./infobar');
import UnorderedList = require('./unorderedlist');
import React = require('react');

import Core = require('../common/core');
import Div = Core.Div;

interface HeaderProps extends React.Props<any> {
        values: string[];
}

function renderHeader(props: HeaderProps)
{
        const ul = UnorderedList({ values: props.values });
        return Div({ className: 'header' }, InfoBar({}, ul));
}

const Header = React.createFactory(renderHeader);

export = Header;
