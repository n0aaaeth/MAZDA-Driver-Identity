import AccountAbstraction, {
  AccountAbstractionConfig,
} from "zkatana-gelato-account-abstraction-kit";
import { GelatoRelayPack } from "zkatana-gelato-relay-kit";
import { config } from "../config/config";

export const getSafeAddress = async ({signer}: any) => {
  const relayPack = new GelatoRelayPack(config.gelatoRelayApiKey);
  const safeAccountAbstraction = new AccountAbstraction(signer);
  const sdkConfig: AccountAbstractionConfig = {
    relayPack,
  };
  await safeAccountAbstraction.init(sdkConfig);

  const safeAddress = await safeAccountAbstraction.getSafeAddress();
  const isDeployed = await safeAccountAbstraction.isSafeDeployed();

  console.log(safeAddress, isDeployed);

  return safeAddress;
};
