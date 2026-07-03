
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function StatCard({
  title,
  value,
  color,
}) {
  return (
    <Card
      sx={{
        borderRadius: 5,
        height: "100%",
        boxShadow:
          "0 10px 25px rgba(0,0,0,.05)",
        transition: ".3s",

        "&:hover": {
          transform: "translateY(-5px)",
        },
      }}
    >
      <CardContent>
        <Typography
          color="text.secondary"
          sx={{
            mb: 1,
          }}
        >
          {title}
        </Typography>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              color,
            }}
          >
            {value}
          </Typography>

          <Box
            sx={{
              width: 45,
              height: 45,
              borderRadius: "50%",
              background: color,
              opacity: 0.2,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

