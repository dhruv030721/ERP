import moment from "moment-timezone";

export const GetFormattedDate = (date: string): string => {
    const [day, month, year] = date.split('-').map(Number);
    const dob = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    return dob.toISOString();
}

export const getISTDateAndTime = (): string => {
    return moment().tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
}


export const getUTCTime = (): Date => {
    return new Date();
}


// export const MonthDateRange = (): 