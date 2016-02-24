export function getDifferenceMs (start: string, end: string): number
{
        var startDate = new Date(start);
        var endDate = new Date(end);

        return (endDate.getTime() - startDate.getTime());
}
