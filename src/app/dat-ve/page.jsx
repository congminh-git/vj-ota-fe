'use client';

import HomePageSearchForm from '@/components/home-page/search_form';
import { useState } from 'react';

export default function Home() {
    const [loadingStatus, setLoadingStatus] = useState(false);
    return (
        <div className="sm:p-4 h-full p-2 mt-[72px] sm:mt-0 pb-12">
            <HomePageSearchForm
                typeSearchForm={'Đặt vé'}
                loadingStatus={loadingStatus}
                setLoadingStatus={setLoadingStatus}
            />
        </div>
    );
}