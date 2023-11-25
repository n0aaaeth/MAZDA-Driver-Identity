import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Web3Auth } from "@web3auth/modal";
import { WALLET_ADAPTERS } from "@web3auth/base";
import { ethers } from "ethers";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../config/config";
import { useUpdateWeb3State } from "../hooks/useUpdateWeb3State";
import { getSafeAddress } from "../services/getSafeAddress";

export const Auth: FC = () => {
  const { updateWeb3State } = useUpdateWeb3State();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const web3auth = new Web3Auth({
        clientId: config.web3AuthClientId,
        web3AuthNetwork: "sapphire_mainnet",
        chainConfig: {
          chainNamespace: "eip155",
          chainId: "0x133e40",
          rpcTarget: "https://rpc.zkatana.gelato.digital",
          displayName: "zKatana Testnet",
          blockExplorer: "https://zkatana.blockscout.com",
          ticker: "ETH",
          tickerName: "ETH",
        },
      });
      await web3auth!.initModal({
        modalConfig: {
          [WALLET_ADAPTERS.WALLET_CONNECT_V2]: {
            label: "wallet_connect",
            showOnModal: false,
          },
          [WALLET_ADAPTERS.METAMASK]: {
            label: "metamask",
            showOnModal: false,
          },
          [WALLET_ADAPTERS.TORUS_EVM]: {
            label: "torus",
            showOnModal: false,
          },
        },
      });

      const web3authProvider = await web3auth!.connect();
      const provider = new ethers.providers.Web3Provider(web3authProvider!);
      await updateUserInfo(provider, web3auth);
      // const user = await web3auth!.getUserInfo();
      // console.log(":", user);
      navigate("/");
      return;
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const updateUserInfo = async (
    provider: ethers.providers.Web3Provider,
    web3auth: Web3Auth
  ) => {
    try {
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      const safe = await getSafeAddress({ provider: provider });
      console.log("Safe Address:", safe);

      updateWeb3State({
        web3auth,
        provider,
        signerAddress,
        safe,
      });
    } catch (error) {
      console.error("Failed to update user info:", error);
    }
  };

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
      <Box sx={{ mb: 20 }} />
      <Button
        variant="contained"
        sx={{
          backgroundColor: "secondary.main",
          color: "primary.dark",
          width: "280px",
          height: "45px",
          borderRadius: "0px",
          "&:hover": {
            color: "secondary.main",
          },
        }}
        onClick={handleLogin}
      >
        ログイン
      </Button>
    </Container>
  );
};
