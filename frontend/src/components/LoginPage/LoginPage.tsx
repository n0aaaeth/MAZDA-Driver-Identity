import { ethers, providers } from "ethers";
import { WALLET_ADAPTERS } from "@web3auth/base";

import AccountAbstraction, {
  AccountAbstractionConfig,
} from "zkatana-gelato-account-abstraction-kit";

import { GelatoRelayPack } from "zkatana-gelato-relay-kit";

import { Web3Auth } from "@web3auth/modal";
import { Box, Button, Flex, Heading, Switch } from "@chakra-ui/react";
import { useUpdateState } from "../../hooks/useUpdateGlobalState";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  
  const GELATO_RELAY_API_KEY = "mng8HNXVY3v3FycYZ56R73j9_tVisAqULNhUfHhM0N4_";
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

      navigate('/mypage');
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
    const relayPack = new GelatoRelayPack(GELATO_RELAY_API_KEY);
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
    <Flex direction="column" align="center" justify="center" height="100vh">
      <Heading>MAZDA Driver Identity</Heading>
      <Box height="30px" />
      <Button onClick={handleLogin}>ログイン</Button>
    </Flex>
  );
};

export default LoginPage;
