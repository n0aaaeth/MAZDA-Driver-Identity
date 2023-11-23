import { Contract, ethers } from "ethers";
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

export const mintColorNFT = async ({ userState, to, tokenId, amount }: any) => {
  try {
    const contract = new Contract(
      config.colorAddress,
      colorAbi,
      userState.provider.getSigner()
    );

    // console.log(tokenId)
    // console.log(amount)
    const { data: dataCounter } = await contract!.populateTransaction.mintBatch(
      to,
      tokenId,
      amount
    );
    const gasLimit = "10000000";
    const txConfig = {
      to: config.colorAddress,
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
