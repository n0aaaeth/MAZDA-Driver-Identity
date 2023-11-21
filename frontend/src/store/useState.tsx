import { atom } from "recoil";
import { Signer, providers } from "ethers";
import { Web3Auth } from "@web3auth/modal";

export const userStateAtom = atom<{
  signerAddress: string | null;
  provider: providers.Web3Provider | null;
  signer: Signer | null;
  safe: string | undefined;
  web3auth: Web3Auth | null;
  tba: string;
}>({
  key: "userState",
  default: {
    signerAddress: "",
    provider: null,
    signer: null,
    safe: "",
    web3auth: null,
    tba: ""
  },
  dangerouslyAllowMutability: true,
});
