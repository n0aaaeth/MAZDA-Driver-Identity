import { Box } from "@mui/material";
import { PrimaryLayout } from "../component/layout/PrimaryLayout";
import { FC } from "react";
import { useDiscloser } from "../hooks/useDiscloser";
import { PrimaryModal } from "../component/modal/PrimaryModal";

export const Map: FC = () => {
  const [isOpen, onClose] = useDiscloser(true);

  return (
    <PrimaryLayout>
      <Box sx={{ bgcolor: "white" }}>MapContent</Box>
      <PrimaryModal
        isOpen={isOpen}
        onClose={onClose}
        titleLabel="ドライブモードに切り替えますか？"
        buttonLabel="切り替える"
        onSubmitClick={onClose}
      >
        切り替えると、セッションキーが発行され、署名なしにアイテムを受け取る(トランザクションの発行)ことができます。
      </PrimaryModal>
    </PrimaryLayout>
  );
};
