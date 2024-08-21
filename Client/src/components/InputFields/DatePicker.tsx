import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function BasicDatePicker({ label, value, setValue }: any) {
    const handleDateChange = (newValue: any) => {
        // Convert the selected date to 'yyyy-mm-dd' format
        const formattedDate = newValue ? dayjs(newValue).format('YYYY-MM-DD') : '';
        setValue(formattedDate);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker label={label} value={value} onChange={handleDateChange} />
            </DemoContainer>
        </LocalizationProvider>
    );
}
