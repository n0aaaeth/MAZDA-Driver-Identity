import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { FC } from "react";

import carImage from "../assets/img/car-black.png";
import AstartLogo from "../assets/img/astar-logo.png";
import { useNavigate } from "react-router-dom";

export const Login: FC = () => {
    const router = useNavigate();
  return (

    <Container
      disableGutters
      maxWidth="xs"
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "primary.main",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "text.primary",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography
          variant="h5"
          sx={{
            color: "secondary.main",
            fontWeight: "bold",
            fontFamily: "Mazda Type Regular",
          }}
        >
          MAZDA Driver Identify
        </Typography>
        <img
          src={AstartLogo}
          alt="Astar"
          style={{
            height: "30px",
          }}
        />
      </Stack>
      <Box sx={{ mb: 20 }} />
      <Box
        component="img"
        sx={{
          height: 75,
          width: 200,
        }}
        alt="MAZDA car"
        src={carImage}
      />
      <Box sx={{ mb: 20 }} />
      <Button
        variant="contained"
        sx={{
          backgroundColor: "secondary.main",
          color: "primary.dark",
          width: "280px",
          height: "45px",
          borderRadius: "0px",
          '&:hover': {
            color: "secondary.main",
          },
        }}
        onClick={() => router("/model-select")}
      >
        ログイン
      </Button>
    </Container>
  );
};
