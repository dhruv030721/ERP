import React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

interface DropdownProps {
    label: string;
    defaultValue: string | undefined;
    helperText: string;
    List: { value: string; label: string }[] | null;
    dropdownHandler: (value: string) => void;
    width?: string | number;
}

const Dropdown: React.FC<DropdownProps> = ({ label, defaultValue, helperText, List, dropdownHandler, width }) => {
    return (
        <div>
            <TextField
                id={`outlined-select-${label}`}
                select
                label={label}
                defaultValue={defaultValue}
                helperText={helperText}
                onChange={(event) => {
                    dropdownHandler(event.target.value);
                }}
                sx={{ width: width || 'auto' }}
                color='warning'
            >
                {List != null ? (List.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))) : null}
            </TextField>
        </div>
    );
};

export default Dropdown;
