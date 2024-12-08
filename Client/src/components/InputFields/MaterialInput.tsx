import TextField, { TextFieldProps } from "@mui/material/TextField";

interface MaterialInputProps extends Omit<TextFieldProps, 'variant'> { // Extend from Material-UI's TextFieldProps
  label: string;
}

const MaterialInput: React.FC<MaterialInputProps> = ({ label, ...props }) => {
  return (
    <TextField
      label={label}
      variant="outlined" // Specify the variant explicitly
      fullWidth // Optional: Ensures the input spans the full width
      {...props} // Spread any additional valid props
    />
  );
};

export default MaterialInput;
