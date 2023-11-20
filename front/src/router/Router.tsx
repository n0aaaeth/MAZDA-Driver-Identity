import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Map } from "../pages/Map";

const routs: {
  path: string;
  element: JSX.Element;
}[] = [
  {
    path: "/",
    element: <Map />,
  },
  {
    path: "/custom",
    element: <Map />,
  },
  {
    path: "/activity",
    element: <Map />,
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
