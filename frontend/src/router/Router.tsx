import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Map } from "../pages/Map";
import { Custom } from "../pages/Custom";
import { Auth } from "../pages/Auth";
import { StartSetup } from "../pages/StartSetup";
import { CreateTBA } from "../pages/CreateTBA";
import { GetColor } from "../pages/GetColor";
import { Activity } from "../pages/Activity";
import { Utility } from "../pages/Utility";

const routs: {
  path: string;
  element: JSX.Element;
}[] = [
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/",
    element: <StartSetup />,
  },
  {
    path: "/create-tba",
    element: <CreateTBA />,
  },
  {
    path: "/get-color",
    element: <GetColor/>,
  },
  {
    path: "/map",
    element: <Map />,
  },
  {
    path: "/custom",
    element: <Custom />,
  },
  {
    path: "/activity",
    element: <Activity />,
  },
  {
    path: "/utility",
    element: <Utility />,
  },
];

export const Router: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {routs.map((route) => {
          return <Route key={route.path} path={route.path} element={route.element} />;
        })}
      </Routes>
    </BrowserRouter>
  );
};
