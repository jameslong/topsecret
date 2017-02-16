export function getDifferenceMs (start: string, end: string): number
{
        const startDate = new Date(start);
        const endDate = new Date(end);

        return (endDate.getTime() - startDate.getTime());
}

export function getDaysBetween (timestampAMs: number, timestampBMs: number)
{
        const diffMs = Math.abs(timestampAMs - timestampBMs);
        const oneDay = (24 * 3600 * 1000);
        return Math.floor(diffMs / oneDay);
}

export function getTime (timestampMs: number)
{
        const date = new Date(timestampMs);
        const hours = date.getUTCHours();
        const mins = date.getUTCMinutes();
        const ms = date.getUTCMilliseconds();
        return `${hours}:${mins}:${ms}`;
}
