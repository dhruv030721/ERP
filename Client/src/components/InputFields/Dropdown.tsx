import React, { useId } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

interface DropdownProps {
    label: string;
    value: string | undefined;
    helperText: string;
    List: { value: string; label: string }[] | null;
    dropdownHandler: (value: string) => void;
    width?: string | number;
    disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ label, value, helperText, List, dropdownHandler, width, disabled }) => {

    const id = useId();

    return (

        <TextField
            key={id}
            id={`outlined-select-${label}`}
            select
            label={label}
            value={value ? value : ""}
            helperText={helperText}
            disabled={disabled}
            onChange={(event) => {
                dropdownHandler(event.target.value);
            }}
            sx={{ width: width || 'auto' }}
            color='warning'
        >
            {List != null ? (
                List.map((option, index) => (
                    <MenuItem key={`${option.value}-${index}`} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))
            ) : null}

        </TextField>
    );
};

export default Dropdown;
