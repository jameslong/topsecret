export interface Error {
        code: string;
        message: string;
}

export interface Callback<T> {
        (error: Error, data: T): void;
}
