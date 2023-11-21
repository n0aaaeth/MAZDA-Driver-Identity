import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

export const GetColor: FC = () => {
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
          src="../assets/astar-logo.png"
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
        src="../assets/car-black.png"
      />
       <Typography
          sx={{
            fontSize: "23px",
            color: "secondary.main",
            fontFamily: "Mazda Type Regular",
            mt: 2
          }}
        >
          NOMAL - S
        </Typography>
      <Box sx={{ mb: 20 }} />
      <Button
        variant="contained"
        sx={{
          border: "1px solid #929292",
          color: "#929292",
          width: "280px",
          height: "45px",
          borderRadius: "0px",
          "&:hover": {
            color: "secondary.main",
          },
        }}
        onClick={() => router("/custom")}
      >
        TBAに初期カラーを取得/設定
      </Button>
    </Container>
  );
};
