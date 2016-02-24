///<reference path='../im/math.ts'/>

module Im {
        interface ConfigInt {
                serverURL: string;
                autosaveDelayms: number;
                maxUndos: number;
                gridSize: number;
                vertexSize: Coord;
        }
        export type Config = Immutable.Record.IRecord<ConfigInt>;
        export const Config = Immutable.Record<ConfigInt>({
                serverURL: '',
                autosaveDelayms: 0,
                maxUndos: 0,
                gridSize: 0,
                vertexSize: Coord(),
        }, 'Config');
}
