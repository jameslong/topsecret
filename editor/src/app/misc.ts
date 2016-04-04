///<reference path='edge.ts'/>

module Misc {
        export type ImObject = Immutable.Record.IRecord<{}>;
        export const ImObject = Immutable.Record<{}>({}, 'ImObject');

        export interface KeyValueInt {
                name: string;
                value: string;
        };
        export type KeyValue = Immutable.Record.IRecord<KeyValueInt>;
        export const KeyValue = Immutable.Record<KeyValueInt>(
                { name: '', value: '' }, 'KeyValue');

        interface ValueInt {
                value: string;
        };
        export type Value = Immutable.Record.IRecord<ValueInt>;
        export const Value = Immutable.Record<ValueInt>({
                value: '',
        }, 'Value');

}
