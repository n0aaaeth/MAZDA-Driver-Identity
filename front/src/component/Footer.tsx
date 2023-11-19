import { Button, Grid, Stack, Typography } from "@mui/material";
import { FC } from "react";
import ActivityIcon from "../assets/img/activity-icon.png";
import CarIcon from "../assets/img/car-icon.png";
import MapIcon from "../assets/img/map-icon.png";
import { useNavigate } from "react-router-dom";

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
    path: "/map",
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
      <Stack spacing={0.5} alignItems="center">
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
  const gridValue = 12 / menuItemArray.length;

  return (
    <Grid
      container
      sx={{
        p: 2,
        bgcolor: "primary.dark",
      }}
    >
      {menuItemArray.map((item) => {
        const { label, icon, path } = item;
        const changePath = () => {
          router(path);
        };
        return (
          <Grid key={item.path} item xs={gridValue}>
            <Stack alignItems="center">
              <MenuItem label={label} icon={icon} onClick={changePath} />
            </Stack>
          </Grid>
        );
      })}
    </Grid>
  );
};
