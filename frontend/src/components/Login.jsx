import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Zap } from 'lucide-react'; // Icons

// API functions tšeo di importiwago ka go šomiša tsela yeo e nepagetšego ya "../api.js"
import { loginUser, registerUser } from '../api.js';

const Login = () => {
    // Hook ya React Router ya go šomiša navigation
    const navigate = useNavigate();

    // State ya data ya fomo
    const [isLogin, setIsLogin] = useState(true); // Fetola gare ga Login le Register
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    
    // State ya dikarabo tša UI
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' goba 'error'

    // Khomponente ya go bontšha melaetša
    const MessageDisplay = ({ type, text }) => {
        if (!text) return null;
        const colorClass = type === 'success' 
            ? 'bg-green-100 border-green-400 text-green-700' 
            : 'bg-red-100 border-red-400 text-red-700';
        
        return (
            <div className={`p-3 border rounded-lg mb-4 text-sm ${colorClass}`}>
                {text}
            </div>
        );
    };

    // Mohlokomedi wa go romela fomo
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        let result;

        if (isLogin) {
            // LOGIC YA GO LOGINA
            result = await loginUser(username, password);
            
            if (result.success) {
                // Ditokene di šetše di bolokilwe ka go api.js
                setMessageType('success');
                setMessage('Go logina go atlegile! Re go fetišetša...');
                
                // Fetela go dashboard/leta la dikwese morago ga nako e kopana
                setTimeout(() => {
                    navigate('/'); 
                }, 1000);
            } else {
                setMessageType('error');
                setMessage(`Go Logina go Paletšwe: ${result.error}`);
            }

        } else {
            // LOGIC YA GO NGWADIŠA
            // Netefatša gore imeil e a nyakega bakeng sa go ngwadiša
            if (!email) {
                 setMessageType('error');
                 setMessage('Imeil e a nyakega bakeng sa go ngwadiša.');
                 setLoading(false);
                 return;
            }

            result = await registerUser(username, email, password);
            
            if (result.success) {
                setMessageType('success');
                setMessage('Go ngwadiša go atlegile! Hle logina.');
                // Fetolela morago go ponalo ya go logina ka go itira
                setIsLogin(true);
            } else {
                setMessageType('error');
                setMessage(`Go Ngwadiša go Paletšwe: ${result.error}`);
            }
        }
        
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
                
                {/* Hlogo */}
                <div className="flex flex-col items-center mb-6">
                    <Zap className="w-10 h-10 text-indigo-600 mb-2"/>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {isLogin ? 'Go Boela ga o amošelege!' : 'Bopa Akhaonto'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Sisteme ya Taolo ya Dikwese</p>
                </div>

                {/* Lebokose la Molaetša */}
                <MessageDisplay type={messageType} text={message} />

                {/* Fomo */}
                <form onSubmit={handleSubmit}>
                    
                    {/* Kgoro ya Username */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
                            Leina la Mošomiši
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
                            placeholder="Molaetša leina la mošomiši"
                            required
                        />
                    </div>

                    {/* Kgoro ya Imeil (Fela bakeng sa Go Ngwadiša) */}
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                                Imeil
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
                                placeholder="Molaetša imeil ya gago"
                                required={!isLogin} // Imeil e a nyakega fela nakong ya go ngwadiša
                            />
                        </div>
                    )}

                    {/* Kgoro ya Sephiri */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                            Sephiri
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
                            placeholder="Molaetša sephiri sa gago"
                            required
                        />
                    </div>

                    {/* Konope ya Go Romela */}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading && (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isLogin ? (
                                <>
                                    <LogIn className="w-5 h-5 mr-2" />
                                    {loading ? 'E a Logina...' : 'Logina'}
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5 mr-2" />
                                    {loading ? 'E a Ngwadiša...' : 'Ngwadiša'}
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Kgokaganyo ya Go Fetola */}
                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setMessage('');
                            setUsername('');
                            setPassword('');
                            setEmail('');
                        }}
                        className="inline-block align-baseline font-bold text-sm text-indigo-500 hover:text-indigo-800 transition duration-150"
                    >
                        {isLogin ? "Ga go na akhaonto? Ngwadiša" : "O šetše o na le akhaonto? Logina"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;