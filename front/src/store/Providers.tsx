import { ThemeProvider } from "@mui/material";
import { FC, ReactNode } from "react";
import { theme } from "../theme/theme";

type Props = {
  children: ReactNode;
};

export const Providers: FC<Props> = ({ children }) => {
  return (
    <>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </>
  );
};
