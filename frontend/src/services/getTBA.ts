import { Contract } from "ethers";
import { config } from "../config/config";
import { erc6551RegistryAbi } from "../abi/erc6551RegistryAbi";

export const getTBA = async ({
  userState,
  userHoldTokenId,
}: any) => {
  try {
    const contract = new Contract(
      config.erc6551RegistryAddress,
      erc6551RegistryAbi,
      userState.provider.getSigner()
    );
    const accountAddress = await contract.account(
      config.erc6551AccountAddress,
      config.chainId,
      config.myCarAddress,
      userHoldTokenId,
      1
    );

    console.log("Account Address:", accountAddress);
    return accountAddress;
  } catch (error) {
    console.error("Error calling the account function:", error);
  }
};
