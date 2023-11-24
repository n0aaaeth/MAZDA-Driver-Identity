import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { FC, useCallback, useState } from "react";
import { StepModal } from "../component/modal/StepModal";
import { getGelatoRelayStatus } from "../services/getGelatoRelayStatus";
import { config } from "../config/config";
import { myCarAbi } from "../abi/myCarAbi";
import { useRecoilValue } from "recoil";
import { mintMyCarNFT } from "../services/mintMyCar";
import { Notification } from "../component/notification/Notification";
import { Contract, ethers } from "ethers";
import { getTBA } from "../services/getTBA";
import { mintColorNFT } from "../services/mintColor";
import { setAsset } from "../services/setAsset";
import { isAssetSet } from "../services/getIsAsset";
import { web3StateAtom } from "../store/web3State";
import { useUpdateWeb3State } from "../hooks/useUpdateWeb3State";
import { createTBA } from "../services/createTBA";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: 'info' | 'success' | 'error' | 'warning';
};

export const Setup: FC = () => {
  const web3State = useRecoilValue(web3StateAtom);
  const {updateWeb3State} = useUpdateWeb3State();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokenMintedId, setTokenMintedId] = useState<number | null>(null);
  const [tba, setTba] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });

  const openSnackbar = useCallback((message: string, severity: SnackbarState['severity']) => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleMintMyCarNFT = async () => {
    setLoading(true);
    console.log("Task start");
    try {
      const response = await mintMyCarNFT({
        provider: web3State.provider,
      });
      const status = await getGelatoRelayStatus({
        taskIdToQuery: response
      });
      console.log("Task succeeded:", status);
      const tokenId = await listenForTokenMinted();
      console.log(`Minted Token ID: ${tokenId}`);
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

  const listenForTokenMinted = async () => {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const myCarContract = new Contract(
          config.myCarAddress,
          myCarAbi,
          web3State.provider!.getSigner()
        );

        const eventFilter = myCarContract.filters.TokenMinted();
        myCarContract.once(
          eventFilter,
          (to: string, tokenId: ethers.BigNumber) => {
            // console.log(
            //   `Token with ID ${tokenId.toString()} was minted to address ${to}`
            // );
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

  const handleCreateTBA = async () => {
    setLoading(true);
    console.log("Task start");
    try {
      const response = await createTBA({
        provider: web3State.provider,
        userHoldTokenId: Number(tokenMintedId),
      });
      const status = await getGelatoRelayStatus({
        taskIdToQuery: response
      });
      const tba = await getTBA({
        provider: web3State.provider,
        userHoldTokenId: Number(tokenMintedId),
      });
      setTba(tba);
      updateWeb3State({
        tba: tba
      })
      console.log("Task succeeded:", status);
      console.log(`Token Bound Accounts: ${tba}`);
      openSnackbar(`TBAの作成に成功しました: ${tba}`, "success");
    } catch (error) {
      console.error("An error occurred:", error);
      openSnackbar("TBAの作成に失敗しました", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMintColorNFT = async () => {
    setLoading(true);
    console.log("Task start");
    try {
      const response = await mintColorNFT({
        provider: web3State.provider,
        to: tba,
        tokenId: [1,2,3],
        amount: [1,1,1],
      });
      const status = await getGelatoRelayStatus({
        taskIdToQuery: response
      });
      console.log("Task succeeded:", status);
      openSnackbar(`車体のボディーカラーNFTの取得に成功しました`, "success");
    } catch (error) {
      console.error("An error occurred:", error);
      openSnackbar("車体のカラーNFTの取得が失敗しました", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSetColorNFT = async () => {
    setLoading(true);
    console.log("Task start");
    try {
      const response = await setAsset({
        provider: web3State.provider,
        tba: tba,
        tokenId: [1,2,3],
        states: [true,false,false],
      });
      const status = await getGelatoRelayStatus({
        taskIdToQuery: response
      });
      console.log("Task succeeded:", status);
      const isSet = await isAssetSet({
        provider: web3State.provider,
        tba: tba,
        contractAddress: config.colorAddress,
        tokenId: [1, 2, 3],
      });
      if (isSet) {
        openSnackbar(`車体のボディーカラーNFTの装着に成功しました`, "success");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      openSnackbar("車体のボディーカラーNFTの装着が失敗しました", "error");
    } finally {
      setLoading(false);
    }
  };

  // const handleLogout = async () => {
  //   await web3State.web3auth?.logout();
  //   navigate("/auth");
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
          alt="astar logo"
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
        alt="car black"
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
          color: "secondary.light",
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
     {/* <Button
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
        onClick={handleLogout}
      >
        ログアアウト
      </Button>  */}

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
