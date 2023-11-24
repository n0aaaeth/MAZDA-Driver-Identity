import { Contract, providers } from "ethers";
import { config } from "../config/config";
import { erc6551RegistryAbi } from "../abi/erc6551RegistryAbi";

type GetTBAParams =  {
  provider: providers.Web3Provider | null;
  userHoldTokenId: number;
}

export const getTBA = async ({
  provider,
  userHoldTokenId,
}: GetTBAParams) => {
  if (!provider) {
    throw new Error("Provider is null or undefined.");
  }

  try {
    const contract = new Contract(
      config.erc6551RegistryAddress,
      erc6551RegistryAbi,
      provider.getSigner()
    );

    const accountAddress = await contract.account(
      config.erc6551AccountAddress,
      config.chainId,
      config.myCarAddress,
      userHoldTokenId,
      1
    );

    return accountAddress;
  } catch (error) {
    console.error("Error calling the account function:", error);
    throw error; 
  }
};
