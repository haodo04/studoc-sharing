import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";

import { UserCreditsProvider } from "./context/UserCreditsContext";

function App() {
  return (
    <UserCreditsProvider>
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        
        <AppRoutes />
      </BrowserRouter>
    </UserCreditsProvider>
  );
}

export default App;