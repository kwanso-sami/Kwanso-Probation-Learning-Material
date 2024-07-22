import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

const FormInputText = ({
  name,
  control,
  label,
  type="text",
  required = false,
  autoFocus = false,
  autoComplete=null,
  margin = "normal",
  size = "medium",
  fullWidth = true,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          margin={margin}
          required={required}
          fullWidth={fullWidth}
          size={size}
          type={type}
          label={label}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          error={!!error}
          helperText={error ? error.message : null}
        />
      )}
    />
  );
};

export default FormInputText;
