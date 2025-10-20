'use client';

import Sidebar from '@/components/sidebar.jsx';
import Header from '@/components/header.jsx';
import Footer from '@/components/footer.jsx';

export default function BookingManagementLayout({ children }) {
    return (
        <div className="flex h-auto">
            <Sidebar />
            <div className="flex flex-col flex-grow h-full">
                <Header />
                <main className="flex-grow bg-white p-4">{children}</main>
                <Footer />
            </div>
        </div>
    );s
}
