import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import CategoryPage from "../pages/Category/CategoryPage";
import Landing from "../pages/Landing/Landing";
import Dashboard from "../pages/Dashboard/Dashboard";
import MyFiles from "../pages/Dashboard/components/MyFiles";
import Subscription from "../pages/Dashboard/components/Subscription";
import Transaction from "../pages/Dashboard/components/Transaction";
import SharedPage from "../pages/Dashboard/components/Shared";
import FavoritesPage from "../pages/Dashboard/components/Favorites";
import TrashPage from "../pages/Dashboard/components/Trash";
import PublicFileView from "../pages/Dashboard/components/PublicFileView";
import ExplorePage from "../pages/Explore/ExplorePage";
import DocumentDetailPage from "../pages/DocumentDetail/DocumentDetailPage";
import UploadPage from "../pages/Upload/Upload";
import PremiumPage from "../pages/Premium/PremiumPage";
import History from "../pages/Dashboard/components/History";
import AiStudioPage from "../pages/AiStudio/AiStudioPage";
import Collections from "../pages/Dashboard/components/Collections";
import CollectionDetail from "../pages/Dashboard/components/CollectionDetail";
import CommunityPage from "../pages/Community/CommunityPage";

const ProtectedLayout = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/" element={<Landing />} />
      <Route path="/file/:fileId" element={<PublicFileView />} />
      <Route path="/category" element={<CategoryPage />} />
      <Route path="/premium" element={<PremiumPage />} />

      <Route path="/home" element={<ProtectedLayout><ExplorePage /></ProtectedLayout>} />
      <Route path="/explore" element={<ProtectedLayout><ExplorePage /></ProtectedLayout>} />
      <Route path="/document/:id" element={<ProtectedLayout><DocumentDetailPage /></ProtectedLayout>} />
      <Route path="/documents/:id/ai-studio" element={<AiStudioPage />} />
      <Route path="/upload" element={<ProtectedLayout><UploadPage /></ProtectedLayout>} />
      <Route path="/community" element={<CommunityPage />} />

      <Route path="/user/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="/user/my-files" element={<ProtectedLayout><MyFiles /></ProtectedLayout>} />
      <Route path="/user/history" element={<ProtectedLayout><History /></ProtectedLayout>} />
      <Route path="/user/transactions" element={<ProtectedLayout><Transaction /></ProtectedLayout>} />
      <Route path="/user/favorites" element={<ProtectedLayout><FavoritesPage /></ProtectedLayout>} />
      <Route path="/user/collections" element={<ProtectedLayout><Collections /></ProtectedLayout>} />
      <Route path="/user/collections/:collectionId" element={<ProtectedLayout><CollectionDetail /></ProtectedLayout>} />

      <Route path="/*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;