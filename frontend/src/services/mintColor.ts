import { Contract, providers } from "ethers";
import { config } from "../config/config";
import { colorAbi } from "../abi/colorAbi";
import {
  MetaTransactionData,
  MetaTransactionOptions,
  OperationType,
} from "@safe-global/safe-core-sdk-types";
import { GelatoRelayPack } from "zkatana-gelato-relay-kit";
import AccountAbstraction, {
  AccountAbstractionConfig,
} from "zkatana-gelato-account-abstraction-kit";

type MintMyColorParams =  {
  provider: providers.Web3Provider | null;
  to: string | null;
  tokenId: number[];
  amount: number[];
}

export const mintColorNFT = async ({
  provider,
  to,
  tokenId,
  amount,
}: MintMyColorParams) => {
  if (!provider) {
    throw new Error("Provider is null or undefined.");
  }

  try {
    const signer = provider.getSigner();
    const contract = new Contract(config.colorAddress, colorAbi, signer);

    const { data: dataCounter } = await contract.populateTransaction.mintBatch(to, tokenId, amount);
    if (!dataCounter) {
      throw new Error('Failed to get populated transaction data.');
    }

    const gasLimit = "10000000";
    const safeTransactions: MetaTransactionData[] = [{
      to: config.colorAddress,
      data: dataCounter,
      value: "0",
      operation: OperationType.Call,
    }];

    const options: MetaTransactionOptions = {
      gasLimit: gasLimit,
      isSponsored: true,
    };

    const relayPack = new GelatoRelayPack(config.gelatoRelayApiKey);
    const safeAccountAbstraction = new AccountAbstraction(signer);
    const sdkConfig: AccountAbstractionConfig = { relayPack };
    await safeAccountAbstraction.init(sdkConfig);

    const response = await safeAccountAbstraction.relayTransaction(safeTransactions, options);
    console.log(`https://relay.gelato.digital/tasks/status/${response}`);
    return response;
  } catch (error) {
    console.error("Error in mintColorNFT:", error);
    throw error; 
  }
};
