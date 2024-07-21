import React from "react";
import { Button } from "@mui/material";

const FormButton = ({
  text,
  type = "button",
  size = "medium",
  color = "primary",
  variant = "contained",
  fullWidth = false,
  style=null
}) => {
  return (
    <Button
      type={type}
      fullWidth={fullWidth}
      size={size}
      color={color}
      variant={variant}
      sx={style}
    >
      {text}
    </Button>
  );
};

export default FormButton;
