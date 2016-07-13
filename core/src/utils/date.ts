export function getDifferenceMs (start: string, end: string): number
{
        const startDate = new Date(start);
        const endDate = new Date(end);

        return (endDate.getTime() - startDate.getTime());
}
