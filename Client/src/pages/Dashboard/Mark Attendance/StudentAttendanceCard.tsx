import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const StudentAttendanceCard = ({ List, attendance, onAttendanceChange }: any) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onAttendanceChange(List.enrollmentNo, (event.target as HTMLInputElement).value);
    };

    return (
        <div className=''>
            <div key={List.enrollmentNo} className='flex flex-col md:flex-row border border-zinc-400 shadow rounded-md py-3 px-5 justify-between items-center'>
                <div className='flex flex-col w-full'>
                    <h1 className='w-['>{List.enrollmentNo}</h1>
                    <h1 className='truncate'>{List.name}</h1>
                </div>
                <div className='w-full flex md:justify-end'>
                    <RadioGroup
                        row
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                        value={attendance || "Present"}
                        onChange={handleChange}
                    >
                        <FormControlLabel
                            value="PRESENT"
                            control={<Radio sx={{ color: 'green', '&.Mui-checked': { color: 'green' } }} />}
                            label="Present"
                        />
                        <FormControlLabel
                            value="ABSENT"
                            control={<Radio sx={{ color: 'red', '&.Mui-checked': { color: 'red' } }} />}
                            label="Absent"
                        />
                        <FormControlLabel
                            value="LEAVE"
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
