export const GetFormattedDate = (date: string) => {
    const [day, month, year] = date.split('-').map(Number);
    const dob = new Date(Date.UTC(year, month-1, day, 0, 0, 0));

    return dob;
}