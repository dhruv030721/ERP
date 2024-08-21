
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function RowRadioButtonsGroup({ setValue, fields, value }: any) {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    return (
        <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                onChange={handleChange}
                value={value}
            >
                {fields.map((field: any) => (
                    <FormControlLabel value={field.value} control={<Radio />} label={field.label} />
                ))}
            </RadioGroup>
        </FormControl>
    );
}