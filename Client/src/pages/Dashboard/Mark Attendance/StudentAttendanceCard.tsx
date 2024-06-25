import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const StudentAttendanceCard = ({ List, attendance, onAttendanceChange }: any) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onAttendanceChange(List.enrollmentNo, (event.target as HTMLInputElement).value);
    };

    return (
        <div className=''>
            <div key={List.enrollmentNo} className='flex border border-zinc-700 rounded-md py-3 px-5 justify-between items-center'>
                <div className='flex w-[60%]'>
                    <h1 className='w-[20%]'>{List.enrollmentNo}</h1>
                    <h1 className='w-[80%] truncate'>{List.name}</h1>
                </div>
                <div className='w-[40%] flex justify-end'>
                    <RadioGroup
                        row
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                        value={attendance}
                        onChange={handleChange}
                    >
                        <FormControlLabel 
                            value="Present" 
                            control={<Radio sx={{ color: 'green', '&.Mui-checked': { color: 'green' } }} />} 
                            label="Present" 
                        />
                        <FormControlLabel 
                            value="Absent" 
                            control={<Radio sx={{ color: 'red', '&.Mui-checked': { color: 'red' } }} />} 
                            label="Absent" 
                        />
                        <FormControlLabel 
                            value="Leave" 
                            control={<Radio sx={{ color: 'blue', '&.Mui-checked': { color: 'blue' } }} />} 
                            label="On Leave" 
                        />
                    </RadioGroup>
                </div>
            </div>
        </div>
    )
}

export default StudentAttendanceCard;
