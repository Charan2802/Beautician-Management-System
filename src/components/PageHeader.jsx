import { Card } from "@mui/material";

export default function CommonCard({
  children,
  sx = {},
}) {
  return (
    <Card
      sx={{
        borderRadius: 5,
        boxShadow:
          "0 10px 30px rgba(0,0,0,0.08)",
        p: 2,
        ...sx,
      }}
    >
      {children}
    </Card>
  );
}