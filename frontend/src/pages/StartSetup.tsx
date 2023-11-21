import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { FC, useCallback, useState } from "react";
import { StepModal } from "../component/modal/StepModal";
import { fetchGelatoRelayStatus } from "../services/fetchGelatoRelayStatus";
import { createContractInstance } from "../util/createContractInstance";
import { config } from "../config/config";
import { myCarAbi } from "../abi/myCarAbi";
import { useRecoilValue } from "recoil";
import { userStateAtom } from "../store/useState";
import { mintMyCarNFT } from "../services/mintMyCar";
import { Notification } from "../component/notification/Notification";
import { Contract, ethers } from "ethers";
import { createTBA } from "../services/createTBA";
import { getTBA } from "../services/getTBA";
import { mintColorNFT } from "../services/mintColor";
import { setAsset } from "../services/setAsset";
import { isAssetSet } from "../services/getIsAsset";

export const StartSetup: FC = () => {
  const userState = useRecoilValue(userStateAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [tokenMintedId, setTokenMintedId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tba, setTba] = useState("");

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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleMintMyCarNFT = async () => {
    setLoading(true);
    try {
      const response = await mintMyCarNFT({
        userState: userState,
      });
      const status = await fetchGelatoRelayStatus(response);
      console.log("Task succeeded:", status);
      const tokenId = await listenForTokenMinted();
      setTokenMintedId(Number(tokenId));
      openSnackbar(
        `モデルの取得に成功しました : Token ID ${tokenId}`,
        "success"
      );
    } catch (error) {
      console.error("An error occurred:", error);
      openSnackbar("モデルの取得に失敗しました", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTBA = async () => {
    setLoading(true);
    try {
      const response = await createTBA({
        userState: userState,
        userHoldTokenId: Number(tokenMintedId),
      });
      const status = await fetchGelatoRelayStatus(response);
      const tba = await getTBA({
        userState: userState,
        userHoldTokenId: Number(tokenMintedId),
      });
      setTba(tba);
      console.log("Task succeeded:", status);
      openSnackbar(`TBAの作成に成功しました : Address ${tba}`, "success");
    } catch (error) {
      console.error("An error occurred:", error);
      openSnackbar("TBAの作成に失敗しました", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMintColorNFT = async () => {
    setLoading(true);
    console.log(tba)
    try {
      const response = await mintColorNFT({
        userState: userState,
        to: tba,
        tokenId: 1,
        amount: 1,
      });
      const status = await fetchGelatoRelayStatus(response);
      console.log("Task succeeded:", status);
      openSnackbar(`カラーNFTの取得に成功しました`, "success");
    } catch (error) {
      console.error("An error occurred:", error);
      openSnackbar("カラーNFTの取得が失敗しました", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSetColorNFT = async () => {
    setLoading(true);
    try {
      const response = await setAsset({
        userState: userState,
        tba: tba,
        tokenId: 1,
        state: true,
      });
      const status = await fetchGelatoRelayStatus(response);
      console.log("Task succeeded:", status);
      const isSet = await isAssetSet({
        userState: userState,
        tba: tba,
        contractAddress: config.colorAddress,
        tokenId: 1,
      });
      console.log(isSet)
      if (isSet) {
        openSnackbar(`カラーNFTの装着に成功しました`, "success");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      openSnackbar("カラーNFTの装着が失敗しました", "error");
    } finally {
      setLoading(false);
    }
  };

  // Assuming createContractInstance is an async function that returns a Promise<Contract>
  const listenForTokenMinted = async (): Promise<string> => {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const myCarContract: Contract = await createContractInstance(
          config.myCarAddress,
          myCarAbi,
          userState.provider!
        );

        const eventFilter = myCarContract.filters.TokenMinted();
        myCarContract.once(
          eventFilter,
          (to: string, tokenId: ethers.BigNumber) => {
            console.log(
              `Token with ID ${tokenId.toString()} was minted to address ${to}`
            );
            resolve(tokenId.toString()); 
          }
        );
      } catch (error) {
        console.error(
          "Failed to set up listener for TokenMinted event:",
          error
        );
        reject(error); 
      }
    });
  };

  // const handleIsAsset = async () => {
  //   const status = await isAssetSet({
  //     userState: userState,
  //     tba: tba,
  //     contractAddress: config.colorAddress,
  //     tokenId: 1,
  //   });
  //   console.log(status)
  // };

  return (
    <Container
      disableGutters
      maxWidth="xs"
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "primary.main",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "text.primary",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography
          variant="h5"
          sx={{
            color: "secondary.main",
            fontWeight: "bold",
            fontFamily: "Mazda Type Regular",
          }}
        >
          MAZDA Driver Identity
        </Typography>
        <img
          src="../assets/astar-logo.png"
          alt="Astar"
          style={{
            height: "30px",
          }}
        />
      </Stack>
      <Box sx={{ mb: 20 }} />
      <Box
        component="img"
        sx={{
          height: 75,
          width: 200,
        }}
        alt="MAZDA car"
        src="../assets/car-black.png"
      />
      <Typography
        sx={{
          fontSize: "20px",
          color: "secondary.main",
          fontFamily: "Mazda Type Regular",
          mt: 2,
        }}
      >
        NOMAL - S
      </Typography>
      <Box sx={{ mb: 20 }} />
      <Button
        variant="contained"
        sx={{
          border: "1px solid #929292",
          color: "#929292",
          width: "280px",
          height: "45px",
          borderRadius: "0px",
          "&:hover": {
            color: "secondary.main",
          },
        }}
        onClick={handleOpenModal}
      >
        初期設定をはじめる
      </Button>
      <StepModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        handleMintMyCarNFT={handleMintMyCarNFT}
        handleCreateTBA={handleCreateTBA}
        handleMintColorNFT={handleMintColorNFT}
        handleSetColorNFT={handleSetColorNFT}
      />
      <Notification
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />
    </Container>
  );
};
