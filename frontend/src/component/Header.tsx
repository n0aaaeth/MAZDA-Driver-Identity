import { IconButton, Stack, Typography } from "@mui/material";
import { FC } from "react";
import MenuIcon from "@mui/icons-material/Menu";

export const Header: FC = () => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        bgcolor: "primary.light",
        pl: 2,
        pr: 2,
        pt: 1,
        pb: 1,
        top: 0,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} >
        <Typography
          variant="h1"
          sx={{
            color: "secondary.main",
            fontWeight: "bold",
            fontFamily: "Mazda Type Regular",
            fontSize: "20px"
          }}
        >
          MAZDA Driver Identity
        </Typography>
        <img
          src="../assets/astar-logo.png"
          alt="Astar"
          style={{
            height: "30px",
          }}
        />
      </Stack>
      <IconButton
        sx={{
          color: "secondary.light",
        }}
      >
        <MenuIcon fontSize="large" />
      </IconButton>
    </Stack>
  );
};
