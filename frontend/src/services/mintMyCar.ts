import { Contract } from "ethers";
import { myCarAbi } from "../abi/myCarAbi";
import {
  MetaTransactionData,
  MetaTransactionOptions,
  OperationType,
} from "@safe-global/safe-core-sdk-types";
import { GelatoRelayPack } from "zkatana-gelato-relay-kit";
import AccountAbstraction from "zkatana-gelato-account-abstraction-kit";
import { config } from "../config/config";

export const mintMyCarNFT = async ({
  userState,
}: any) => {
  try {
    const contract = new Contract(config.myCarAddress, myCarAbi, userState.provider.getSigner());

    const { data: dataCounter } = await contract!.populateTransaction.mint();
    const gasLimit = "10000000";
    const txConfig = {
      to: config.myCarAddress,
      data: dataCounter!,
      value: "0",
      operation: 0,
      gasLimit,
    };
    const safeTransactions: MetaTransactionData[] = [
      {
        to: txConfig.to,
        data: txConfig.data,
        value: txConfig.value,
        operation: OperationType.Call,
      },
    ];
    const options: MetaTransactionOptions = {
      gasLimit: txConfig.gasLimit,
      isSponsored: true,
    };

    const relayPack = new GelatoRelayPack(config.gelatoRelayApiKey);
    const safeAccountAbstraction = new AccountAbstraction(userState.provider.getSigner());
    const sdkConfig = {
      relayPack,
    };

    await safeAccountAbstraction.init(sdkConfig);


    const response = await safeAccountAbstraction.relayTransaction(
      safeTransactions,
      options
    );

    console.log(`https://relay.gelato.digital/tasks/status/${response}`);

    return response;
  } catch (error: any) {
    console.error(error);
  }
};
