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
                nearsight: 'dictionary_program_nearsight',
                papertrail: 'dictionary_program_papertrail',
                prism: 'dictionary_program_prism',
                searchlight: 'dictionary_program_searchlight',
                tide: 'dictionary_program_tide',
                tsdb: 'dictionary_program_tsdb',
                ultra: 'dictionary_program_ultra',
                xray: 'dictionary_program_xray',
        },
        program: {
                aclu: 'dictionary_define_aclu',
                burner: 'dictionary_define_burner',
                cryptology: 'dictionary_define_cryptology',
                e2ee: 'dictionary_define_e2ee',
                eff: 'dictionary_define_eff',
                infosec: 'dictionary_define_infosec',
                kst: 'dictionary_define_kst',
                metadata: 'dictionary_define_metadata',
                nsa: 'dictionary_define_nsa',
                opsec: 'dictionary_define_opsec',
                otr: 'dictionary_define_otr',
                selector: 'dictionary_define_selector',
                sid: 'dictionary_define_sid',
                sigint: 'dictionary_define_sigint',
                tao: 'dictionary_define_tao',
                tor: 'dictionary_define_tor',
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
