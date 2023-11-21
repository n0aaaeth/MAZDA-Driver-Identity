import { Box } from "@mui/material";
import { PrimaryLayout } from "../component/layout/PrimaryLayout";
import { FC } from "react";

export const Activity: FC = () => {
  return (
    <PrimaryLayout>
      <Box sx={{ bgcolor: "white" }}>ActivityContent</Box>
    </PrimaryLayout>
  );
};
