'use client';

import { postUserSessions } from '@/services/userSessions/functions';
import { useState, useEffect, useRef } from 'react';
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
    const redirectingRef = useRef(false);
    
    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await getCookie('token');
                const apikey = await getCookie('apikey');

                if (token && apikey && !redirectingRef.current) {
                    redirectingRef.current = true;
                    router.replace('/booking');
                }
            } catch (e) {
                console.error('Check token error:', e);
            }
        };

        checkToken();
    }, [router]);

    const handleLogin = async () => {
        if (loading || redirectingRef.current) return;
        setLoading(true);
        setError('');
        try {
            const loginResult = await postUserSessions({
                username,
                password,
                apikey,
            });
            if (!loginResult?.accessToken) {
                const messageText =
                    loginResult?.message || 'Sai tài khoản hoặc mật khẩu.';
                await Swal.fire({
                    icon: 'error',
                    title: 'Đăng nhập thất bại',
                    text: messageText,
                });
                setError(messageText);
                return;
            }

            await saveCookie({
                name: 'token',
                data: loginResult.accessToken,
                time: 302380,
            });

            await saveCookie({
                name: 'apikey',
                data: apikey,
                time: 302380,
            });

            /**
             * Đợi browser flush cookie (tránh race condition trên máy mạnh)
             */
            await new Promise((resolve) => setTimeout(resolve, 50));

            redirectingRef.current = true;
            router.replace('/booking');
        } catch (err) {
            const serverMessage =
                err?.response?.data?.message ??
                err?.message ??
                'Đã xảy ra lỗi. Vui lòng thử lại.';

            const messageText =
                typeof serverMessage === 'string'
                    ? serverMessage
                    : JSON.stringify(serverMessage);

            await Swal.fire({
                icon: 'error',
                title: 'Đăng nhập thất bại',
                text: messageText,
            });

            setError(messageText);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <section className="block bg-[url('/globalImages/loginbg.png')] bg-cover">
                <div className="flex flex-col items-end justify-center mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-sm xl:p-0 shadow-lg sm:mr-[6%]">
                        <div className="p-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Đăng nhập
                            </h1>
                            <p className="mb-4 text-xs text-gray-500">
                                Đăng nhập bằng API account
                            </p>

                            <div className="space-y-2 md:space-y-4">
                                <div>
                                    <label
                                        htmlFor="username"
                                        className="block text-sm font-medium text-gray-900"
                                    >
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2"
                                        placeholder="API USER"
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-900"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2"
                                        placeholder="••••••••"
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="apikey"
                                        className="block text-sm font-medium text-gray-900"
                                    >
                                        API Key
                                    </label>
                                    <input
                                        type="text"
                                        id="apikey"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2"
                                        placeholder="API KEY"
                                        onChange={(e) =>
                                            setApikey(e.target.value)
                                        }
                                        disabled={loading}
                                    />
                                </div>

                                {error && (
                                    <div className="text-red-500 text-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleLogin}
                                    disabled={loading}
                                    className="w-full text-white bg-gradient-to-r from-[#F9A51A] via-[#FBB612] to-[#FFDD00] shadow focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-60"
                                >
                                    {loading
                                        ? 'Đang đăng nhập...'
                                        : 'Sign in'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
