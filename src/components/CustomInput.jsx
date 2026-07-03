import { TextField } from "@mui/material";

export default function CustomInput({
  sx = {},
  ...props
}) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      sx={{
        mb: 3,

        "& .MuiOutlinedInput-root":
          {
            height: 58,

            borderRadius: "12px",

            backgroundColor:
              "#ffffff",

            "& fieldset": {
              borderColor:
                "#ece6e0",
            },

            "&:hover fieldset":
              {
                borderColor:
                  "#cf7d63",
              },

            "&.Mui-focused fieldset":
              {
                borderColor:
                  "#cf7d63",
                borderWidth: 2,
              },
          },

        "& .MuiInputBase-input":
          {
            fontSize: "16px",
          },

        ...sx,
      }}
      {...props}
    />
  );
}