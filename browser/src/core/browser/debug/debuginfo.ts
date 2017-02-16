import Client = require('../../client');
import Clock = require('../../../../../core/src/clock');
import Map = require('../../../../../core/src/utils/map');
import Player = require('../../../../../core/src/player');
import React = require('react');

import Core = require('../common/core');
import Br = Core.Br;
import Div = Core.Div;
import P = Core.P;
import Span = Core.Span;

interface DebugInfoProps extends React.Props<any> {
        state: Client.Client;
};

function renderDebugInfo(props: DebugInfoProps)
{
        const state = props.state;
        const players = state.server.db.players;
        const player = players[Object.keys(players)[0]];
        if (player) {
                const clock = state.data.clock;
                const day = debugDay(clock, player);
                const vars = debugVars(player);
                const messages = debugMessages(state);

                return Div({ className: 'debuginfo' }, day, vars, messages);
        } else {
                return Div({});
        }
}

const DebugInfo = React.createFactory(renderDebugInfo);

function debugDay(clock: Clock.Clock, player: Player.PlayerState)
{
        const day = Player.gameDay(clock, player);
        return P({}, `Day: ${day}`);
}

function debugVars(player: Player.PlayerState)
{
        const vars = Player.gameVars(player);
        const formattedVars = objectComponents(vars);
        return P({}, formattedVars);
}

function debugMessages(state: Client.Client)
{
        const messages = state.server.db.messages;
        const names = Object.keys(messages);
        const contents = names.map(name => [messages[name].name, Br()]);
        return P({}, contents);
}

function objectComponents(object: Map.Map<any>)
{
        const keys = Object.keys(object);
        return keys.map(key => [`${key}: ${object[key]}`, Br()]);
}

export = DebugInfo;
