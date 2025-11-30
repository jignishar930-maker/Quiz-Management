import axios from 'axios';

// 🎯 બેકએન્ડનો મૂળભૂત URL સેટ કરો
const API_BASE_URL = 'http://127.0.0.1:8000';

// 1. કસ્ટમ axios ઇન્સ્ટન્સ બનાવો
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 2. વિનંતી (Request) માટે ઇન્ટરસેપ્ટર સેટ કરો
// આ ઇન્ટરસેપ્ટર દરેક આઉટગોઇંગ વિનંતી પહેલાં ચાલશે.
api.interceptors.request.use(
    config => {
        // localStorage માંથી access token મેળવો
        const token = localStorage.getItem('access_token');
        
        // જો ટોકન હાજર હોય, તો તેને Authorization હેડર તરીકે ઉમેરો
        if (token) {
            // અહીંયા 'Bearer' પછી સ્પેસ (Space) જરૂરી છે.
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // સુધારેલું કન્ફિગરેશન પાછું આપો
        return config;
    },
    error => {
        // વિનંતી ભૂલ (Request error) નું હેન્ડલિંગ
        return Promise.reject(error);
    }
);

export default api;