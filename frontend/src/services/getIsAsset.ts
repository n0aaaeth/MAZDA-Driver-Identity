import { Contract, providers } from "ethers";
import { erc6551AccountAbi } from "../abi/erc6551AccountAbi";

type IsAssetSetParams =  {
  provider: providers.Web3Provider | null;
  tba: string | null;
  contractAddress: string;
  tokenId: number[];
}

export const isAssetSet = async ({
  provider,
  tba,
  contractAddress,
  tokenId,
}: IsAssetSetParams) => {
  if (!provider) {
    throw new Error("Provider is null or undefined.");
  }
  const signer = provider.getSigner();
  const contract = new Contract(tba!, erc6551AccountAbi, signer);

  try {
    const status = await contract.isAssetSet(contractAddress, tokenId);
    return status;
  } catch (error) {
    throw error;
  }
};
