import axios from "axios";
import { createContext, useCallback, useEffect, useState, useContext } from "react"; 
import apiEndpoints from "../api/apiEndpoint";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

export const UserCreditsContext = createContext();

export const UserCreditsProvider = ({children}) => {
    const [credits, setCredits] = useState(5);
    const [plan, setPlan] = useState("BASIC");
    const [planExpiresAt, setPlanExpiresAt] = useState(null);
    const [loading, setLoading] = useState(false);
    const {getToken, isSignedIn} = useAuth();

    const fetchUserCredits = useCallback(async () => {
        if (!isSignedIn) return;

        setLoading(true);

        try {
            const token = await getToken();
            const response = await axios.get(apiEndpoints.GET_CREDITS, {headers: {Authorization: `Bearer ${token}`}});
            if (response.status === 200) {
                setCredits(response.data.credits);
                setPlan(response.data.plan || "BASIC");
                setPlanExpiresAt(response.data.planExpiresAt || null);
            } else {
                toast.error('Unable to get the user credits.');
            }
        } catch (error) {
            console.error('Error fetching the user credits', error);
        } finally {
            setLoading(false);
        }
    }, [getToken, isSignedIn]);

    useEffect(() => {
        if (isSignedIn) 
            fetchUserCredits();
    }, [fetchUserCredits, isSignedIn]);

    const updateCredits = useCallback(newCredits => {
        console.log('Updating the credits', newCredits);
        setCredits(newCredits);
    }, []);
    
    const isPremiumYearActive =
        plan === "Premium Năm" && (!planExpiresAt || new Date(planExpiresAt) > new Date());

    const isPremiumMonthActive =
        plan === "Premium Tháng" && (!planExpiresAt || new Date(planExpiresAt) > new Date());

    const contextValue = {
        credits,
        setCredits,
        plan,
        planExpiresAt,
        isPremiumYearActive,
        isPremiumMonthActive,
        fetchUserCredits,
        updateCredits,
        loading 
    }

    return (
        <UserCreditsContext.Provider value={contextValue}>
            {children}
        </UserCreditsContext.Provider>
    )
}

export const useUserCredits = () => {
    const context = useContext(UserCreditsContext);
    if (!context) {
        throw new Error('useUserCredits phải được sử dụng bên trong UserCreditsProvider');
    }
    return context;
};

export default UserCreditsContext;