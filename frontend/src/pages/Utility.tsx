import { Box, Typography } from "@mui/material";
import { PrimaryLayout } from "../component/layout/PrimaryLayout";
import { FC, useState } from "react";
import { useDiscloser } from "../hooks/useDiscloser";
import { PrimaryModal } from "../component/modal/PrimaryModal";

type ImageClickParams = {
  color: string;
  image: string;
};

type SetAssetParamas = {
  color: string;
  image: string;
};

export const Utility: FC = () => {
  const [isOpen, onClose, onOpen] = useDiscloser(false);
  const [selectedColor, setSelectedColor] = useState({
    color: "Black",
    image: "../assets/color-black.png",
  });
  const [newColor, setNewColor] = useState({
    color: selectedColor.color,
    image: selectedColor.image,
  });

  const handleImageClick = ({ color, image }: ImageClickParams) => {
    setNewColor({
      color: color,
      image: image,
    });
    onOpen();
  };

  const handleSetAsset = ({ color, image }: SetAssetParamas) => {
    setSelectedColor({
      color: color,
      image: image,
    });
    onClose();
  };

  return (
    <PrimaryLayout>
      <Box display="flex" flexDirection="column" height="100%">
        <Box
          width="100%"
          height="40%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <img
            src="../assets/item-icon.png"
            alt="Astar"
            style={{
              height: "180px",
              margin: "auto",
            }}
          />
        </Box>
        <Box
          height="60%"
          display="flex"
          justifyContent="flex-start"
          alignItems="flex-start"
          p={2}
          flexDirection="column"
          sx={{
            backgroundColor: "#000",
          }}
        >
          <Box>
            <Typography
              variant="h1"
              sx={{
                color: "secondary.main",
                fontWeight: "bold",
                fontFamily: "Mazda Type Regular",
                fontSize: "18px",
              }}
            >
              全ての報酬
            </Typography>
            <Box display="flex" alignItems="center" mt={2}>
              <Box
                position="relative"
                marginRight="15px"
                onClick={() =>
                  handleImageClick({
                    color: "Black",
                    image: "../assets/item-icon.png",
                  })
                }
              >
                <img
                  src="../assets/item-icon.png"
                  alt="Item"
                  style={{
                    height: "80px",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <PrimaryModal
        isOpen={isOpen}
        onClose={onClose}
        titleLabel="報酬を活用しますか？"
        buttonLabel="活用する（署名する）"
        onSubmitClick={() =>
          handleSetAsset({
            color: newColor.color,
            image: newColor.image,
          })
        }
      >
        <Box display="flex" alignItems="center">
          <img
            src="../assets/item-icon.png"
            alt="Item"
            style={{
              height: "80px",
            }}
          />
        </Box>
      </PrimaryModal>
    </PrimaryLayout>
  );
};
