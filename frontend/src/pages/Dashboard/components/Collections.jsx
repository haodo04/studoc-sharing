import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Layers, Loader2 } from "lucide-react";
import { collectionApi } from "../../../api/collectionApi";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const fetchCollections = async () => {
    try {
      const token = await getToken();
      const res = await collectionApi.list(token);
      setCollections(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách bộ sưu tập.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) fetchCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn]);

  return (
    <DashboardLayout activeMenu="Bộ sưu tập">
      <div className="py-6 max-w-[1400px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Bộ sưu tập của tôi</h2>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200/80 p-16 flex flex-col items-center justify-center text-center">
            <Loader2 className="text-indigo-600 animate-spin mb-4" size={32} />
            <p className="text-sm font-medium text-slate-700">Đang tải danh sách...</p>
          </div>
        ) : collections.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/80 p-16 flex flex-col items-center justify-center text-center">
            <Layers size={48} className="text-slate-300 mb-4" />
            <p className="font-semibold text-slate-700">Chưa có bộ sưu tập nào</p>
            <p className="text-xs text-slate-400 mt-1">
              Bấm icon "Thêm vào bộ sưu tập" ở bất kỳ tài liệu nào để bắt đầu tạo bộ đầu tiên.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {collections.map((c) => (
              <Link
                key={c.id}
                to={`/user/collections/${c.id}`}
                className="bg-white rounded-xl border border-slate-200/80 p-4 hover:border-indigo-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                    <Layers size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{c.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{c.fileCount} tài liệu</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Collections;