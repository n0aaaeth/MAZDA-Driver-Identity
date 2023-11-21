import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { theme } from "../theme/theme";

const secondaryMain = theme.palette.secondary.main;
const primaryDark = theme.palette.primary.dark;

type MenuContentType = {
  label: string;
  icon: JSX.Element;
  path: string;
};

const IconWrapper: FC<{
  src: string;
  alt: string;
}> = ({ src, alt }) => {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        height: "30px",
        width: "30px",
      }}
    />
  );
};

const menuItemArray: MenuContentType[] = [
  {
    label: "カスタム",
    icon: <IconWrapper src="../assets/car-icon.png" alt="カスタム" />,
    path: "/custom",
  },
  {
    label: "マップ",
    icon: <IconWrapper src="../assets/map-icon.png" alt="マップ" />,
    path: "/map",
  },
  {
    label: "アクティビィティ",
    icon: <IconWrapper src="../assets/activity-icon.png" alt="アクティビィティ" />,
    path: "/activity",
  },
];

const MenuItem: FC<
  Omit<MenuContentType, "path"> & {
    onClick: () => void;
  }
> = ({ label, icon, onClick }) => {
  return (
    <Button onClick={onClick}>
      <Stack spacing={0.3} alignItems="center">
        {icon}
        <Typography variant="caption" sx={{ color: "secondary.main" }}>
          {label}
        </Typography>
      </Stack>
    </Button>
  );
};

export const Footer: FC = () => {
  const router = useNavigate();
  const currentPath = useLocation().pathname;
  const gridValue = 12 / menuItemArray.length;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
      }}
    >
      <Container maxWidth="xs" disableGutters sx={{ p: 0 }}>
        <Grid container sx={{ bgcolor: "primary.dark" }}>
          {menuItemArray.map((item) => {
            const { label, icon, path } = item;
            const changePath = () => {
              router(path);
            };
            return (
              <Grid
                key={item.path}
                item
                xs={gridValue}
                sx={
                  currentPath === path
                    ? {
                        borderEndEndRadius: "3px",
                        borderEndStartRadius: "3px",
                        bgcolor: secondaryMain,
                        boxShadow: `0px 35px 30px 20px ${primaryDark} inset`,
                      }
                    : {}
                }
              >
                <Stack alignItems="center">
                  <MenuItem label={label} icon={icon} onClick={changePath} />
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};
