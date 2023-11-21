import { Contract } from "ethers";
import { config } from "../config/config";
import {
  MetaTransactionData,
  MetaTransactionOptions,
  OperationType,
} from "@safe-global/safe-core-sdk-types";
import { myCarAbi } from "../abi/myCarAbi";
import { sessionKeyAbi } from "../abi/sessionAbi";
import { Interface } from "ethers/lib/utils";
import { TempKey } from "../session/TempKey";
import { v4 as uuidv4 } from "uuid";
import { StorageKeys } from "../session/storage/storage-keys";
import { GelatoRelayPack } from "zkatana-gelato-relay-kit";
import AccountAbstraction, {
  AccountAbstractionConfig,
} from "zkatana-gelato-account-abstraction-kit";

export const createSessionKeys = async ({
  userState,
  contractAddress,
}: any) => {
  let transactionsArray = [];

  let isDeployed: boolean;
  let isEnabled: boolean;

  try {
    const safeContract = new Contract(
      userState.safe,
      [
        "function enableModule(address module) external",
        "function isModuleEnabled(address module) external view returns (bool)",
      ],
      userState.signer!
    );

    isEnabled = await safeContract.isModuleEnabled(
      config.sessionModuleContract
    );
    isDeployed = true;
  } catch (error) {
    console.log("safe not deployed");
    isDeployed = false;
    isEnabled = false;
  }

  console.log("Is module enabled: ", isEnabled);
  let tmpMintMyCarNftContract = new Contract(
    config.myCarAddress,
    myCarAbi,
    userState.provider.getSigner()
  );

  let tmpSessionContract = new Contract(
    config.sessionModuleContract,
    sessionKeyAbi,
    userState.provider.getSigner()
  );

  const funcSig = tmpMintMyCarNftContract.interface.getSighash("mint()");

  const txSpec = {
    to: contractAddress,
    selector: funcSig,
    hasValue: false,
    operation: 0,
  };

  const isWhitelisted = await tmpSessionContract.isWhitelistedTransaction(
    userState.safe,
    [txSpec]
  );

  console.log("is whitelisted: ", isWhitelisted);

  if (isWhitelisted === false) {
    const safeTransactionDataWhitelist: MetaTransactionData = {
      to: config.sessionModuleContract,
      data: tmpSessionContract.interface.encodeFunctionData(
        "whitelistTransaction",
        [[txSpec]]
      ),
      value: "0",
      operation: OperationType.Call,
    };
    transactionsArray.push(safeTransactionDataWhitelist);
  }

  const safeIface = new Interface([
    "function enableModule(address module) external",
    "function isModuleEnabled(address module) external view returns (bool)",
  ]);

  if (isEnabled === false) {
    const safeTransactionDataModule: MetaTransactionData = {
      to: userState.safe,
      data: safeIface.encodeFunctionData("enableModule", [
        config.sessionModuleContract,
      ]),
      value: "0",
      operation: OperationType.Call,
    };

    transactionsArray.push(safeTransactionDataModule);
  }

  const tempKey = new TempKey();
  console.log(tempKey.privateKey);
  const tempAddress = tempKey.address;

  const sessionId = uuidv4();
  console.log(sessionId, tempAddress);
  const safeTransactionDataCreation: MetaTransactionData = {
    to: config.sessionModuleContract,
    data: tmpSessionContract.interface.encodeFunctionData("createSessionKey", [
      sessionId,
      3600,
      tempAddress,
    ]),
    value: "0",
    operation: OperationType.Call,
  };

  transactionsArray.push(safeTransactionDataCreation);

  console.log(transactionsArray);
  localStorage.setItem(StorageKeys.SESSION_ID, sessionId);
  localStorage.setItem(StorageKeys.SESSION_KEY, tempKey.privateKey);

  console.log(sessionId, tempAddress);

  let web3AuthSigner = userState.signer;
  try {
    const relayPack = new GelatoRelayPack(config.gelatoRelayApiKey);

    const safeAccountAbstraction = new AccountAbstraction(web3AuthSigner!);
    const sdkConfig: AccountAbstractionConfig = {
      relayPack,
    };

    await safeAccountAbstraction.init(sdkConfig);

    const gasLimit = "10000000";
    const options: MetaTransactionOptions = {
      gasLimit: gasLimit,
      isSponsored: true,
    };
    console.log(transactionsArray);
    const response = await safeAccountAbstraction.relayTransaction(
      transactionsArray,
      options
    );
    console.log(response);
    console.log(`https://relay.gelato.digital/tasks/status/${response}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};
