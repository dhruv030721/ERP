import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Card, CardContent } from '@/components/ui/card';
import { Dayjs } from 'dayjs';

interface CalendarSectionProps {
    dateValue: Dayjs | null;
    DateHandler: (date: Dayjs | null) => void;
}

const CalendarSection = ({ dateValue, DateHandler }: CalendarSectionProps) => (
    <Card className="w-[320px] h-full mx-auto mt-5 md:mt-0">
        <CardContent className="">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                    value={dateValue}
                    onChange={DateHandler}
                    sx={{
                        width: '100%',
                        // Font styling
                        '& .MuiTypography-root': {
                            fontFamily: 'Poppins, sans-serif',
                        },
                        // Calendar header
                        '& .MuiPickersCalendarHeader-root': {
                            paddingLeft: '24px',
                            paddingRight: '24px',
                            paddingTop: '15px',
                            justifyContent: 'center',
                            '& .MuiPickersCalendarHeader-label': {
                                fontFamily: 'Poppins, sans-serif',  
                                fontWeight: 800,
                            },
                        },
                        // Day names styling
                        '& .MuiDayCalendar-header': {
                            justifyContent: 'space-around',
                            width: '100%',
                            '& .MuiTypography-root': {
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                            },
                        },
                        // Week container styling
                        '& .MuiDayCalendar-weekContainer': {
                            justifyContent: 'space-around',
                            width: '100%',
                        },
                        // Day number styling
                        '& .MuiPickersDay-root': {
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 400,
                        },
                        // Selected day styling
                        '& .MuiPickersDay-root.Mui-selected': {
                            fontWeight: 500,
                            background: "#001833"
                        },
                        // Today styling
                        '& .MuiPickersDay-today': {
                            fontWeight: 500,
                        }
                    }}
                />
            </LocalizationProvider>
        </CardContent>
    </Card>
);

export default CalendarSection;