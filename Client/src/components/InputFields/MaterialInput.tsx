import TextField, { TextFieldProps } from "@mui/material/TextField";

interface MaterialInputProps extends Omit<TextFieldProps, 'variant'> { // Extend from Material-UI's TextFieldProps
  label: string;
}

const MaterialInput: React.FC<MaterialInputProps> = ({ label, ...props }) => {
  return (
    <TextField
      label={label}
      variant="outlined" 
      fullWidth 
      {...props} 
    />
  );
};

export default MaterialInput;
