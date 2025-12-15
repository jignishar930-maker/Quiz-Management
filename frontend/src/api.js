import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// 1. Axios Instance (for authenticated calls)
export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(async req => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        req.headers.Authorization = `Bearer ${accessToken}`;
    }
    return req;
}, error => {
    return Promise.reject(error);
});


// --- AUTHENTICATION FUNCTIONS ---

export const loginUser = async (username, password) => {
    try {
        // Simple JWT ટોકન મેળવવાનો સાચો એન્ડપોઇન્ટ
        const response = await axios.post(`${API_BASE_URL}/token/`, { 
            username, 
            password 
        });

        // 💡 Simple JWT માત્ર access અને refresh ટોકન્સ જ પાછા મોકલે છે.
        const { access, refresh } = response.data;
        
        // નોંધ: Simple JWT /token/ માં role કે user_id પાછું મોકલતું નથી. 
        // તેથી, આપણે તેને અહીં હાર્ડકોડ (Hardcode) કરીએ છીએ (તમારા સેટઅપ મુજબ).
        // જો યુઝર સુપરયુઝર હોય તો role 'admin' રાખો.
        const role = (username === 'jigu') ? 'admin' : 'student'; 
        const user_id = username; 

        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user_role', role); 
        localStorage.setItem('user_id', user_id); 

        // Login.jsx ને સફળતા જણાવવા માટે
        return { success: true, role, user_id }; 

    } catch (error) {
        // જો 401 Unauthorized ભૂલ આવે (ખોટો યુઝરનેમ/પાસવર્ડ), તો Login.jsx ને ભૂલ ફેંકો.
        if (error.response && error.response.status === 401) {
             // 'detail' કી Simple JWT માં ડિફોલ્ટ છે.
             throw new Error(error.response.data.detail || 'અમાન્ય ઓળખપત્રો.');
        }
        // અન્ય કોઈ સર્વર ભૂલ (દા.ત. 500)
        throw new Error('લૉગિન નિષ્ફળ. સર્વર ભૂલ.');
    }
};

export const registerUser = async (username, password, email, role) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register/`, {
            username,
            password,
            email,
            role 
        });
        return response.data; 
    } catch (error) {
        if (error.response && error.response.data) {
            // DRF ભૂલોને વાંચવાનો પ્રયાસ કરો
            const errorMsg = Object.values(error.response.data).flat().join(' ');
            throw new Error(errorMsg || 'નોંધણી નિષ્ફળ.');
        }
        throw new Error('. Server mistake.');
    }
};

export const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
};


// --- QUIZ MANAGEMENT FUNCTIONS (Example) ---

export const fetchAvailableQuizzes = async () => {
    try {
        // Authenticated call
        const response = await axiosInstance.get('/qms/quizzes/');
        return response.data;
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        throw new Error('ક્વિઝ લાવવામાં નિષ્ફળ.');
    }
};

export const fetchQuizDetail = async (quizId) => {
    try {
        const response = await axiosInstance.get(`/qms/quizzes/${quizId}/`);
        return response.data;
    } catch (error) {
        throw new Error('ક્વિઝ વિગતો લાવવામાં નિષ્ફળ.');
    }
};

export const submitQuizAttempt = async (quizId, answers) => {
    try {
        // answers: [{ question: id, selected_option: id }, ...]
        const response = await axiosInstance.post(`/qms/quizzes/${quizId}/submit/`, { answers });
        return response.data; // should return result_id, score, etc.
    } catch (error) {
        throw new Error('ક્વિઝ સબમિટ કરવામાં નિષ્ફળ.');
    }
};

export const fetchResultDetail = async (resultId) => {
    try {
        const response = await axiosInstance.get(`/qms/results/${resultId}/`);
        return response.data;
    } catch (error) {
        throw new Error('પરિણામની વિગતો લાવવામાં નિષ્ફળ.');
    }
};