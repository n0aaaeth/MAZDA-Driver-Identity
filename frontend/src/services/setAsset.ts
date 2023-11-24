import { Contract, providers } from "ethers";
import { config } from "../config/config";
import { erc6551AccountAbi } from "../abi/erc6551AccountAbi";
import {
  MetaTransactionData,
  MetaTransactionOptions,
  OperationType,
} from "@safe-global/safe-core-sdk-types";
import { GelatoRelayPack } from "zkatana-gelato-relay-kit";
import AccountAbstraction from "zkatana-gelato-account-abstraction-kit";

type SetAssetParams =  {
  provider: providers.Web3Provider | null;
  tba: string | null;
  tokenId: number[];
  states: boolean[];
}

export const setAsset = async ({
  provider,
  tba,
  tokenId,
  states,
}: SetAssetParams) => {
  if (!provider) {
    throw new Error("Provider is null or undefined.");
  }

  try {
    const signer = provider.getSigner();
    const contract = new Contract(tba!, erc6551AccountAbi, signer);

    const { data: dataCounter } = await contract.populateTransaction.setAsset(
      config.colorAddress,
      tokenId,
      states
    );
    if (!dataCounter) {
      throw new Error('Failed to get transaction data.');
    }

    const safeTransactions: MetaTransactionData[] = [{
      to: tba!,
      data: dataCounter,
      value: "0",
      operation: OperationType.Call,
    }];

    const options: MetaTransactionOptions = {
      gasLimit: "10000000",
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
    console.error("Error in setAsset function:", error);
    throw error; 
  }
};
