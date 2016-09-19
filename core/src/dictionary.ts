import Map = require('./utils/map');
import Str = require('./utils/string');

export interface DictionaryConfig {
        define: Map.Map<string>;
        program: Map.Map<string>;
        help: string;
        invalid: string;
        invalidProgram: string;
        invalidDefine: string;
}

export enum CommandType {
        Program,
        Define,
        Help,
        Invalid
}

const Commands = {
        Define: 'define',
        Help: 'help',
        Program: 'program',
};

export const config: DictionaryConfig = {
        define: {
                pgp: 'dictionary_define_pgp',
        },
        program: {
                ultra: 'dictionary_program_ultra',
        },
        help: 'dictionary_help',
        invalid: 'dictionary_invalid',
        invalidProgram: 'dictionary_invalid_program',
        invalidDefine: 'dictionary_invalid_define',
};

export function getCommandReply (command: string) {
        const type = command.indexOf(Commands.Program) !== -1 ?
                CommandType.Program :
                command.indexOf(Commands.Define) !== -1 ?
                        CommandType.Define :
                        command.indexOf(Commands.Help) !== -1 ?
                                CommandType.Help :
                                CommandType.Invalid;

        let name = '';

        switch (type) {
        case CommandType.Program:
                name = Map.valueOf(config.program, (value, key) =>
                        Str.containsWord(command, key)) ||
                        config.invalidProgram;
                break;

        case CommandType.Define:
                name = Map.valueOf(config.define, (value, key) =>
                        Str.containsWord(command, key)) ||
                        config.invalidDefine;
                break;

        case CommandType.Help:
                name = config.help;
                break;

        default:
                name = config.invalid;
                break;
        }

        return name;
}
