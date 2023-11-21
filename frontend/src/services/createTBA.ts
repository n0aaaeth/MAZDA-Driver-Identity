import { Contract, ethers } from "ethers";
import AccountAbstraction, { AccountAbstractionConfig } from "zkatana-gelato-account-abstraction-kit";
import { GelatoRelayPack } from "zkatana-gelato-relay-kit";
import { config } from "../config/config";
import { erc6551RegistryAbi } from "../abi/erc6551RegistryAbi";
import { MetaTransactionData, MetaTransactionOptions, OperationType } from "@safe-global/safe-core-sdk-types";

export const createTBA = async ({
    userState,
    userHoldTokenId,
  }: any) => {
    try {
      const contract = new Contract(config.erc6551RegistryAddress, erc6551RegistryAbi, userState.provider.getSigner());

      const { data: dataCounter } =
        await contract!.populateTransaction.createAccount(
          config.erc6551AccountAddress,
          config.chainId,
          config.myCarAddress,
          userHoldTokenId,
          1,
          []
        );
      const gasLimit = "10000000";
      const txConfig = {
        to: config.erc6551RegistryAddress,
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
      const sdkConfig: AccountAbstractionConfig= {
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