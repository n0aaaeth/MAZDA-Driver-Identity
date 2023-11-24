import React, { FC } from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Map } from "../pages/Map";
import { Custom } from "../pages/Custom";
import { Auth } from "../pages/Auth";
import { Activity } from "../pages/Activity";
import { Utility } from "../pages/Utility";
import { Setup } from "../pages/Setup";
import { web3StateAtom } from "../store/web3State";

type PrivateRouteProps = {
  children: React.ReactNode;
};

const PrivateRoute: FC<PrivateRouteProps> = ({ children }: PrivateRouteProps) => {
  const web3State = useRecoilValue(web3StateAtom);

  if (!web3State.web3auth) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const routes: {
  path: string;
  element: React.ReactNode;
  isPrivate?: boolean;
}[] = [
  {
    path: "/auth",
    element: <Auth />,
    isPrivate: false,
  },
  {
    path: "/setup",
    element: <Setup />,
    isPrivate: true,
  },
  {
    path: "/map",
    element: <Map />,
    isPrivate: true,
  },
  {
    path: "/custom",
    element: <Custom />,
    isPrivate: true,
  },
  {
    path: "/activity",
    element: <Activity />,
    isPrivate: true,
  },
  {
    path: "/utility",
    element: <Utility />,
    isPrivate: true,
  },
];

export const Router: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map(({ path, element, isPrivate }) =>
          isPrivate ? (
            <Route
              key={path}
              path={path}
              element={<PrivateRoute>{element}</PrivateRoute>}
            />
          ) : (
            <Route key={path} path={path} element={element} />
          )
        )}
      </Routes>
    </BrowserRouter>
  );
};
