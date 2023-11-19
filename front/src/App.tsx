import { Providers } from "./store/Providers";
import { Router } from "./router/Router";
import { CssBaseline } from "@mui/material";

function App() {
  return (
    <Providers>
      <CssBaseline />
      <Router></Router>
    </Providers>
  );
}

export default App;
