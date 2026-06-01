import { useEffect, useState } from "react";
import { Check, Copy, X } from "lucide-react";
import toast from "react-hot-toast";

const LinkShareModal = ({ isOpen, onClose, link = "", title = "Share File" }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) setCopied(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Đã sao chép liên kết vào bộ nhớ tạm");
    } catch (error) {
      toast.error("Không thể sao chép liên kết");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50/50">
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body Modal Input */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={link}
              className="h-10 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-600 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-all active:scale-95 ${
                copied
                  ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                  : "border-slate-200 bg-white text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          {copied && (
            <p className="flex items-center gap-1 text-xs font-medium text-emerald-600 animate-in slide-in-from-top-1 duration-200">
              <Check size={12} />
              Đã sao chép đường dẫn liên kết thành công.
            </p>
          )}

          <p className="text-xs text-slate-400 leading-relaxed">
            Bất kỳ ai nhận được đường liên kết này đều có quyền truy cập trực tiếp và tải xuống tài liệu được chia sẻ.
          </p>
        </div>

        {/* Footer Actions Button */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3.5 bg-slate-50/30">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Đóng lại
          </button>

          <button
            onClick={handleCopy}
            className={`rounded-lg px-4 py-2 text-xs font-semibold text-white transition-all shadow-sm ${
              copied
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
            }`}
          >
            {copied ? "Đã sao chép" : "Sao chép Link"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default LinkShareModal;