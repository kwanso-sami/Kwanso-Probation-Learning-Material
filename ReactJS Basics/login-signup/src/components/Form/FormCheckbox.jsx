import { Controller } from "react-hook-form";
import { Checkbox, FormControlLabel } from "@mui/material";

const FormCheckbox = ({
  name,
  control,
  defaultValue = false,
  label,
  color = "primary",
  style=null
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormControlLabel
          control={<Checkbox {...field} color={color} />}
          label={label}
          sx={style}
        />
      )}
    />
  );
};

export default FormCheckbox;
