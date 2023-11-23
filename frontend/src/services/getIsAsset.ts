import { Contract } from "ethers";
import { erc6551AccountAbi } from "../abi/erc6551AccountAbi";

export const isAssetSet = async ({
  userState,
  tba,
  contractAddress,
  tokenId,
}: any) => {
  const contract = new Contract(
    tba,
    erc6551AccountAbi,
    userState.provider!.getSigner()
  );

  const status = await contract.isAssetSet(contractAddress, tokenId);
  return status;
};
