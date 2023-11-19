import { Container } from "@mui/material";
import { FC, ReactNode } from "react";
import { Header } from "../Header";
import { Footer } from "../Footer";

type Props = {
  children: ReactNode;
};

export const PrimaryLayout: FC<Props> = ({ children }) => {
  return (
    <Container
      disableGutters
      maxWidth="xs"
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "primary.main",
      }}
    >
      <Header />
      {children}
      <Footer />
    </Container>
  );
};
