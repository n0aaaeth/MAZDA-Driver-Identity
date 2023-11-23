import { Contract, utils } from "ethers";
import { config } from "../config/config";
import { sessionKeyAbi } from "../abi/sessionAbi";
import { StorageKeys } from "../session/storage/storage-keys";

export const getSessionKey = async ({userState}: any) => {
    const contract = new Contract(
        config.sessionModuleContract,
        sessionKeyAbi,
        userState.provider!.getSigner()
      );

    const sessionId = localStorage.getItem(StorageKeys.SESSION_ID);

    const packed = utils.solidityPack(["string"], [sessionId]);
    const hash = utils.keccak256(packed);

    const session = await contract.sessionKeys(hash);
    // console.log("Session Key:", session);

    return session;
  };