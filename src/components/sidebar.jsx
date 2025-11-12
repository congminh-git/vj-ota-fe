'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import './sidebar.css';

function Sidebar() {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState('tim-chuyen');
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
                setOpen(false);
            }
        }

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    useEffect(() => {
        if (pathName.includes('booking-management')) {
            setSelected('booking-management');
        } else {
            setSelected('tim-chuyen');
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
                            <Link href="/booking">
                                {/* <div
                                    className={`bg-[url('/logo_brand.png')] h-full w-full bg-cover ${
                                        open ? 'block' : 'hidden'
                                    }`}
                                ></div> */}
                            </Link>
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
                                selected == 'tim-chuyen'
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
                                    className={`h-5 w-5 ${open ? 'mr-2' : 'mr-0'}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                    />
                                </svg>
                                <span className={`text-sm font-semibold ${open ? 'block' : 'hidden'}`}>
                                    <span>Quản lý booking</span>
                                </span>
                            </Link>
                        </button>
                        {/* <div
                            className={`${
                                !open ? 'btn-show-quan-ly-list' : ''
                            } sm:hover:bg-sky-100 sm:hover:text-sky-400 border-b-2 border-sky-400 sm:border-transparent cursor-pointer ${
                                selected == 'booking-management' || selected == 'quan-ly-ve'
                                    ? 'sm:bg-sky-100 text-sky-400 border-b-2 border-sky-400'
                                    : 'border-b-2 border-transparent'
                            } text-gray-500`}
                        >
                            <div className={`flex ${open ? 'justify-start' : 'justify-center'} items-center p-3`}>
                                <svg
                                    className={`h-5 w-5 ${open ? 'mr-2' : 'mr-0'}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                    />
                                </svg>
                                <span className={`text-sm font-semibold ${open ? 'flex' : 'hidden'}`}>
                                    Quản lý booking
                                    <svg
                                        className="h-5 w-5 ml-2"
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
                                        <path stroke="none" d="M0 0h24v24H0z" /> <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </span>
                            </div>
                            <div className="hover:bg-white hover:text-gray-500 relative">
                                <div className={`${open ? 'block' : 'hidden'}`}>
                                    <button
                                        onClick={() => {
                                            alert(pathName);
                                            if (pathName == '/booking-management/') {
                                                location.reload();
                                            }
                                        }}
                                        className={`p-2 text-sm block w-full text-start font-medium pl-10 text-gray-400 hover:bg-sky-50 hover:text-sky-400 ${
                                            selected == 'booking-management' ? 'bg-sky-50 text-sky-400' : 'bg-white'
                                        }`}
                                    >
                                        <Link href="/booking-management" className="h-full w-full">
                                            Quản lý đặt chỗ
                                        </Link>
                                    </button>
                                </div>
                                <div
                                    className={`absolute sm:left-full sm:-top-12 right-0 top-2 w-[200px] z-10 shadow-xl border show-quan-ly-list`}
                                >
                                    <button
                                        onClick={() => {
                                            if (pathName == '/booking-management/') {
                                                location.reload();
                                            }
                                        }}
                                        className={`p-2 text-sm block w-full text-start font-medium text-gray-400 hover:bg-sky-50 hover:text-sky-400 ${
                                            selected == 'booking-management' ? 'bg-sky-50 text-sky-400' : 'bg-white'
                                        }`}
                                    >
                                        <Link href="/booking-management" className="h-full w-full">
                                            Quản lý đặt chỗ
                                        </Link>
                                    </button>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;