import React from "react";
import { Box, Container, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        background: "transparent",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        py: 2,
        boxShadow: "0 -4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Container maxWidth="lg">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <Typography sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
            © 2025 Rishita Gangwal
          </Typography>
        </div>
      </Container>
    </Box>
  );
};

export default Footer;
