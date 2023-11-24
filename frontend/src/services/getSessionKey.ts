import { Contract, providers, utils } from "ethers";
import { config } from "../config/config";
import { sessionKeyAbi } from "../abi/sessionAbi";
import { StorageKeys } from "../session/storage/storage-keys";

type GetSessionKeyParams =  {
  provider: providers.Web3Provider | null;
}

export const getSessionKey = async ({ provider }: GetSessionKeyParams) => {
  if (!provider) {
    throw new Error("Provider is null or undefined.");
  }

  const contract = new Contract(
    config.sessionModuleContract,
    sessionKeyAbi,
    provider.getSigner()
  );

  const sessionId = localStorage.getItem(StorageKeys.SESSION_ID);
  if (!sessionId) {
    throw new Error("Session ID not found in localStorage.");
  }

  const packed = utils.solidityPack(["string"], [sessionId]);
  const hash = utils.keccak256(packed);

  try {
    const session = await contract.sessionKeys(hash);
    return session;
  } catch (error) {
    console.error("Failed to retrieve session key:", error);
    throw error;
  }
};
