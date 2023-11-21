import { TextField } from "@mui/material";
import React from "react";

export default function TextFieldWithStyle({ field, ...props }) {
  return (
    <TextField
      {...field}
      required
      id="outlined-basic"
      variant="outlined"
      size="small"
      fullWidth
      sx={{
        borderLeft: "3px solid red",
        borderRadius: "8px",
        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
          borderLeftColor: "transparent",
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            borderLeftColor: "transparent",
          },
        ...props.sx,
      }}
      inputProps={{
        style: {
          textAlign: "right",
        },
      }}
    />
  );
}
