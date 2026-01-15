'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import './sidebar.css';
import path from 'path';
import { ChevronDoubleLeft } from './icons/chevronDoubleLeft';
import { ChevronDoubleRight } from './icons/chevronDoubleRight';
import { Plane } from './icons/plane';
import { Ticket } from './icons/ticket';
import { Swagger } from './icons/swagger';
import { BookOpen } from './icons/bookOpen';
import { Bar3 } from './icons/bar3';
import MobileSidebarPopup from './mobileSidebar';

function Sidebar() {
    const [open, setOpen] = useState(false);
    const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
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

    const handleOpenMobileSidebar = () => {
        setOpenMobileSidebar(!openMobileSidebar);
    }

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
                    } bg-white shadow-lg sm:shadow-none w-full border-r fixed left-0 top-0 side-bar px-2 sm:px-0 flex sm:block justify-between items-center z-50`}
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
                            <ChevronDoubleLeft className={"h-4 w-4"} strokeWidth={"2"} />
                        </button>
                        <button
                            onClick={bigSideBar}
                            className={`text-sky-400 hidden ${open ? 'sm:hidden' : 'sm:block'}`}
                        >
                            <ChevronDoubleRight className={"h-4 w-4"} strokeWidth={"2"} />
                        </button>
                    </div>
                    <div className='mobile-sidebar class sm:hidden flex'>
                        <button onClick={()=>{handleOpenMobileSidebar()}} className='p-4 hover:bg-sky-200 hover:text-sky-400 rounded-lg'>
                            <Bar3 className={"size-6"} strokeWidth={"2"}/>
                        </button>
                        {openMobileSidebar && (
                            <MobileSidebarPopup
                                openMobileSidebar={openMobileSidebar}
                                setOpenMobileSidebar={setOpenMobileSidebar}
                                isDocs={isDocs}
                                setIsDocs={setIsDocs}
                                pathName={pathName}
                                selected={selected}
                            />
                        )}
                    </div>
                    <div className="sm:mt-2 hidden sm:block justify-between items-center">
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
                                <Plane className={`h-5 w-5 ${open ? 'mr-2' : 'mr-0'}`} strokeWidth={"2"} />
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
                                <Ticket className={`size-5 ${open ? 'mr-2' : 'mr-0'}`} strokeWidth={"2"} />
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
                                href='/api-docs'
                            >
                                <Swagger className={`size-5 ${open ? 'mr-2' : 'mr-0'}`} strokeWidth={"2"}/>
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
                                <BookOpen className={`size-5 ${open ? 'mr-2' : 'mr-0'}`} strokeWidth={"2"}/>
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