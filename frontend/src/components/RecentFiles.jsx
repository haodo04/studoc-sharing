import {
  FileIcon,
  FileText,
  Image,
  Music,
  Video,
  Lock,
  Globe,
} from "lucide-react";

const RecentFiles = ({ files = [] }) => {
  const getFileIcon = (file) => {
    const extension = file.name?.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
      return <Image size={14} className="text-purple-500" />;
    }

    if (["mp4", "webm", "mov", "avi", "mkv"].includes(extension)) {
      return <Video size={14} className="text-blue-500" />;
    }

    if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extension)) {
      return <Music size={14} className="text-green-500" />;
    }

    if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension)) {
      return <FileText size={14} className="text-amber-500" />;
    }

    return <FileIcon size={14} className="text-blue-500" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">
          Recent Files ({files.length})
        </h3>
      </div>

      {files.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-gray-500">
          No recent files
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-50 text-gray-400 uppercase">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Size</th>
                <th className="px-4 py-3 text-left font-semibold">Uploaded By</th>
                <th className="px-4 py-3 text-left font-semibold">Modified</th>
                <th className="px-4 py-3 text-left font-semibold">Sharing</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 min-w-[180px]">
                      {getFileIcon(file)}
                      <span className="truncate text-gray-700 max-w-[180px]">
                        {file.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {formatFileSize(file.size)}
                  </td>

                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    You
                  </td>

                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {formatDate(file.uploadedAt)}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-gray-500">
                      {file.isPublic ? (
                        <>
                          <Globe size={12} className="text-green-500" />
                          <span>Public</span>
                        </>
                      ) : (
                        <>
                          <Lock size={12} className="text-gray-400" />
                          <span>Private</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentFiles;