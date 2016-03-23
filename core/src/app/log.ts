export const debug = console.log;
export const info = console.info;
export const error = console.error;
export const assert = (test: boolean, desc: string, meta?: Object) => {
        if (!test) {
                error(desc, meta);
        }
};
