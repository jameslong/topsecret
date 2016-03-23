import Redux = require('./redux/redux');
import Client = require('./client');

type KeyHandler = (client: Client.Client) => Client.Client;
export interface Command {
        id: string;
        key: string;
        keyCodes: number[];
        actionCreator: (client: Client.Client) => Redux.Action<any>;
        shortDesc: string;
        desc: string;
};

export function getCommandSummary (command: Command)
{
        return `${command.key}: ${command.shortDesc}`;
}
