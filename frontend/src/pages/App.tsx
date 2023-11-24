
import { CssBaseline } from "@mui/material";
import { Providers } from "../store/Providers";
import { Router } from "../router/Router";

function App() {
  return (
    <Providers>
      <CssBaseline />
      <Router />
    </Providers>
  );
}

export default App;
