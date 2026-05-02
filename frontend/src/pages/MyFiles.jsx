import DashboardLayout from "../components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import Transaction from "./Transaction";
import apiEndpoints from "../util/apiEndpoint"
import {
  Copy,
  Download,
  Eye,
  File,
  Globe,
  Grid,
  List,
  Lock,
  Trash2,
  FileIcon, FileText, Image, Music, Video
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { data, Link, useNavigate } from "react-router-dom";
import FileCard from "../components/FileCard";

const MyFiles = () => {
  const [files, setFiles] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const { getToken } = useAuth();
  const navigate = useNavigate();

  // fetching the files for a logged in user

  const fetchFiles = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        apiEndpoints.FETCH_FILES,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.status === 200) {
        setFiles(response.data);
      }
    } catch (error) {
      console.log("Error fetching the files form sever: ", error);
      toast.error("Error fetching the files from server: ", error.message);
    }
  };

  // Toggle the public/private status of a file
  const togglePublic = async (fileToUpdate) => {
    try {
        const token = await getToken();
        await axios.patch(apiEndpoints.TOGGLE_FILE(fileToUpdate.id), {}, {headers: {Authorization: `Bearer ${token}`}});
        
        setFiles(files.map((file) => file.id === fileToUpdate.id ? {...file, isPublic: !file.isPublic} : file))
    } catch (error) {
        console.error('Error toggling file status', error);
        toast.error('Error toggling files status: ', error.message);
    }
  }

  //Handle file download
  const handleDownload = async (file) => {
    try {
        const token = await getToken();
        const response = await axios.get(apiEndpoints.DOWNLOAD_FILE(file.id), {headers: {Authorization: `Bearer ${token}`}, responseType: 'blob'});

        // create a blob url and trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file.name);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); // clean up the object url
    } catch (error) {
        console.log("Download failed", error);
        toast.error('Error downloading file', error.message);
    }
  }

  useEffect(() => {
    fetchFiles();
  }, [getToken]);

  const getFileIcon = (file) => {
    const extension = file.name.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
      return <Image size={24} className="text-purple-500" />;
    }
    if (["mp4", "webm", "mav", "avi", "mkv"].includes(extension)) {
      return <Video size={24} className="text-blue-500" />;
    }
    if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extension)) {
      return <Music size={24} className="text-green-500" />;
    }
    if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension)) {
      return <FileText size={24} className="text-amber-500" />;
    }
    return <FileIcon size={24} className="text-purple-500" />;
  };

  return (
    <DashboardLayout activeMenu="My Files">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Files {files.length}</h2>
          <div className="flex items-center gap-3">
            <List
              onClick={() => setViewMode("list")}
              size={24}
              className={`cursor-pointer transition-colors ${viewMode === "list" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            />
            <Grid
              size={24}
              onClick={() => setViewMode("grid")}
              className={`cursor-pointer transition-colors ${viewMode === "grid" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            />
          </div>
        </div>
        {files.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center">
            <File size={60} className="text-purple-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No file uploaded yet
            </h3>
            <p className="text-gray-500 text-gray-center max-w-md mb-6">
              Start uploading file to see them listed here. you can upload
              documents, images, and other files to share and manage them
              securely.
            </p>
            <button
              onClick={() => navigate("/upload")}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-color"
            >
              Go to upload
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {files.map((file) => (
                <FileCard 
                key={file.id}
                file={file}

                />
            ))}
          </div>
        ) : (
          <div className="overflow-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upload
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sharing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {files.map((file) => (
                  <tr
                    key={file.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file)}
                        {file.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {(file.size / 1024).toFixed(1)} Kb
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(file.uploadAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <button 
                        onClick={() => togglePublic(file)}
                        className="flex items-center gap-2 cursor-pointer group">
                          {file.isPublic ? (
                            <>
                              <Globe size={16} className="text-green-500" />
                              <span className="group-hover:underline">
                                Public
                              </span>
                            </>
                          ) : (
                            <>
                              <Lock size={16} className="text-gray-500" />
                              <span className="group-hover:underline">
                                Private
                              </span>
                            </>
                          )}
                        </button>
                        {file.isPublic && (
                          <button className="flex items-center gap-2 cursor-pointer group text-blue-600">
                            <Copy size={16} />
                            <span className="group-hover:underline">
                              Share Link
                            </span>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleDownload(file)}
                            title="Download"
                            className="text-gray-500 hover:text-blue-600"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                        <div className="flex justify-center">
                          <button
                            title="Delete"
                            className="text-gray-500 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="flex-justify-center">
                          {file.isPublic ? (
                            <a
                              href={`/file/${file.id}`}
                              title="View File"
                              target="_blank"
                              rel="noreferrer"
                              className="text-gray-500 hover:text-blue-600"
                            >
                              <Eye size={18} />
                            </a>
                          ) : (
                            <span className="w-[18px]"></span>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyFiles;
