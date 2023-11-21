import { Contract, ethers } from "ethers";
import { config } from "../config/config";
import {
  MetaTransactionData,
  MetaTransactionOptions,
  OperationType,
} from "@safe-global/safe-core-sdk-types";
import { GelatoRelayPack } from "zkatana-gelato-relay-kit";
import AccountAbstraction, {
  AccountAbstractionConfig,
} from "zkatana-gelato-account-abstraction-kit";
import { erc6551AccountAbi } from "../abi/erc6551AccountAbi";

export const setAsset = async ({ userState, tba, tokenId, state }: any) => {
  try {
    const contract = new Contract(
      tba,
      erc6551AccountAbi,
      userState.provider.getSigner()
    );

    const { data: dataCounter } = await contract!.populateTransaction.setAsset(
      config.colorAddress,
      tokenId,
      state
    );
    const gasLimit = "10000000";
    const txConfig = {
      to: tba,
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
    let web3AuthSigner = userState.signer;
    try {
      const privateKey = ("0x" +
        (await userState.web3auth!.provider!.request({
          method: "eth_private_key",
        }))) as string;
      web3AuthSigner = new ethers.Wallet(privateKey!, userState.provider!);
    } catch (error) {}
    const relayPack = new GelatoRelayPack(config.gelatoRelayApiKey);

    const safeAccountAbstraction = new AccountAbstraction(web3AuthSigner!);
    const sdkConfig: AccountAbstractionConfig = {
      relayPack,
    };
    await safeAccountAbstraction.init(sdkConfig);

    const response = await safeAccountAbstraction.relayTransaction(
      safeTransactions,
      options
    );

    console.log(`https://relay.gelato.digital/tasks/status/${response}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};
