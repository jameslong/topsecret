import React = require('react');

import Core = require('../core');
import Div = Core.Div;
import Span = Core.Span;

interface NewGameLoadingProps extends React.Props<any> {
        loadingInfo: string[];
}

function renderNewGameLoading(props: NewGameLoadingProps)
{
        const info = props.loadingInfo.slice();
        const length = info.length;
        const max = 8;
        if (length >= max) {
                info.splice(0, length - max);
        } else {
                while (info.length < max) {
                        info.unshift('#');
                }
        }
        const loadingInfo = info.map((text, index) => Span({ key: index}, text));

        const bannerText = ` _   _  _____         _   _ ______ _______
| \\ | |/ ____|  /\\   | \\ | |  ____|__   __|
|  \\| | (___   /  \\  |  \\| | |__     | |
| . \` |\\___ \\ / /\\ \\ | . \` |  __|    | |
| |\\  |____) / ____ \\| |\\  | |____   | |
|_| \\_|_____/_/    \\_\\_| \\_|______|  |_|`;

        const banner = Div({ className: 'new-game-banner' }, bannerText);

        return Div({ className: 'new-game'},
                Div({ className: 'new-game-content' }, banner, loadingInfo)
        );
}

const NewGameLoading = React.createFactory(renderNewGameLoading);

export = NewGameLoading;
