'use client';

import { postUserSessions } from '@/services/userSessions/functions'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie, saveCookie } from '@/services/userSessions/saveCookie';
import Swal from 'sweetalert2';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [apikey, setApikey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Chỉ check token 1 lần khi mount
        const checkToken = async () => {
            const token = await getCookie('token');
            const apikey = await getCookie('apikey');
            if (token && apikey) {
                router.replace('/booking');
            }
        };
        checkToken();
    }, [router]);

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const loginResult = await postUserSessions({ username, password, apikey });
            if (loginResult.accessToken) {
                await saveCookie({ name: 'apikey', data: apikey, time: 302380 });
                router.replace('/booking');
            } else {
                const messageText = loginResult?.message || 'Sai tài khoản hoặc mật khẩu.';
                await Swal.fire({ icon: 'error', title: 'Đăng nhập thất bại', text: messageText });
                setError(messageText);
            }
        } catch (err) {
            const serverMessage = err?.response?.data?.message ?? err?.message ?? 'Đã xảy ra lỗi. Vui lòng thử lại.';
            const messageText = typeof serverMessage === 'string' ? serverMessage : JSON.stringify(serverMessage);
            await Swal.fire({ icon: 'error', title: 'Đăng nhập thất bại', text: messageText });
            setError(messageText);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen "> 
            <section className="block bg-[url('/loginbg.png')] bg-cover">
                <div className="flex flex-col items-end justify-center mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-sm xl:p-0 shadow-lg sm:mr-[6%]">
                        <div className="p-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Đăng nhập
                            </h1>
                            <p className="mb-4 text-xs text-gray-500">
                                Đăng nhập bằng API account
                            </p>
                            <div className="space-y-2 md:space-y-4" action="#">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-900">Username</label>
                                    <input type="text" name="username" id="username" onChange={(e)=>setUsername(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2" placeholder="API USER" required="" disabled={loading}/>
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
                                    <input type="password" name="password" id="password" onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2" required="" disabled={loading}/>
                                </div>
                                <div>
                                    <label htmlFor="apikey" className="block text-sm font-medium text-gray-900">API Key</label>
                                    <input type="text" name="apikey" id="apikey" onChange={(e)=>setApikey(e.target.value)} placeholder="API KEY" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2" required="" disabled={loading}/>
                                </div>
                                {error && <div className="text-red-500 text-sm">{error}</div>}
                                <div className="flex items-center justify-between">
                                    {/* <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-sky-300" required=""/>
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="remember" className="text-gray-500">Remember me</label>
                                        </div>
                                    </div> */}
                                    {/* <a href="#" className="text-sm font-medium text-sky-600 hover:underline">Forgot password?</a> */}
                                </div>
                                <button className="w-full text-white bg-gradient-to-r from-[#F9A51A] via-[#FBB612] to-[#FFDD00] shadow focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-60" onClick={handleLogin} disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Sign in'}</button>
                                {/* <p className="text-sm font-light text-gray-500">
                                    Don’t have an account yet? <a href="#" className="font-medium text-sky-600 hover:underline ">Sign up</a>
                                </p> */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}