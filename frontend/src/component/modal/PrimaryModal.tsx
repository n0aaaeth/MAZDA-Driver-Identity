import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import { CommonModal } from "./CommonModal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  titleLabel: string;
  buttonLabel: string;
  onSubmitClick: () => void;
  isButtonDisabled?: boolean;
  loading?: boolean;
};

export const PrimaryModal: FC<Props> = ({
  isOpen,
  onClose,
  children,
  titleLabel,
  buttonLabel,
  onSubmitClick,
  isButtonDisabled = false,
  loading = false
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
          <Box sx={{ p: 2, mb: 3 }}>{children}</Box>
          <Button
            variant="contained"
            onClick={onSubmitClick}
            disabled={isButtonDisabled || loading} 
            sx={{ mt: 2 }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              buttonLabel
            )}
          </Button>
        </Stack>
      </Stack>
    </CommonModal>
  );
};
