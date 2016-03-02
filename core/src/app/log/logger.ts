interface Logger {
        debug: (desc: string, meta?: Object) => void;
        info: (desc: string, meta?: Object) => void;
        error: (desc: string, meta?: Object) => void;
        assert: (test: boolean, desc: string, meta?: Object) => void;
}

export = Logger;
