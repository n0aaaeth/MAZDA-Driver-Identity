import { Box, Modal } from "@mui/material";
import { FC, ReactNode } from "react";
import { modalStyle } from "../../styles/modalStyle";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const CommonModal: FC<Props> = ({ isOpen, onClose, children }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{ ...modalStyle }}>{children}</Box>
    </Modal>
  );
};
