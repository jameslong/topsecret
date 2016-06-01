export const debug = console.log;
export const info = console.info;
export const error = console.error;
export const assert = (test: boolean, desc: string, meta?: Object) => {
        if (!test) {
                error(desc, meta);
        }
};
type MetricType = 'BEGIN_GAME' | 'END_GAME' | 'MESSAGE_RECEIVED' | 'MESSAGE_SENT';
interface Metric {
        type: MetricType;
        playerEmail: string;
}
export const metric = <T extends Metric>(data: T) => {
        const stringData = JSON.stringify(data, null, 4);
        return info('Metric:', stringData);
}
