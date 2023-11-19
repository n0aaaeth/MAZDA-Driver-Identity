import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";

const routs: {
  path: string;
  element: JSX.Element;
}[] = [
  {
    path: "/",
    element: <Home />,
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
          return (
            <Route key={route.path} path={route.path} element={route.element} />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};
