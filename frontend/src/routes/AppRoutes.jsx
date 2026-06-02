import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

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

const ProtectedLayout = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/file/:fileId" element={<PublicFileView />} />

      <Route path="/home" element={<ProtectedLayout><ExplorePage /></ProtectedLayout>} />
      <Route path="/explore" element={<ProtectedLayout><ExplorePage /></ProtectedLayout>} />
      <Route path="/document/:id" element={<ProtectedLayout><DocumentDetailPage /></ProtectedLayout>} />
      <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="/my-files" element={<ProtectedLayout><MyFiles /></ProtectedLayout>} />
      <Route path="/subscriptions" element={<ProtectedLayout><Subscription /></ProtectedLayout>} />
      <Route path="/transactions" element={<ProtectedLayout><Transaction /></ProtectedLayout>} />
      <Route path="/shared" element={<ProtectedLayout><SharedPage /></ProtectedLayout>} />
      <Route path="/favorites" element={<ProtectedLayout><FavoritesPage /></ProtectedLayout>} />
      <Route path="/trash" element={<ProtectedLayout><TrashPage /></ProtectedLayout>} />
      <Route path="/upload" element={<UploadPage />} />

      <Route path="/*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;