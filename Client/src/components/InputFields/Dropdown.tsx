import React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

interface DropdownProps {
    label: string;
    defaultValue: string;
    helperText: string;
    List: { value: string; label: string }[];
    dropdownHandler: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, defaultValue, helperText, List, dropdownHandler }) => {
    return (
        <div>
            <TextField
                id={`outlined-select-${label}`}
                select
                label={label}
                defaultValue={defaultValue}
                helperText={helperText}
                onChange={(event) => {
                    console.log(event.target.value);
                    dropdownHandler(event.target.value);
                }}
            >
                {List.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        </div>
    );
};

export default Dropdown;
