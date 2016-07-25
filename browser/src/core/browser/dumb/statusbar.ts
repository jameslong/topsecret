import React = require('react');

import Core = require('../common/core');
import Div = Core.Div;

interface StatusBarProps extends React.Props<any> {}

function renderStatusBar(props: StatusBarProps)
{
        return Div({ className: 'statusbar' }, props.children);
}

const StatusBar = React.createFactory(renderStatusBar);

export = StatusBar;
