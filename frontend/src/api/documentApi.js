import axios from 'axios';
import apiEndpoints from './apiEndpoint'; 

export const documentApi = {
    fetchDocumentDetails: async (documentId) => {
        const response = await axios.get(apiEndpoints.PUBLIC_VIEW_FILE(documentId));
        

        return { 
            data: response.data, 
            status: response.status 
        };
    },

    submitComment: async (documentId, content) => {
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await delay(600); 
        
        const newComment = {
            id: Date.now(),
            user: "Hào Nguyễn", 
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60",
            content: content,
            date: "Vừa xong"
        };
        return { data: newComment, status: 201 };
    },

    submitRating: async (documentId, rating) => {
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await delay(500); 
        
        return { 
            data: {
                newRating: rating, 
                newReviewsCount: 1
            },
            status: 200 
        };
    }
};