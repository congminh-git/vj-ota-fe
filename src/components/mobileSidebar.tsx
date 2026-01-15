'use client';

import { BookOpen } from './icons/bookOpen';
import { ChevronLeft } from './icons/chevronLeft';
import { Plane } from './icons/plane';
import { Swagger } from './icons/swagger';
import { Ticket } from './icons/ticket';
import { XMark } from './icons/xMark';
import Link from 'next/link';

export default function MobileSidebarPopup({
    openMobileSidebar,
    setOpenMobileSidebar,
    selected,
    isDocs,
    setIsDocs,
    pathName,
}:{
    openMobileSidebar: boolean;
    setOpenMobileSidebar: (value: boolean) => void;
    selected: string;
    isDocs: boolean;
    setIsDocs: (value: boolean) => void;
    pathName: string;
}) {
    
    return (
        <div
            className={`${
                openMobileSidebar ? 'flex' : 'hidden'
            } h-screen w-screen bg-gray-700 bg-opacity-50 fixed z-20 top-0 right-0 flex justify-end`}
        >
            <div className="h-full p-2 pt-4 bg-white overflow-auto">
                <div className="flex justify-between items-center pb-4 border-b">
                    <button
                        onClick={() => {
                            setOpenMobileSidebar(false);
                        }}
                        className="bg-white p-2 rounded-md hover:bg-gray-100 border"
                    >
                        <XMark className={'w-4 h-4'} strokeWidth={'2'} />
                    </button>
                </div>
                <div className="mt-4 max-w-[600px]">
                    <button
                        className={`flex justify-start items-center text-gray-500 hover:bg-sky-100 hover:text-sky-400 ${
                            selected == 'booking'
                                ? 'sm:bg-sky-100 sm:border-transparent text-sky-400 border-b-2 border-sky-400'
                                : 'border-b-2 border-transparent'
                        } cursor-pointer p-3 w-full text-start mr-2 sm:mr-0`}
                    >
                        <Link className="flex items-center" href="/">
                            <Plane className={`h-5 w-5 ${open ? 'mr-2' : 'mr-0'}`} strokeWidth={'2'} />
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
                            <Ticket className={`size-5 ${open ? 'mr-2' : 'mr-0'}`} strokeWidth={'2'} />
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
                        <Link className="flex items-center" href='/api-docs'>
                            <Swagger className={`size-5 ${open ? 'mr-2' : 'mr-0'}`} strokeWidth={'2'} />
                            <span className={`text-sm font-semibold ${open ? 'block' : 'hidden'}`}>
                                <span>API swagger</span>
                            </span>
                        </Link>
                    </button>
                    <div className='flex justify-between items-center'>
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
                                <BookOpen className={`size-5 ${open ? 'mr-2' : 'mr-0'}`} strokeWidth={'2'} />
                                <span
                                    className={`text-sm font-semibold ${
                                        open ? 'flex justify-between items-center' : 'hidden'
                                    }`}
                                >
                                    <span className="mr-4">Business Document</span>
                                </span>
                            </Link>
                        </button>
                        <button onClick={()=>{setIsDocs(!isDocs)}} className="p-2 hover:bg-sky-100 rounded-full">
                            <ChevronLeft
                                    className={`w-4 h-4 transition-transform duration-300 ${
                                        isDocs ? '-rotate-90' : ''
                                    }`}
                                    strokeWidth={'2'}
                                />
                        </button>
                    </div>
                    {isDocs && open ? (
                        <ul className="ml-6 mt-1">
                            <li
                                className={`text-gray-600 hover:bg-sky-100 hover:text-sky-400 rounded cursor-pointer ${
                                    pathName.includes('/docs/master-data') ? 'bg-sky-100 text-sky-400' : ''
                                }`}
                            >
                                <Link href="/docs/master-data" className="block py-2 px-4 text-sm">
                                    Master Data
                                </Link>
                            </li>
                            <li
                                className={`text-gray-600 hover:bg-sky-100 hover:text-sky-400 rounded cursor-pointer ${
                                    pathName.includes('/docs/booking-flow') ? 'bg-sky-100 text-sky-400' : ''
                                }`}
                            >
                                <Link href="/docs/booking-flow" className="block py-2 px-4 text-sm">
                                    Booking Flow
                                </Link>
                            </li>
                            <li
                                className={`text-gray-600 hover:bg-sky-100 hover:text-sky-400 rounded cursor-pointer ${
                                    pathName.includes('/docs/manage-booking-flow') ? 'bg-sky-100 text-sky-400' : ''
                                }`}
                            >
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
    );
}
