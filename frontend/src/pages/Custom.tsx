import { Box, Typography } from "@mui/material";
import { PrimaryLayout } from "../component/layout/PrimaryLayout";
import { FC, useCallback, useState } from "react";
import { useDiscloser } from "../hooks/useDiscloser";
import { PrimaryModal } from "../component/modal/PrimaryModal";
import LockIcon from "@mui/icons-material/Lock";
import { userStateAtom } from "../store/useState";
import { useRecoilValue } from "recoil";
import { setAsset } from "../services/setAsset";
import { fetchGelatoRelayStatus } from "../services/fetchGelatoRelayStatus";
import { isAssetSet } from "../services/getIsAsset";
import { config } from "../config/config";
import { Notification } from "../component/notification/Notification";

export const Custom: FC = () => {
  const userState = useRecoilValue(userStateAtom);
  const [isOpen, onClose, onOpen] = useDiscloser(false);
  const [selectedColor, setSelectedColor] = useState({
    color: "Black",
    image: "../assets/color-black.png",
  });
  const [newColor, setNewColor] = useState({
    color: selectedColor.color,
    image: selectedColor.image,
  });

  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const openSnackbar = useCallback((message: string, severity: string) => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar({ ...snackbar, open: false });
  }, [snackbar]);

  const handleImageClick = (color: string, image: string) => {
    setNewColor({
      color: color,
      image: image,
    });
    onOpen();
  };

  const tokenToImageMap = {
    1: "../assets/car-light-black.png",
    2: "../assets/car-light-navy.png",
    3: "../assets/car-light-red.png",
  };

  const getImageSrc = () => {
    if (selectedColor.color === "Black") {
      return tokenToImageMap[1];
    } else if (selectedColor.color === "Navy") {
      return tokenToImageMap[2];
    } else if (selectedColor.color === "Red") {
      return tokenToImageMap[3];
    } else {
      return "../assets/car-light-black.png"; 
    }
  };

  const colorToTokenIdMap: any = {
    Black: 1,
    Navy: 2,
    Red: 3,
  };

  const handleSetAsset = async (
    newColorName: string,
    newColorImage: string
) => {
    console.log("Task start");
    setLoading(true);

    const currentColorTokenId = colorToTokenIdMap[selectedColor.color];
    const newColorTokenId = colorToTokenIdMap[newColorName];

    let tokenIds = [currentColorTokenId, newColorTokenId];
    let states = [false, true];

    try {
        const response = await setAsset({
            userState: userState,
            tba: userState.tba,
            tokenId: tokenIds,
            state: states,
        });

        const status = await fetchGelatoRelayStatus(response);
        console.log("Task succeeded:", status);

        // Check if asset is set correctly
        const isSet = await isAssetSet({
            userState: userState,
            tba: userState.tba,
            contractAddress: config.colorAddress,
            tokenId: tokenIds,
        });

        const tokenToColorMap: { [key: number]: string } = {
          1: "Black",
          2: "Navy",
          3: "Red",
        };        

        console.log("ERC6551M SetAsset Processing:");
        for (let i = 0; i < tokenIds.length; i++) {
            const color = tokenToColorMap[tokenIds[i]];
            console.log(`Token ID ${tokenIds[i]} (Color: ${color}) Attachment Status: ${isSet[i]}`);
        }

        // Check if both the current color is unset and the new color is set
        if (isSet.every((value: any, index: any) => value === states[index])) {
            openSnackbar(`カラーNFTの装着に成功しました`, "success");
            setSelectedColor({
                color: newColorName,
                image: newColorImage,
            });
        }
    } catch (error) {
        console.error("An error occurred:", error);
        openSnackbar("カラーNFTの装着が失敗しました", "error");
    } finally {
        setLoading(false);
    }

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
            src={getImageSrc()}
            alt="Car"
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
              ボディーカラー
            </Typography>
            <Box display="flex" alignItems="center" mt={2}>
              <Box
                position="relative"
                marginRight="15px"
                onClick={() =>
                  handleImageClick("Black", "../assets/color-black.png")
                }
              >
                <img
                  src="../assets/color-black.png"
                  alt="Astar"
                  style={{
                    height: "50px",
                    borderRadius:
                      selectedColor.color === "Black" ? "50%" : "4px",
                    border:
                      selectedColor.color === "Black"
                        ? "2px solid white"
                        : "none",
                  }}
                />
              </Box>
              <Box
                position="relative"
                marginRight="15px"
                onClick={() =>
                  handleImageClick("Navy", "../assets/color-navy.png")
                }
              >
                <img
                  src="../assets/color-navy.png"
                  alt="Astar"
                  style={{
                    height: "50px",
                    borderRadius:
                      selectedColor.color === "Navy" ? "50%" : "4px",
                    border:
                      selectedColor.color === "Navy"
                        ? "2px solid white"
                        : "none",
                  }}
                />
              </Box>
              <Box
                position="relative"
                marginRight="15px"
                onClick={() =>
                  handleImageClick("Red", "../assets/color-red.png")
                }
              >
                <img
                  src="../assets/color-red.png"
                  alt="Astar"
                  style={{
                    height: "50px",
                    borderRadius: selectedColor.color === "Red" ? "50%" : "4px",
                    border:
                      selectedColor.color === "Red"
                        ? "2px solid white"
                        : "none",
                  }}
                />
              </Box>
              <Box
                position="relative"
                marginRight="15px"
                // onClick={() => handleImageClick("red")}
              >
                <img
                  src="../assets/color-astar.png"
                  alt="Astar"
                  style={{
                    height: "50px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "95%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LockIcon
                    style={{
                      color: "white",
                      fontSize: "20px",
                    }}
                  />
                </div>
              </Box>
            </Box>
          </Box>
          <Box mt={4}>
            <Typography
              variant="h1"
              sx={{
                color: "secondary.main",
                fontWeight: "bold",
                fontFamily: "Mazda Type Regular",
                fontSize: "18px",
              }}
            >
              ホイール
            </Typography>

            <Box display="flex" alignItems="center" mt={2}>
              <Box position="relative" marginRight="15px">
                <img
                  src="../assets/wheel-type1.png"
                  alt="Astar"
                  style={{
                    height: "70px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LockIcon
                    style={{
                      color: "white",
                      fontSize: "20px",
                    }}
                  />
                </div>
              </Box>
              <Box position="relative" marginRight="15px">
                <img
                  src="../assets/wheel-type1.png"
                  alt="Astar"
                  style={{
                    height: "70px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LockIcon
                    style={{
                      color: "white",
                      fontSize: "20px",
                    }}
                  />
                </div>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <PrimaryModal
        isOpen={isOpen}
        onClose={onClose}
        titleLabel="カラーを変更しますか？"
        buttonLabel="変更する（署名する)"
        onSubmitClick={() => handleSetAsset(newColor.color, newColor.image)}
        loading={loading}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box display="flex" alignItems="center">
            <Box textAlign="center">
              <Typography mb={1}>{selectedColor.color}</Typography>
              <img
                src={selectedColor.image}
                alt="Astar"
                style={{
                  height: "50px",
                }}
              />
            </Box>
            <Box mx={3}>
              <Typography fontSize="25px">➡️</Typography>
            </Box>
            <Box textAlign="center">
              <Typography mb={1}>{newColor.color}</Typography>
              <img
                src={newColor.image}
                alt="Astar"
                style={{
                  height: "50px",
                }}
              />
            </Box>
          </Box>
        </Box>
      </PrimaryModal>
      <Notification
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />
    </PrimaryLayout>
  );
};
