export const debug = console.log;
export const error = console.error;
export const assert = (test: boolean, desc: string, meta?: Object) => {
        if (!test) {
                error(desc, meta);
        }
};
type MetricType = 'AWS_REQUEST_ERROR' | 'BEGIN_GAME' | 'END_GAME' | 'MESSAGE_RECEIVED' | 'MESSAGE_SENT' | 'MESSAGE_NOT_SENT';
interface Metric {
        type: MetricType;
}
export const metric = <T extends Metric>(data: T) => {
        return console.info(data);
}
