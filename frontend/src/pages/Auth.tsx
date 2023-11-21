import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Web3Auth } from "@web3auth/modal";
import { WALLET_ADAPTERS } from "@web3auth/base";
import { ethers, providers } from "ethers";
import { FC } from "react";

import { useNavigate } from "react-router-dom";
import AccountAbstraction, {
  AccountAbstractionConfig,
} from "zkatana-gelato-account-abstraction-kit";
import { GelatoRelayPack } from "zkatana-gelato-relay-kit";
import { useUpdateState } from "../hooks/useUpdateGlobalState";
import { config } from "../config/config";

export const Auth: FC = () => {
  const router = useNavigate();
  const { updateUserState } = useUpdateState();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const web3auth = new Web3Auth({
        clientId:
          "BOAPXOm3gNW72Bn8ywnRYDVCX2_DKL_HvjgNCZyl7tzkYebcZ3YY0Jj0sWDQksXsSqwdhtrrIbNxPd-NPcR4ExQ", // get it from Web3Auth Dashboard
        web3AuthNetwork: "sapphire_devnet",
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
      updateUserInfo(provider, web3auth);
      const user = await web3auth!.getUserInfo();
      console.log(user);

      navigate("/");
      return;
    } catch (error) {
      console.error(error);
    }
  };

  const updateUserInfo = async (
    provider: providers.Web3Provider,
    web3auth: Web3Auth
  ) => {
    const signer = await provider?.getSigner();
    const signerAddress = (await signer?.getAddress()) as string;
    const safe = await getSafeAddress(provider, signer);

    updateUserState({
      web3auth: web3auth,
      provider: provider,
      signerAddress: signerAddress,
      signer: signer,
      safe: safe,
    });
    // await getCounter(provider, safeAddress);
  };

  const getSafeAddress = async (provider: any, signer?: any) => {
    const relayPack = new GelatoRelayPack(config.gelatoRelayApiKey);
    const safeAccountAbstraction = new AccountAbstraction(signer!);
    const sdkConfig: AccountAbstractionConfig = {
      relayPack,
    };
    await safeAccountAbstraction.init(sdkConfig);

    const safeAddress = await safeAccountAbstraction.getSafeAddress();
    const isDeployed = await safeAccountAbstraction.isSafeDeployed();
    console.log(safeAddress, isDeployed);

    return safeAddress;
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
