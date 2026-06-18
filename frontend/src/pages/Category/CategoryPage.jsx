import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarPage from "../../components/common/NavbarPage";
import { documentApi } from "../../api/documentApi";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import apiEndpoints from "../../api/apiEndpoint";
import toast from "react-hot-toast";
import DocumentCard from "../../components/common/DocumentCard";
import {
  Search,
  Compass,
  Clock,
  TrendingUp,
  Star,
  Monitor,
  Scale,
  Stethoscope,
  Calculator,
  GraduationCap,
  Building2,
  BookOpen,
  Award,
  FileText,
  Presentation,
  Archive,
  Download,
  ChevronLeft,
  ChevronRight,
  Laptop,
  Globe,
  Ruler,
  Book,
  Palette,
  Settings,
  File,
} from "lucide-react";
const CATEGORY_MAP = {
  IT: { name: "Công nghệ thông tin", icon: Laptop },
  ECO: { name: "Kinh tế - Kế toán", icon: TrendingUp },
  LAW: { name: "Luật học", icon: Scale },
  MED: { name: "Y Dược", icon: Stethoscope },
};

const UNIVERSITY_MAP = {
  NLU: { name: "NLU - Nông Lâm", icon: GraduationCap },
  HUST: { name: "HUST - Bách Khoa", icon: Building2 },
  NEU: { name: "NEU - Kinh tế QD", icon: BookOpen },
};


