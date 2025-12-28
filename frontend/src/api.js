import axios from 'axios';

// 1. Base URL સેટિંગ્સ
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// 2. Axios Instance બનાવો
// આ ઇન્સ્ટન્સ દરેક રિક્વેસ્ટમાં 'application/json' હેડર આપોઆપ ઉમેરશે.
export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 3. Request Interceptor: દરેક રિક્વેસ્ટમાં ટોકન ઉમેરવા માટે
// આ લોજિક એ સુનિશ્ચિત કરે છે કે જો યુઝર લોગિન હોય, તો તેનું ટોકન હેડરમાં જાય.
axiosInstance.interceptors.request.use(async (config) => {
    const accessToken = localStorage.getItem('access_token'); // અહીં નામ 'access_token' રાખ્યું છે
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


// --- AUTHENTICATION FUNCTIONS (લોગિન અને રજીસ્ટ્રેશન) ---

export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/token/`, { username, password });
        const { access, refresh } = response.data;
        
        // જો 'jigu' નામનો યુઝર હોય તો તેને એડમિન રોલ આપવો, બાકી સ્ટુડન્ટ
        const role = (username === 'jigu') ? 'admin' : 'student'; 
        
        // મહત્વનું: અહીં 'access_token' નામથી જ સ્ટોર કરો જેથી QuizAttempt માં ભૂલ ન આવે
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user_role', role); 
        localStorage.setItem('user_id', username); 

        return { success: true, role }; 
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'લોગિન નિષ્ફળ. યુઝરનેમ અથવા પાસવર્ડ તપાસો.');
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
        throw new Error(error.response?.data?.detail || 'નોંધણી નિષ્ફળ.');
    }
};

export const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
};


// --- QUIZ FUNCTIONS (ક્વિઝને લગતા ફંક્શન) ---

// બધી ઉપલબ્ધ ક્વિઝ મેળવવા માટે
export const fetchAvailableQuizzes = async () => {
    const response = await axiosInstance.get('/qms/quizzes/');
    return response.data;
};

// કોઈ એક ચોક્કસ ક્વિઝની વિગતો મેળવવા માટે
export const fetchQuizDetail = async (quizId) => {
    const response = await axiosInstance.get(`/qms/quizzes/${quizId}/`);
    return response.data;
};

// ક્વિઝ સબમિટ કરવા માટે
export const submitQuiz = async (quizId, answers) => {
    try {
        const response = await axiosInstance.post('/qms/submit/', {
            quiz_id: quizId,
            answers: answers
        });
        return response.data;
    } catch (error) {
        console.error("Submission Error Details:", error.response?.data);
        throw new Error(error.response?.data?.erroe ||  'submission error.');
    }
};

// યુઝરના જૂના રિઝલ્ટ્સ જોવા માટે
export const fetchUserResults = async () => {
    try {
        const response = await axiosInstance.get('/qms/user-results/');
        return response.data;
    } catch (error) {
        console.error("Results fetching error:", error);
        throw error;
    }
};