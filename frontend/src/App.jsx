import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";

import { UserCreditsProvider } from "./context/UserCreditsContext";
import { CollectionModalProvider } from "./context/CollectionModalContext";
import AddToCollectionModal from "./components/ui/AddToCollectionModal";
import GlobalBanner from "./components/ui/GlobalBanner";

function App() {
  return (
    <UserCreditsProvider>
      <CollectionModalProvider>
        <BrowserRouter>
          <GlobalBanner />
          <Toaster position="top-center" reverseOrder={false} />

          <AppRoutes />
          <AddToCollectionModal />
        </BrowserRouter>
      </CollectionModalProvider>
    </UserCreditsProvider>
  );
}

export default App;