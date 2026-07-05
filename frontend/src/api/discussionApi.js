import axios from 'axios';
import apiEndpoints from './apiEndpoint';

export const discussionApi = {
    getByFile: async (fileId) => {
        const res = await axios.get(apiEndpoints.GET_DISCUSSIONS(fileId));
        return res.data;
    },

    create: async (fileId, { content, parentId, userFullName, userPhotoUrl }, token) => {
        const res = await axios.post(
            apiEndpoints.CREATE_DISCUSSION(fileId),
            { content, parentId: parentId || null, userFullName, userPhotoUrl },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    },

    update: async (id, content, token) => {
        const res = await axios.put(
            apiEndpoints.UPDATE_DISCUSSION(id),
            { content },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    },

    remove: async (id, token) => {
        await axios.delete(apiEndpoints.DELETE_DISCUSSION(id), {
            headers: { Authorization: `Bearer ${token}` },
        });
    },
};