import AccountAbstraction, {
  AccountAbstractionConfig,
} from "zkatana-gelato-account-abstraction-kit";
import { GelatoRelayPack } from "zkatana-gelato-relay-kit";
import { config } from "../config/config";
import { providers } from "ethers";

type GetSafeAddressParams =  {
  provider: providers.Web3Provider | null;
}

export const getSafeAddress = async ({ provider }: GetSafeAddressParams) => {
  if (!provider) {
    throw new Error("Provider is null or undefined.");
  }

  try {
    const relayPack = new GelatoRelayPack(config.gelatoRelayApiKey);
    const safeAccountAbstraction = new AccountAbstraction(provider.getSigner());
    const sdkConfig: AccountAbstractionConfig = { relayPack };
    await safeAccountAbstraction.init(sdkConfig);

    const safeAddress = await safeAccountAbstraction.getSafeAddress();
    // const isDeployed = await safeAccountAbstraction.isSafeDeployed();

    return safeAddress;
  } catch (error) {
    console.error("Failed to get safe address:", error);
    throw error;
  }
};
