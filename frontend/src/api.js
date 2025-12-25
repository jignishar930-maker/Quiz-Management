import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// 1. Axios Instance
export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: આપોઆપ ટોકન ઉમેરવા માટે
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
        const response = await axios.post(`${API_BASE_URL}/token/`, { username, password });
        const { access, refresh } = response.data;
        
        // જો 'jigu' નામનો યુઝર હોય તો તેને એડમિન રોલ આપવો
        const role = (username === 'jigu') ? 'admin' : 'student'; 
        
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user_role', role); 
        localStorage.setItem('user_id', username); 

        return { success: true, role }; 
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'લૉગિન નિષ્ફળ.');
    }
};

// ✅ આ ફંક્શન પાછું ઉમેર્યું છે
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
        throw new Error(error.response?.data?.detail || 'નોંધણી નિષ્ફળ.');
    }
};

export const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
};


// --- QUIZ FUNCTIONS ---

export const fetchAvailableQuizzes = async () => {
    const response = await axiosInstance.get('/qms/quizzes/');
    return response.data;
};

export const fetchQuizDetail = async (quizId) => {
    const response = await axiosInstance.get(`/qms/quizzes/${quizId}/`);
    return response.data;
};

export const submitQuiz = async (quizId, answers) => {
    try {
        const response = await axiosInstance.post('/qms/submit/', {
            quiz_id: quizId,
            answers: answers
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'સબમિટ કરવામાં ભૂલ આવી.');
    }
};

export const fetchUserResults = async () => {
    try {
        const response = await axiosInstance.get('/qms/user-results/'); // Django URL સાથે મેચ થાય છે
        return response.data;
    } catch (error) {
        throw error;
    }
};