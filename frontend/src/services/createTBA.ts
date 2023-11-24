import { Contract, ethers } from "ethers";
import AccountAbstraction, {
  AccountAbstractionConfig,
} from "zkatana-gelato-account-abstraction-kit";
import { GelatoRelayPack } from "zkatana-gelato-relay-kit";
import { config } from "../config/config";
import { erc6551RegistryAbi } from "../abi/erc6551RegistryAbi";
import {
  MetaTransactionData,
  MetaTransactionOptions,
  OperationType,
} from "@safe-global/safe-core-sdk-types";

type CreateTBAParams =  {
  provider: ethers.providers.Web3Provider | null;
  userHoldTokenId: number;
}

export const createTBA = async ({
  provider,
  userHoldTokenId,
}: CreateTBAParams) => {
  if (!provider) throw new Error("Provider is null or undefined.");

  const signer = provider.getSigner();
  const contract = new Contract(
    config.erc6551RegistryAddress,
    erc6551RegistryAbi,
    signer
  );
  const gasLimit = ethers.BigNumber.from("10000000").toString();

  try {
    const { data } = await contract.populateTransaction.createAccount(
      config.erc6551AccountAddress,
      config.chainId,
      config.myCarAddress,
      userHoldTokenId,
      1,
      []
    );

    const safeTransactions: MetaTransactionData[] = [
      {
        to: config.erc6551RegistryAddress,
        data: data ?? "",
        value: "0",
        operation: OperationType.Call,
      },
    ];

    const options: MetaTransactionOptions = {
      gasLimit,
      isSponsored: true,
    };

    const relayPack = new GelatoRelayPack(config.gelatoRelayApiKey);
    const safeAccountAbstraction = new AccountAbstraction(signer);
    const sdkConfig: AccountAbstractionConfig = { relayPack };

    await safeAccountAbstraction.init(sdkConfig);
    const response = await safeAccountAbstraction.relayTransaction(
      safeTransactions,
      options
    );

    console.log(`https://relay.gelato.digital/tasks/status/${response}`);
    return response;
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
};
