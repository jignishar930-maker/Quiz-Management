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
        // અહીં Simple JWT નું /auth/token/ એન્ડપોઇન્ટ નહીં, પણ તમારા કસ્ટમ LoginView નો ઉપયોગ થાય છે:
        const response = await axios.post(`${API_BASE_URL}/auth/token/`, { 
            username, 
            password 
        });

        const { access, refresh, role, user_id } = response.data;
        
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user_role', role);
        localStorage.setItem('user_id', user_id);

        return { role, user_id }; 

    } catch (error) {
        if (error.response && error.response.status === 401) {
            throw new Error(error.response.data.error || 'અમાન્ય ઓળખપત્રો.');
        }
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
            const errorMsg = Object.values(error.response.data).flat().join(' ');
            throw new Error(errorMsg || 'નોંધણી નિષ્ફળ.');
        }
        throw new Error('નોંધણી નિષ્ફળ. સર્વર ભૂલ.');
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