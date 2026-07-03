import { Button } from "@mui/material";
import colors from "../theme/colors";

export default function CustomButton({
  children,
  sx = {},
  ...props
}) {
  return (
    <Button
      fullWidth
      variant="contained"
      sx={{
        height: 58,
        borderRadius: "12px",

        background:
          "linear-gradient(90deg,#cf7d63,#d88970)",

        color: "#fff",

        fontSize: "18px",
        fontWeight: 600,

        textTransform: "none",

        boxShadow:
          "0 10px 25px rgba(207,125,99,.25)",

        transition: "0.3s",

        "&:hover": {
          background:
            colors.primaryHover,
          transform:
            "translateY(-2px)",
        },

        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}