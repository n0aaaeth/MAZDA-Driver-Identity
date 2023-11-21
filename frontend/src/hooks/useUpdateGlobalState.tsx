import { useRecoilState } from "recoil";
import { userStateAtom } from "../store/useState";

export const useUpdateState = () => {
  const [userState, setUserState] = useRecoilState(userStateAtom);

  const updateUserState = (newState: any) => {
    setUserState({ ...userState, ...newState });
  };

  return {
    updateUserState
  };
};
