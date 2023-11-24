import { useRecoilState } from "recoil";
import { web3StateAtom } from "../store/web3State";

export const useUpdateWeb3State = () => {
  const [web3State, setWeb3State] = useRecoilState(web3StateAtom);

  const updateWeb3State = (newState: any) => {
    setWeb3State({ ...web3State, ...newState });
  };

  return {
    updateWeb3State
  };
};
