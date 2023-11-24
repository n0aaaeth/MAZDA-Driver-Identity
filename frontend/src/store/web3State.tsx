import { atom } from "recoil";
import { providers } from "ethers";
import { Web3Auth } from "@web3auth/modal";

export const web3StateAtom = atom<{
  signerAddress: string | null;
  provider: providers.Web3Provider | null;
  safe: string | undefined;
  web3auth: Web3Auth | null;
  tba: string;
}>({
  key: "web3State",
  default: {
    signerAddress: "",
    provider: null,
    safe: "",
    web3auth: null,
    tba: ""
  },
  dangerouslyAllowMutability: true,
});
