import { Box } from "@mui/material";
import { PrimaryLayout } from "../component/layout/PrimaryLayout";
import { FC } from "react";
import { useDiscloser } from "../hooks/useDiscloser";
import { PrimaryModal } from "../component/modal/PrimaryModal";

export const Home: FC = () => {
  const [isOpen, onClose] = useDiscloser(true);

  return (
    <PrimaryLayout>
      <Box sx={{ bgcolor: "white" }}>HomeContent</Box>
      <PrimaryModal
        isOpen={isOpen}
        onClose={onClose}
        titleLabel="カラーを変更しますか？"
        buttonLabel="変更する（署名が発生します)"
        onSubmitClick={onClose}
      >
        ModalContent
      </PrimaryModal>
    </PrimaryLayout>
  );
};
