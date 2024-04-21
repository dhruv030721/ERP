import React from 'react'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

function Dropdown({label, defaultValue, helperText, List}) {
    return (
        <div>
            <TextField
                id={`outlined-select-{$label`}
                select
                label={label}
                defaultValue={defaultValue}
                helperText={helperText}
            >
                {List.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        </div>
    )
}
export default Dropdown
