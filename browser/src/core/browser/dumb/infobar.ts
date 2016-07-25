import React = require('react');

import Core = require('../common/core');
import Div = Core.Div;

interface InfoBarProps extends React.Props<any> {}

function renderInfoBar(props: InfoBarProps)
{
        return Div({ className: 'infobar' }, props.children);
}

const InfoBar = React.createFactory(renderInfoBar);

export = InfoBar;
