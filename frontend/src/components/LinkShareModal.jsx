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
      toast.success("Link copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4">
          <p className="mb-3 text-sm text-gray-600">
            Share this link with others to give them access to this file.
          </p>

          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-md border-2 border-purple-500 bg-white px-3 py-2">
              <input
                type="text"
                value={link || ""}
                readOnly
                className="w-full bg-transparent text-sm text-gray-700 outline-none"
              />
            </div>

            <button
              onClick={handleCopy}
              className={`flex h-10 w-10 items-center justify-center rounded-md border ${
                copied
                  ? "border-green-200 bg-green-50 text-green-600"
                  : "border-gray-200 bg-white text-gray-500 hover:text-purple-600"
              }`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>

          {copied && (
            <p className="mt-2 flex items-center gap-1 text-sm text-green-600">
              <Check size={14} />
              Link copied to clipboard
            </p>
          )}

          <p className="mt-3 text-sm text-gray-500">
            Anyone with this link can access this file.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Close
          </button>

          <button
            onClick={handleCopy}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
              copied
                ? "bg-green-600 hover:bg-green-700"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkShareModal;