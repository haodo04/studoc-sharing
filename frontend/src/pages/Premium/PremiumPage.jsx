import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Sparkles, Coins, Crown, ArrowRight } from 'lucide-react';
import { useUserCredits } from '../../context/UserCreditsContext';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'react-hot-toast'; 
import NavbarPage from '../../components/common/NavbarPage';

const PremiumPage = () => {
  const { credits, fetchUserCredits } = useUserCredits();
  const { getToken, isSignedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const coinPackages = [
    { id: 'coin-1', coins: 5, price: '20.000đ', rawPrice: 20000, originalPrice: null, popular: false, bonus: 'Không có' },
    { id: 'coin-2', coins: 15, price: '50.000đ', rawPrice: 50000, originalPrice: '60.000đ', popular: true, bonus: '+3 Xu' },
    { id: 'coin-3', coins: 50, price: '100.000đ', rawPrice: 100000, originalPrice: '140.000đ', popular: false, bonus: '+20 Xu' },
  ];

  const premiumPackages = [
    {
      id: 'sub-month',
      name: 'Premium Tháng',
      price: '89.000đ',
      rawPrice: 89000,
      period: '/tháng',
      description: 'Phù hợp cho học sinh, sinh viên ôn thi ngắn hạn.',
      features: [
        'Cộng 1 xu/ngày',
        'Xem trước toàn bộ nội dung tài liệu',
        'Tải tài liệu Premium không tốn xu',
        'Tắt hoàn toàn quảng cáo',
        'Huy hiệu Premium nổi bật trên hồ sơ'
      ],
      popular: false,
      buttonText: 'Nâng cấp ngay'
    },
    {
      id: 'sub-year',
      name: 'Premium Năm',
      price: '499.000đ',
      rawPrice: 499000,
      period: '/năm',
      description: 'Tiết kiệm 50% chi phí. Dành cho mục tiêu học tập lâu dài.',
      features: [
        'Tải không giới hạn tài liệu',
        'Xem trước toàn bộ nội dung tài liệu',
        'Tải tài liệu Premium không tốn xu',
        'Tắt hoàn toàn quảng cáo',
        'Huy hiệu Premium nổi bật trên hồ sơ',
        'Gói hỏi đáp AI',
        'Hỗ trợ ưu tiên từ đội ngũ StudocShare 24/7'
      ],
      popular: true,
      buttonText: 'Trở thành VIP'
    }
  ];
  
  const handleBuyPackage = async (packageItem, type) => {
    if (!isSignedIn) {
      toast.error("Vui lòng đăng nhập để thực hiện giao dịch!");
      return;
    }

    try {
      const token = await getToken();
      
      const paymentRequest = {
        packageId: packageItem.id,
        amount: packageItem.rawPrice,
        returnUrl: "http://localhost:5173/premium" 
      };

      const response = await axios.post(
        "http://localhost:8080/api/v1.0/api/payment/create", 
        paymentRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error("Không thể khởi tạo cổng thanh toán, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi xử lý nạp xu:", error);
      toast.error("Đã xảy ra lỗi hệ thống khi kết nối VNPay!");
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const responseCode = queryParams.get('vnp_ResponseCode');
    const txnRef = queryParams.get('vnp_TxnRef');

    if (responseCode && txnRef) {
      const verifyPayment = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/v1.0/api/payment/vnpay_return${location.search}`);
          
          if (responseCode === '00') {
            toast.success("Thanh toán thành công! Tài khoản của bạn đã được cập nhật.");
            if (fetchUserCredits) {
              await fetchUserCredits(); 
            }
          } else {
            toast.error("Thanh toán không thành công hoặc giao dịch đã bị hủy!");
          }
        } catch (error) {
          console.error("Lỗi verify hóa đơn:", error);
          toast.error(error.response?.data || "Lỗi xác thực giao dịch từ hệ thống!");
        } finally {
          navigate('/premium', { replace: true });
        }
      };

      verifyPayment();
    }
  }, [location.search, navigate, fetchUserCredits]);

  return (
    <>
      <NavbarPage />
      <div className="bg-white border-b border-slate-200">
      </div>

      <div className="min-h-screen bg-slate-50/50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header giới thiệu */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200/60 px-3 py-1 rounded-full text-indigo-700 text-xs font-bold mb-4 shadow-sm animate-pulse">
              <Sparkles size={14} className="fill-indigo-100" />
              <span>Nâng Cấp Đặc Quyền Tài Khoản</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Mở khóa sức mạnh học tập cùng <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">StudocShare Premium</span>
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Sở hữu kho tài liệu chất lượng cao, tăng tốc quy trình ôn thi và làm chủ kiến thức với các đặc quyền không giới hạn ngay hôm nay.
            </p>
          </div>

          {/* PHẦN 1: GÓI PREMIUM SUBSCRIPTIONS */}
          <div className="mb-20">
            <div className="flex items-center gap-2 justify-center mb-8">
              <Crown className="text-amber-500 fill-amber-400" size={24} />
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Chọn gói Premium thành viên</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
              {premiumPackages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className={`relative bg-white rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    pkg.popular 
                      ? 'border-indigo-600 shadow-lg shadow-indigo-100 ring-1 ring-indigo-600' 
                      : 'border-slate-200 shadow-sm'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs px-4 py-1 rounded-full shadow-md">
                      ĐƯỢC YÊU THÍCH NHẤT
                    </span>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                    <p className="text-sm text-slate-500 mb-6">{pkg.description}</p>
                    
                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-4xl font-black text-slate-900 tracking-tight">{pkg.price}</span>
                      <span className="text-slate-500 font-medium text-sm">{pkg.period}</span>
                    </div>

                    <div className="h-px bg-slate-100 mb-8" />

                    <ul className="space-y-4 mb-8">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                          <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mt-0.5 shrink-0">
                            <Check size={12} className="text-emerald-600 stroke-[3]" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleBuyPackage(pkg, 'Gói Premium')}
                    className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 ${
                      pkg.popular
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <span>{pkg.buttonText}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* PHẦN 2: GÓI NẠP XU (CREDITS PART) */}
          <div>
            <div className="flex flex-col items-center justify-center mb-8 text-center">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="text-amber-500 fill-amber-400" size={24} />
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Nạp Xu mua lẻ tài liệu</h2>
              </div>
              <p className="text-sm text-slate-500">
                Số dư hiện tại của bạn: <span className="font-bold text-amber-600">{credits ?? 0} Xu</span>
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {coinPackages.map((pkg) => (
                <div 
                  key={pkg.id}
                  className={`bg-white border rounded-2xl p-6 text-center flex flex-col justify-between transition-all duration-200 hover:shadow-md relative ${
                    pkg.popular ? 'border-amber-400/80 bg-gradient-to-b from-amber-50/20 to-white' : 'border-slate-200'
                  }`}
                >
                  {pkg.bonus !== 'Không có' && (
                    <span className="absolute -top-2.5 right-4 bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-sm">
                      {pkg.bonus}
                    </span>
                  )}

                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center mb-4 shadow-sm">
                      <Coins className="text-amber-500 fill-amber-400" size={22} />
                    </div>
                    <span className="text-2xl font-black text-slate-800 tracking-wide mb-1">{pkg.coins} Xu</span>
                    
                    <div className="flex items-center gap-1.5 mb-6">
                      <span className="text-base font-bold text-slate-600">{pkg.price}</span>
                      {pkg.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">{pkg.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuyPackage(pkg, 'Gói Xu')}
                    className="w-full py-2.5 px-4 bg-white hover:bg-amber-500 hover:text-white text-amber-600 border border-amber-500/40 hover:border-amber-500 rounded-xl text-xs font-bold transition-all duration-150 shadow-sm active:scale-95"
                  >
                    Mua ngay
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default PremiumPage;