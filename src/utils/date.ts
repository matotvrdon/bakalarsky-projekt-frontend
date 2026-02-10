export const toUtcIsoDate = (date: string) => {
    if (!date) return date;
    return `${date}T00:00:00.000Z`;
};
