import { Contract } from "ethers";
import { TempKey } from "../session/TempKey";
import { StorageKeys } from "../session/storage/storage-keys";
import { config } from "../config/config";
import { sessionKeyAbi } from "../abi/sessionAbi";
import { BrowserProvider, Wallet } from "ethers6";
import { CallWithERC2771Request, GelatoRelay } from "@gelatonetwork/relay-sdk";

export const signLessTx = async ({
  userState,
  targetContract,
  abi,
  to,
  tokenId,
  amount,
}: any) => {
  try {
    const relay = new GelatoRelay();
    const tmpTargetContract = new Contract(
      targetContract,
      abi,
      userState.provider.getSigner()
    );
    const tmpSessionKeyContract = new Contract(
      config.sessionModuleContract,
      sessionKeyAbi,
      userState.provider.getSigner()
    );

    // トランザクションデータを取得
    // console.log(tokenId);
    // console.log(amount);
    const { data: dataCounter } = await tmpTargetContract!.populateTransaction.mintBatch(
      to,
      tokenId,
      amount
    );

    // セッションIDとキーをローカルストレージから取得
    const sessionId = localStorage.getItem(StorageKeys.SESSION_ID);
    const sessionKey = localStorage.getItem(StorageKeys.SESSION_KEY);

    // セッションが存在しない場合はエラーを投げる
    if (!sessionId || !sessionKey) {
      throw new Error("Session ID or session key is missing");
    }

    const tempKey = new TempKey(sessionKey);
    

    // トランザクション仕様を準備
    const txSpec = {
      to: targetContract,
      data: dataCounter,
      value: 0,
      operation: 0,
    };

    // 実行データを取得
    let { data: dataExecute } =
      await tmpSessionKeyContract.populateTransaction.executeWithSessionKey(
        sessionId,
        [txSpec]
      );

    // ブラウザプロバイダーとウォレットの設定
    const localProvider = new BrowserProvider(window.ethereum);
    const signer = new Wallet(sessionKey, localProvider);

    // ERC2771リクエストを準備
    const request: CallWithERC2771Request = {
      chainId: BigInt(1261120),
      target: config.sessionModuleContract,
      data: dataExecute as string,
      user: tempKey.address as string,
    };
    // トランザクションをリレー
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
