import { Contract, providers } from "ethers";
import { TempKey } from "../session/TempKey";
import { StorageKeys } from "../session/storage/storage-keys";
import { config } from "../config/config";
import { sessionKeyAbi } from "../abi/sessionAbi";
import { BrowserProvider, Wallet } from "ethers6";
import { CallWithERC2771Request, GelatoRelay } from "@gelatonetwork/relay-sdk";
import { colorAbi } from "../abi/colorAbi";

type MintColorWithSessionKeyParams =  {
  provider: providers.Web3Provider | null;
  to: string;
  tokenId: number[];
  amount: number[];
}

export const mintColorWithSessionKey = async ({
  provider,
  to,
  tokenId,
  amount,
}: MintColorWithSessionKeyParams)=> {
  if (!provider) {
    throw new Error("Provider is null or undefined.");
  }

  try {
    const relay = new GelatoRelay();
    const tmpTargetContract = new Contract(
      config.colorAddress,
      colorAbi,
      provider!.getSigner()
    );
    const tmpSessionKeyContract = new Contract(
      config.sessionModuleContract,
      sessionKeyAbi,
      provider!.getSigner()
    );

    const { data: dataCounter } =
      await tmpTargetContract!.populateTransaction.mintBatch(
        to,
        tokenId,
        amount
      );

    const sessionId = localStorage.getItem(StorageKeys.SESSION_ID);
    const sessionKey = localStorage.getItem(StorageKeys.SESSION_KEY);

    if (!sessionId || !sessionKey) {
      throw new Error("Session ID or session key is missing");
    }

    const tempKey = new TempKey(sessionKey);

    const txSpec = {
      to: config.colorAddress,
      data: dataCounter,
      value: 0,
      operation: 0,
    };

    let { data: dataExecute } =
      await tmpSessionKeyContract.populateTransaction.executeWithSessionKey(
        sessionId,
        [txSpec]
      );

    const localProvider = new BrowserProvider(window.ethereum);
    const signer = new Wallet(sessionKey, localProvider);

    const request: CallWithERC2771Request = {
      chainId: BigInt(1261120),
      target: config.sessionModuleContract,
      data: dataExecute as string,
      user: tempKey.address as string,
    };

    const response = await relay.sponsoredCallERC2771(
      request,
      signer,
      config.gelatoRelayApiKey
    );

    console.log(`https://relay.gelato.digital/tasks/status/${response.taskId}`);
    return response.taskId;
  } catch (error) {
    console.error("Error in signLessTx function:", error);
  }
};
