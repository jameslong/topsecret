import Redux = require('./redux/redux');
import State = require('./state');

type KeyHandler = (state: State.State) => State.State;
export interface Command {
        id: string;
        key: string;
        keyCodes: number[];
        actionCreator: (state: State.State) => Redux.Action<any>;
        shortDesc: string;
        desc: string;
};

export function getCommandSummary (command: Command)
{
        return `${command.key}: ${command.shortDesc}`;
}
