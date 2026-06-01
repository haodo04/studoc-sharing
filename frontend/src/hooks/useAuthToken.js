import { useAuth } from "@clerk/clerk-react";

// một custom hook
export function useAuthToken() {
  const { getToken } = useAuth();

  const getValidToken = async () => {
    try {
      // Tự động lấy token an toàn từ Clerk
      return await getToken(); 
    } catch (error) {
      console.error("Lỗi lấy token bảo mật:", error);
      return null;
    }
  };

  return { getValidToken };
}