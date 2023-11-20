import { Button, Grid, Stack, Typography } from "@mui/material";
import { FC } from "react";
import ActivityIcon from "../assets/img/activity-icon.png";
import CarIcon from "../assets/img/car-icon.png";
import MapIcon from "../assets/img/map-icon.png";
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
        height: "35px",
        width: "35px",
      }}
    />
  );
};

const menuItemArray: MenuContentType[] = [
  {
    label: "カスタム",
    icon: <IconWrapper src={CarIcon} alt="カスタム" />,
    path: "/custom",
  },
  {
    label: "マップ",
    icon: <IconWrapper src={MapIcon} alt="マップ" />,
    path: "/",
  },
  {
    label: "アクティビィティ",
    icon: <IconWrapper src={ActivityIcon} alt="アクティビィティ" />,
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
    <Grid
      container
      sx={{
        position: "fixed",
        bottom: 0,
        pt: 0.5,
        bgcolor: "primary.dark",
        width: "100vw",
      }}
    >
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
  );
};
