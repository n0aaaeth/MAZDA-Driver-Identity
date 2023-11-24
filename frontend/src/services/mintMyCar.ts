import { Contract, providers } from "ethers";
import { myCarAbi } from "../abi/myCarAbi";
import {
  MetaTransactionData,
  MetaTransactionOptions,
  OperationType,
} from "@safe-global/safe-core-sdk-types";
import { GelatoRelayPack } from "zkatana-gelato-relay-kit";
import AccountAbstraction from "zkatana-gelato-account-abstraction-kit";
import { config } from "../config/config";

type MintMyCarNFTParams =  {
  provider: providers.Web3Provider | null;
}

export const mintMyCarNFT = async ({
  provider,
}: MintMyCarNFTParams) => {
  if (!provider) {
    throw new Error("Provider is null or undefined.");
  }

  const signer = provider.getSigner();
  const contract = new Contract(config.myCarAddress, myCarAbi, signer);

  try {
    const { data: dataCounter } = await contract.populateTransaction.mint();
    if (!dataCounter) {
      throw new Error("Failed to get transaction data from contract.");
    }

    const gasLimit = "10000000";
    const safeTransactions: MetaTransactionData[] = [
      {
        to: config.myCarAddress,
        data: dataCounter,
        value: "0",
        operation: OperationType.Call,
      },
    ];

    const options: MetaTransactionOptions = {
      gasLimit: gasLimit,
      isSponsored: true,
    };

    const relayPack = new GelatoRelayPack(config.gelatoRelayApiKey);
    const safeAccountAbstraction = new AccountAbstraction(signer);
    await safeAccountAbstraction.init({ relayPack });

    const response = await safeAccountAbstraction.relayTransaction(
      safeTransactions,
      options
    );
    console.log(`https://relay.gelato.digital/tasks/status/${response}`);
    return response;
  } catch (error) {
    console.error("Error in mintMyCarNFT:", error);
    throw error; 
  }
};
