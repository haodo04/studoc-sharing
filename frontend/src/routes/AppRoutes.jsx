import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";
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
import AdminLayout from "../components/layout/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminUsers from "../pages/Admin/AdminUsers";
import AdminDocuments from "../pages/Admin/AdminDocuments";
import AdminCommunity from "../pages/Admin/AdminCommunity";
import AdminTransactions from "../pages/Admin/AdminTransactions";
import AdminReports from "../pages/Admin/AdminReports";
import AdminSettings from "../pages/Admin/AdminSettings";
import AdminAiTracking from "../pages/Admin/AdminAiTracking";

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

// Tài khoản Admin cố định
export const ADMIN_EMAIL = "manager1713181827328@gmail.com";

const AdminRoute = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) return null;
  if (!isSignedIn) return <RedirectToSignIn />;

  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;
  if (!isAdmin) return <Navigate to="/home" replace />;

  return children;
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

      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
      <Route path="/admin/documents" element={<AdminRoute><AdminLayout><AdminDocuments /></AdminLayout></AdminRoute>} />
      <Route path="/admin/categories" element={<AdminRoute><AdminLayout><CategoryPage /></AdminLayout></AdminRoute>} />
      <Route path="/admin/transactions" element={<AdminRoute><AdminLayout><AdminTransactions /></AdminLayout></AdminRoute>} />
      <Route path="/admin/community" element={<AdminRoute><AdminLayout><AdminCommunity /></AdminLayout></AdminRoute>} />
      <Route path="/admin/reports" element={<AdminRoute><AdminLayout><AdminReports /></AdminLayout></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><AdminLayout><AdminSettings /></AdminLayout></AdminRoute>} />
      <Route path="/admin/ai-tracking" element={<AdminRoute><AdminLayout><AdminAiTracking /></AdminLayout></AdminRoute>} />

      <Route path="/*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;