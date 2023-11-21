import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Map } from "../pages/Map";
import { Custom } from "../pages/Custom";
import { Activity } from "../pages/Activity";
import { Login } from "../pages/Login";
import { ModelSelect } from "../pages/ModelSelect";

const routs: {
  path: string;
  element: JSX.Element;
}[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/model-select",
    element: <ModelSelect />,
  },
  {
    path: "/",
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
    path: "/auth",
    element: <>auth</>,
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
