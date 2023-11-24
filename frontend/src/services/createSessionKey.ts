import { Contract, providers, utils } from "ethers";
import { config } from "../config/config";
import { MetaTransactionData, MetaTransactionOptions, OperationType } from "@safe-global/safe-core-sdk-types";
import { sessionKeyAbi } from "../abi/sessionAbi";
import { TempKey } from "../session/TempKey";
import { v4 as uuidv4 } from "uuid";
import { StorageKeys } from "../session/storage/storage-keys";
import { GelatoRelayPack } from "zkatana-gelato-relay-kit";
import AccountAbstraction from "zkatana-gelato-account-abstraction-kit";
import { colorAbi } from "../abi/colorAbi";

type CreateSessionKeyParams =  {
  provider: providers.Web3Provider | null;
  safe: string | undefined;
  contractAddress: string;
}

export const createSessionKey = async({
  provider,
  safe,
  contractAddress,
}: CreateSessionKeyParams) => {
  if (!provider || !safe) {
    console.error("Provider or safe address is missing");
    return;
  }

  const signer = provider.getSigner();
  let isDeployed = true;
  let isEnabled = false;
  let transactionsArray: MetaTransactionData[] = [];

  try {
    const safeContract = new Contract(safe, [
      "function enableModule(address module) external",
      "function isModuleEnabled(address module) external view returns (bool)",
    ], signer);

    isEnabled = await safeContract.isModuleEnabled(config.sessionModuleContract);
  } catch (error) {
    console.error("Safe not deployed or contract interaction failed:", error);
    isDeployed = false;
  }

  if (!isDeployed) {
    return;
  }

  const tmpMintMyCarNftContract = new Contract(config.colorAddress, colorAbi, signer);
  const tmpSessionContract = new Contract(config.sessionModuleContract, sessionKeyAbi, signer);
  const funcSig = tmpMintMyCarNftContract.interface.getSighash("mintBatch(address,uint256[],uint256[])");
  const txSpec = { to: contractAddress, selector: funcSig, hasValue: false, operation: 0 };

  const isWhitelisted = await tmpSessionContract.isWhitelistedTransaction(safe, [txSpec]);

  if (!isWhitelisted) {
    transactionsArray.push(createMetaTransactionData(tmpSessionContract, "whitelistTransaction", [[txSpec]]));
  }

  if (!isEnabled) {
    transactionsArray.push(createMetaTransactionDataFromIface(safe, "enableModule", [config.sessionModuleContract]));
  }

  const tempKey = new TempKey();
  const sessionId = uuidv4();
  localStorage.setItem(StorageKeys.SESSION_ID, sessionId);
  localStorage.setItem(StorageKeys.SESSION_KEY, tempKey.privateKey);

  transactionsArray.push(createMetaTransactionData(tmpSessionContract, "createSessionKey", [
    sessionId,
    3600,
    tempKey.address,
  ]));

  try {
    const relayPack = new GelatoRelayPack(config.gelatoRelayApiKey);
    const safeAccountAbstraction = new AccountAbstraction(signer);
    await safeAccountAbstraction.init({ relayPack });

    const options: MetaTransactionOptions = { gasLimit: "10000000", isSponsored: true };
    const response = await safeAccountAbstraction.relayTransaction(transactionsArray, options);
    console.log(`https://relay.gelato.digital/tasks/status/${response}`);
    return response;
  } catch (error) {
    console.error("Transaction relay failed:", error);
  }
}

const createMetaTransactionData = (contract: Contract, methodName: string, params: any[]) =>  {
  return {
    to: contract.address,
    data: contract.interface.encodeFunctionData(methodName, params),
    value: "0",
    operation: OperationType.Call,
  };
}

const createMetaTransactionDataFromIface = (address: string, methodName: string, params: any[]) => {
  const iface = new utils.Interface([
    "function enableModule(address module) external",
    "function isModuleEnabled(address module) external view returns (bool)",
  ]);
  return {
    to: address,
    data: iface.encodeFunctionData(methodName, params),
    value: "0",
    operation: OperationType.Call,
  };
}