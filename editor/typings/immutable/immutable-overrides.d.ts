declare module Immutable {
        export module Record {
                type IRecord<T> = T & TypedMap<T>;

                interface TypedMap<T> extends Map<string, any> {
                        set(key: string, value: any): IRecord<T>
                }

                interface Factory<T> {
                        new (): IRecord<T>;
                        new (values: T): IRecord<T>;

                        (): IRecord<T>;
                        (values: T): IRecord<T>;
                }
        }

        export function Record<T>(
                defaultValues: T, name?: string
        ): Record.Factory<T>;
}