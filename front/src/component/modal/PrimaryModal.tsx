import { Box, Button, Stack, Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import { CommonModal } from "./CommonModal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  titleLabel: string;
  buttonLabel: string;
  onSubmitClick: () => void;
};

export const PrimaryModal: FC<Props> = ({
  isOpen,
  onClose,
  children,
  titleLabel,
  buttonLabel,
  onSubmitClick,
}) => {
  return (
    <CommonModal isOpen={isOpen} onClose={onClose}>
      <Stack alignItems="center">
        <Typography
          sx={{
            width: "100%",
            fontWeight: "bold",
            borderBottom: "solid 1px",
            textAlign: "center",
            p: 2,
          }}
        >
          {titleLabel}
        </Typography>
        <Stack
          alignItems="center"
          sx={{
            p: 3,
          }}
        >
          <Box sx={{ p: 2 }}>{children}</Box>
          <Button variant="contained" onClick={onSubmitClick}>
            {buttonLabel}
          </Button>
        </Stack>
      </Stack>
    </CommonModal>
  );
};
