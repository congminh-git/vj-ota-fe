'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import './sidebar.css';
import path from 'path';

function Sidebar() {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState('tim-chuyen');
    const [isDocs, setIsDocs] = useState(false);
    const popupRef = useRef(null);
    const pathName = usePathname();
    const router = useRouter();
    
    const smallSideBar = (e) => {
        setOpen(false);
    };

    const bigSideBar = (e) => {
        setOpen(true);
    };

    const handleMouseEnter = () => {
        setOpen(true);
    };

    useEffect(() => {
        function handleClick(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                if (!isDocs){
                    setOpen(false);
                }
            }
        }

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [isDocs]);

    useEffect(() => {
        const isDocsPath = pathName.includes('docs');
        setIsDocs(isDocsPath);
        
        if (pathName.includes('booking-management')) {
            setSelected('booking-management');
        } else if (pathName == '/booking' || pathName == '/booking/' || pathName.includes('/booking/')) {
            setSelected('booking');
        } else if (isDocsPath) {
            setSelected('docs');
            setOpen(true);
        } else {
            setSelected('api-swagger');
        }
    }, [pathName]);

    return (
        <div id="side-bar" className="side-bar" ref={popupRef}>
            <div
                className={`${
                    open ? 'sm:w-72' : 'sm:w-16'
                } bg-white border-r h-20 sm:h-full shadow-lg flex-none z-10 relative w-full`}
            >
                <div
                    className={`${
                        open ? 'sm:w-72' : 'sm:w-16'
                    } bg-white shadow-lg sm:shadow-none w-full border-r fixed left-0 top-0 side-bar px-2 sm:px-0 flex sm:block justify-between items-center`}
                >
                    <div
                        className={`lg:w-full p-2 flex ${
                            open ? 'justify-between' : 'justify-center'
                        } items-center transition-all`}
                        style={{ height: '72px' }}
                    >
                        <button>
                            <Link href="/booking"></Link>
                        </button>
                        <button>
                            <Link href="/">
                                <span
                                    className={`text-xl text-sky-400 font-bold block ${
                                        open ? 'sm:block' : 'sm:hidden'
                                    }`}
                                >
                                    Booking demo
                                </span>
                            </Link>
                        </button>
                        <button
                            onClick={smallSideBar}
                            className={`text-sky-400 hidden ${open ? 'sm:block' : 'sm:hidden'}`}
                        >
                            <svg
                                className="h-4 w-4"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" /> <polyline points="11 7 6 12 11 17" />{' '}
                                <polyline points="17 7 12 12 17 17" />
                            </svg>
                        </button>
                        <button
                            onClick={bigSideBar}
                            className={`text-sky-400 hidden ${open ? 'sm:hidden' : 'sm:block'}`}
                        >
                            <svg
                                className="h-4 w-4"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" /> <polyline points="7 7 12 12 7 17" />{' '}
                                <polyline points="13 7 18 12 13 17" />
                            </svg>
                        </button>
                    </div>
                    <div className="sm:mt-2 sm:block flex justify-between items-center">
                        <button
                            className={`flex ${
                                open ? 'justify-start' : 'justify-center'
                            } items-center text-gray-500 hover:bg-sky-100 hover:text-sky-400 ${
                                selected == 'booking'
                                    ? 'sm:bg-sky-100 sm:border-transparent text-sky-400 border-b-2 border-sky-400'
                                    : 'border-b-2 border-transparent'
                            } cursor-pointer p-3 w-full text-start mr-2 sm:mr-0`}
                        >
                            <Link className="flex items-center" href="/">
                                <svg
                                    className={`h-5 w-5 ${open ? 'mr-2' : 'mr-0'}`}
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    {' '}
                                    <path stroke="none" d="M0 0h24v24H0z" />{' '}
                                    <path
                                        d="M15 12h5a2 2 0 0 1 0 4h-15l-3 -6h3l2 2h3l-2 -7h3z"
                                        transform="rotate(-15 12 12) translate(0 -1)"
                                    />{' '}
                                    <line x1="3" y1="21" x2="21" y2="21" />
                                </svg>
                                <span className={`text-sm font-semibold ${open ? 'block' : 'hidden'}`}>
                                    <span>Tìm chuyến bay</span>
                                </span>
                            </Link>
                        </button>
                        <button
                            className={`flex ${
                                open ? 'justify-start' : 'justify-center'
                            } items-center text-gray-500 hover:bg-sky-100 hover:text-sky-400 ${
                                selected == 'booking-management'
                                    ? 'sm:bg-sky-100 sm:border-transparent text-sky-400 border-b-2 border-sky-400'
                                    : 'border-b-2 border-transparent'
                            } cursor-pointer p-3 w-full text-start mr-2 sm:mr-0`}
                        >
                            <Link className="flex items-center" href="/booking-management">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className={`size-5 ${open ? 'mr-2' : 'mr-0'}`}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                                    />
                                </svg>

                                <span className={`text-sm font-semibold ${open ? 'block' : 'hidden'}`}>
                                    <span>Quản lý booking</span>
                                </span>
                            </Link>
                        </button>
                        <button
                            className={`flex ${
                                open ? 'justify-start' : 'justify-center'
                            } items-center text-gray-500 hover:bg-sky-100 hover:text-sky-400 ${
                                selected == 'api-swagger'
                                    ? 'sm:bg-sky-100 sm:border-transparent text-sky-400 border-b-2 border-sky-400'
                                    : 'border-b-2 border-transparent'
                            } cursor-pointer p-3 w-full text-start mr-2 sm:mr-0`}
                        >
                            <Link
                                className="flex items-center"
                                href={process.env.NEXT_PUBLIC_PUBLICAPI_URL + '/api-docs'}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    className={`size-5 ${open ? 'mr-2' : 'mr-0'}`}
                                >
                                    <circle cx="12" cy="12" r="9" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 8c-1 .5-2 2-2 4s1 3.5 2 4"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 8c1 .5 2 2 2 4s-1 3.5-2 4"
                                    />
                                    <circle cx="10.5" cy="12" r="0.8" />
                                    <circle cx="12" cy="12" r="0.8" />
                                    <circle cx="13.5" cy="12" r="0.8" />
                                </svg>
                                <span className={`text-sm font-semibold ${open ? 'block' : 'hidden'}`}>
                                    <span>API swagger</span>
                                </span>
                            </Link>
                        </button>
                        <button
                            className={`flex ${
                                open ? 'justify-start' : 'justify-center'
                            } items-center text-gray-500 hover:bg-sky-100 hover:text-sky-400 ${
                                selected == 'docs'
                                    ? 'sm:bg-sky-100 sm:border-transparent text-sky-400 border-b-2 border-sky-400'
                                    : 'border-b-2 border-transparent'
                            } cursor-pointer p-3 w-full text-start mr-2 sm:mr-0`}
                        >
                            <Link className="flex items-center" href="/docs">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className={`size-5 ${open ? 'mr-2' : 'mr-0'}`}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                                    />
                                </svg>
                                <span
                                    className={`text-sm font-semibold ${
                                        open ? 'flex justify-between items-center' : 'hidden'
                                    }`}
                                >
                                    <span className='mr-4'>Business Document</span>
                                    <ChevronLeft
                                        className={`w-4 h-4 transition-transform duration-300 ${
                                            isDocs ? '-rotate-90' : ''
                                        }`}
                                    />
                                </span>
                            </Link>
                        </button>
                        {isDocs && open ? (
                            <ul className="ml-6 mt-1">
                                <li className={`text-gray-600 hover:bg-sky-100 hover:text-sky-400 rounded cursor-pointer ${pathName.includes("/docs/master-data") ? "bg-sky-100 text-sky-400" : ""}`}>
                                    <Link href="/docs/master-data" className="block py-2 px-4 text-sm">
                                        Master Data
                                    </Link>
                                </li>
                                <li className={`text-gray-600 hover:bg-sky-100 hover:text-sky-400 rounded cursor-pointer ${pathName.includes("/docs/booking-flow") ? "bg-sky-100 text-sky-400" : ""}`}>
                                    <Link href="/docs/booking-flow" className="block py-2 px-4 text-sm">
                                        Booking Flow
                                    </Link>
                                </li>
                                <li className={`text-gray-600 hover:bg-sky-100 hover:text-sky-400 rounded cursor-pointer ${pathName.includes("/docs/manage-booking-flow") ? "bg-sky-100 text-sky-400" : ""}`}>
                                    <Link href="/docs/manage-booking-flow" className="block py-2 px-4 text-sm">
                                        Manage Booking Flow
                                    </Link>
                                </li>
                            </ul>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;