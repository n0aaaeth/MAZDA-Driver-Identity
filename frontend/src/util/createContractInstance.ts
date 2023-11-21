import { Contract, providers } from 'ethers';

export const createContractInstance = async (address: string, abi: any , provider: providers.Web3Provider | null) => {
  const signer = provider!.getSigner();
  return new Contract(address, abi, signer);
};

