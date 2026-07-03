
import { Card, CardContent } from "@mui/material";

export default function CommonCard({
  children,
}) {
  return (
    <Card
      sx={{
        borderRadius: 5,
        boxShadow:
          "0 10px 25px rgba(0,0,0,.05)",
        height: "100%",
      }}
    >
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

