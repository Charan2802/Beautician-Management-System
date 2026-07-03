import { createTheme } from "@mui/material/styles";
import colors from "./colors";

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
    },

    secondary: {
      main: colors.secondary,
    },

    background: {
      default: colors.background,
      paper: colors.surface,
    },
  },

  typography: {
    fontFamily:
      '"Poppins","Inter","Roboto",sans-serif',

    h4: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 600,
    },

    h6: {
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 18,
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow:
            "0px 10px 30px rgba(0,0,0,0.08)",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 20px",
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          background: "#fff",
        },
      },
    },
  },
});

export default theme;