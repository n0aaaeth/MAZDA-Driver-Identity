import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MapComponent } from "../pages/MapComponent";
import { Custom } from "../pages/Custom";
import { Activity } from "../pages/Activity";

const routs: {
  path: string;
  element: JSX.Element;
}[] = [
  {
    path: "/",
    element: <MapComponent />,
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