export default function CategoryPage() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeExplore, setActiveExplore] = useState("Tất cả");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeUniversity, setActiveUniversity] = useState("");
  const [sortBy, setSortBy] = useState("Mới nhất");

  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [dynamicUniversities, setDynamicUniversities] = useState([]);

  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [favoriteFileIds, setFavoriteFileIds] = useState(new Set());

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isLoaded || !isSignedIn) return;
      try {
        const token = await getToken();
        const response = await axios.get(apiEndpoints.GET_FAVORITES, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 200) {
          const ids = response.data.map(f => f.fileId);
          setFavoriteFileIds(new Set(ids));
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách yêu thích:", error);
      }
    };
    fetchFavorites();
  }, [isLoaded, isSignedIn, getToken]);

  const handleToggleFavorite = async (fileId) => {
    if (!isSignedIn) {
      toast.error("Vui lòng đăng nhập để thêm vào yêu thích!");
      return;
    }
    try {
      const token = await getToken();
      const response = await axios.post(apiEndpoints.TOGGLE_FAVORITE(fileId), {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        const isFavorited = response.data;
        setFavoriteFileIds(prev => {
          const newSet = new Set(prev);
          if (isFavorited) {
            newSet.add(fileId);
            toast.success("Đã thêm vào yêu thích");
          } else {
            newSet.delete(fileId);
            toast.success("Đã bỏ yêu thích");
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật yêu thích:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const categoriesData = await documentApi.getCategories();
        const universitiesData = await documentApi.getUniversities();
        setDynamicCategories(categoriesData || []);
        setDynamicUniversities(universitiesData || []);
      } catch (error) {
        console.error("Không thể tải dữ liệu bộ lọc bộ lọc:", error);
      }
    };
    fetchFiltersData();
  }, []);

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const filters = {
          keyword: searchQuery,
          explore: activeExplore !== "Tất cả" ? activeExplore : null,
          categoryId: activeCategory,
          universityId: activeUniversity,
          sortBy: sortBy,
          page: currentPage,
          size: 12,
        };

        const data = await documentApi.searchDocuments(filters);
        setDocuments(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Không thể tải danh sách tài liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const delaySearch = setTimeout(() => {
      fetchDocuments();
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [
    searchQuery,
    activeExplore,
    activeCategory,
    activeUniversity,
    sortBy,
    currentPage,
  ]);

  const handleExploreChange = (exploreName) => {
    setActiveExplore(exploreName);
    setCurrentPage(0);
    if (exploreName === "Mới nhất" || exploreName === "Cũ nhất") {
      setSortBy(exploreName);
    } else if (exploreName === "Thịnh hành") {
      setSortBy("Tải nhiều nhất");
    } else if (exploreName === "Đánh giá cao") {
      setSortBy("Đánh giá cao");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };



  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      <NavbarPage />

      <div className="flex flex-1 max-w-[1500px] mx-auto w-full">
        {/* SIDEBAR BÊN TRÁI */}
        <aside className="hidden md:flex flex-col sticky top-[65px] left-0 h-[calc(100vh-65px)] p-6 gap-4 w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto shrink-0 z-10">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-indigo-600 mb-1">
              Bộ lọc tài liệu
            </h2>
            <p className="text-sm text-slate-500">
              Tìm kiếm theo ngành & trường
            </p>
          </div>

          {/* Nhóm Khám phá */}
          <div className="flex flex-col gap-1 mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
              Khám Phá
            </h3>
            {[
              { name: "Tất cả", icon: Compass },
              { name: "Mới nhất", icon: Clock },
              { name: "Thịnh hành", icon: TrendingUp },
              { name: "Đánh giá cao", icon: Star },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => handleExploreChange(item.name)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  activeExplore === item.name
                    ? "bg-indigo-50 text-indigo-700 font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${activeExplore === item.name ? "fill-indigo-100" : ""}`}
                />
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Nhóm Ngành Học */}
          <div className="flex flex-col gap-1 mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
              Ngành Học
            </h3>
            <button
              onClick={() => {
                setActiveCategory("");
                setCurrentPage(0);
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeCategory === "" ? "text-indigo-600 font-bold bg-indigo-50" : "text-slate-600 hover:bg-slate-100"}`}
            >
              <span>Tất cả ngành học</span>
            </button>
            {dynamicCategories.map((cat) => {
              const config = CATEGORY_MAP[cat.id] || {
                name: cat.name,
                icon: Monitor,
              };
              const IconComponent = config.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setCurrentPage(0);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                    activeCategory === cat.id
                      ? "bg-indigo-50 text-indigo-700 font-bold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <IconComponent className="w-5 h-5 text-slate-500" />
                  <span>{config.name}</span>
                </button>
              );
            })}
          </div>

          {/* Nhóm Trường Đại Học */}
          <div className="flex flex-col gap-1 mb-8">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
              Trường Đại Học
            </h3>
            <button
              onClick={() => {
                setActiveUniversity("");
                setCurrentPage(0);
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeUniversity === "" ? "text-indigo-600 font-bold bg-indigo-50" : "text-slate-600 hover:bg-slate-100"}`}
            >
              <span>Tất cả trường</span>
            </button>
            {dynamicUniversities.map((uni) => {
              const config = UNIVERSITY_MAP[uni.id] || {
                name: uni.name,
                icon: BookOpen,
              };
              const IconComponent = config.icon;
              return (
                <button
                  key={uni.id}
                  onClick={() => {
                    setActiveUniversity(uni.id);
                    setCurrentPage(0);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                    activeUniversity === uni.id
                      ? "bg-indigo-50 text-indigo-700 font-bold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <IconComponent className="w-5 h-5 text-slate-500" />
                  <span>{config.name}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* NỘI DUNG CHÍNH BÊN PHẢI */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* THANH TÌM KIẾM */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative w-full max-w-lg group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Nhập tên tài liệu, môn học, mã học phần..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(0);
                }}
                className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm font-medium transition-all shadow-sm"
              />
            </div>
          </div>

          {/* HEADER CONTENT */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-200 pb-5">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {searchQuery ? `Kết quả cho: "${searchQuery}"` : activeExplore}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Khám phá hàng ngàn tài liệu học tập từ các trường đại học.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Sắp xếp theo:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(0);
                }}
                className="bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-sm font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer"
              >
                <option value="Mới nhất">Mới nhất</option>
                <option value="Đánh giá cao">Đánh giá cao</option>
                <option value="Tải nhiều nhất">Tải nhiều nhất</option>
                <option value="Cũ nhất">Cũ nhất</option>
              </select>
            </div>
          </div>

          {/* DANH SÁCH TÀI LIỆU */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20 text-indigo-600 font-bold animate-pulse">
              Đang tìm kiếm tài liệu...
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <FileText className="w-16 h-16 text-slate-300 mb-4" />
              <p className="text-lg font-bold text-slate-700">
                Không tìm thấy tài liệu nào
              </p>
              <p className="text-sm">
                Hãy thử thay đổi từ khóa hoặc bộ lọc của bạn.
              </p>
            </div>
          ) : (
            /* Lưới Grid hiển thị đồng bộ tất cả các cột */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {documents.map((doc) => (
                <DocumentCard 
                  key={doc.id || doc._id} 
                  doc={doc} 
                  isFavorited={favoriteFileIds.has(doc.id || doc._id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 mb-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
