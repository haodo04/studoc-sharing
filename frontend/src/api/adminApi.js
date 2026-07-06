import axios from "axios";
import apiEndpoints from "./apiEndpoint";

export const getDashboardStats = async (token) => {
    try {
        const response = await axios.get(`${apiEndpoints.API_BASE_URL}/admin/dashboard-stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard stats", error);
        throw error;
    }
};

export const getAdminUsers = async (token) => {
    try {
        const response = await axios.get(`${apiEndpoints.API_BASE_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching admin users", error);
        throw error;
    }
};

export const toggleUserBan = async (clerkId, token) => {
    try {
        const response = await axios.put(`${apiEndpoints.API_BASE_URL}/admin/users/${clerkId}/ban`, null, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error toggling user ban status", error);
        throw error;
    }
};

export const getAdminDocuments = async (token) => {
    try {
        const response = await axios.get(`${apiEndpoints.API_BASE_URL}/admin/documents`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching admin documents", error);
        throw error;
    }
};

export const toggleAdminDocumentVisibility = async (id, token) => {
    try {
        const response = await axios.put(`${apiEndpoints.API_BASE_URL}/admin/documents/${id}/toggle-visibility`, null, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error toggling document visibility", error);
        throw error;
    }
};

export const deleteAdminDocument = async (id, token) => {
    try {
        const response = await axios.delete(`${apiEndpoints.API_BASE_URL}/admin/documents/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting document", error);
        throw error;
    }
};

export const getAdminCommunityActivities = async (token) => {
    try {
        const response = await axios.get(`${apiEndpoints.API_BASE_URL}/admin/community`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching admin community activities", error);
        throw error;
    }
};

export const deleteAdminCommunityActivity = async (type, id, token) => {
    try {
        const response = await axios.delete(`${apiEndpoints.API_BASE_URL}/admin/community/${type}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting community activity", error);
        throw error;
    }
};

export const getAdminTransactions = async (token) => {
    try {
        const response = await axios.get(`${apiEndpoints.API_BASE_URL}/admin/transactions`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching admin transactions", error);
        throw error;
    }
};

export const getAdminReports = async (token) => {
    try {
        const response = await axios.get(`${apiEndpoints.API_BASE_URL}/admin/reports`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching admin reports", error);
        throw error;
    }
};

export const updateAdminReportStatus = async (id, status, token) => {
    try {
        const response = await axios.put(`${apiEndpoints.API_BASE_URL}/admin/reports/${id}/status`, 
            { status },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating admin report status", error);
        throw error;
    }
};
