import axios from 'axios';

// બેકએન્ડ API બેઝ URL
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// 1. Axios ઇન્સ્ટન્સ બનાવો જે દરેક રિક્વેસ્ટમાં JWT Access Token મોકલશે
// આ ઇન્સ્ટન્સનો ઉપયોગ ફક્ત authenticated calls માટે કરવામાં આવશે.
export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Token Refresh Logic (ઇન્ટરસેપ્ટર)
// જો Access Token Expire થઈ જાય, તો Refresh Token નો ઉપયોગ કરીને નવું Token મેળવવાનો પ્રયાસ કરો.
axiosInstance.interceptors.request.use(async req => {
    const accessToken = localStorage.getItem('access_token');
    
    // જો Access Token હાજર હોય, તો તેને Header માં ઉમેરો
    if (accessToken) {
        req.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // અહીં Token Expiration Check માટેનું જટિલ લોજિક ઉમેરી શકાય છે,
    // પરંતુ સરળતા માટે, આપણે ફક્ત 401 (Unauthorized) Error ને હેન્ડલ કરીશું.
    
    return req;
}, error => {
    return Promise.reject(error);
});


// --- AUTHENTICATION FUNCTIONS ---

// 3. User Login Function
export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/token/`, { 
            username, 
            password 
        });

        // Login સફળ થયા પછી Tokens અને User Details સ્ટોર કરો
        const { access, refresh, role, user_id } = response.data;
        
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user_role', role);
        localStorage.setItem('user_id', user_id);

        return { role, user_id }; // UI અપડેટ કરવા માટે રોલ પાછો મોકલો

    } catch (error) {
        if (error.response && error.response.status === 401) {
            throw new Error(error.response.data.error || 'Invalid credentials.');
        }
        throw new Error('Login failed. Server error.');
    }
};

// 4. User Registration Function
export const registerUser = async (username, password, email, role) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register/`, {
            username,
            password,
            email,
            role // 'student' અથવા 'teacher'
        });
        return response.data; // સફળતાનો સંદેશ
    } catch (error) {
        // Validation Errors (જેમ કે યુઝરનેમ પહેલેથી જ અસ્તિત્વમાં છે)
        if (error.response && error.response.data) {
            // DRF Validation Errors ને સરળ સ્ટ્રિંગમાં કન્વર્ટ કરો
            const errorMsg = Object.values(error.response.data).flat().join(' ');
            throw new Error(errorMsg || 'Registration failed.');
        }
        throw new Error('Registration failed. Server error.');
    }
};

// 5. User Logout Function
export const logoutUser = () => {
    // Local storage માંથી બધી Authentication માહિતી દૂર કરો
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
};


// --- QUIZ MANAGEMENT FUNCTIONS (Example) ---

// 6. Fetch Available Quizzes (બધા માટે, રોલની પરવા કર્યા વિના)
export const fetchAvailableQuizzes = async () => {
    try {
        // અહીં આપણે axiosInstance નો ઉપયોગ કરીશું, કારણ કે આમાં authorization header ઉમેરાય છે,
        // ભલે આપણે backend views.py માં AllowAny સેટ કર્યું હોય.
        const response = await axiosInstance.get('/qms/quizzes/');
        return response.data;
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        // જો 401 હોય, તો યુઝરને લૉગિન કરવા માટે કહો.
        throw new Error('Failed to fetch quizzes. Please check server or login status.');
    }
};

// 7. Teacher માટે નવો Quiz બનાવવા માટેનું ફંક્શન
export const createQuiz = async (quizData) => {
    try {
        // આ એક authenticated call છે, તેથી axiosInstance નો ઉપયોગ કરો
        const response = await axiosInstance.post('/qms/quizzes/', quizData);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 403) {
             throw new Error("You do not have permission to create a quiz (Teacher role required).");
        }
        throw new Error('Failed to create quiz.');
    }
};