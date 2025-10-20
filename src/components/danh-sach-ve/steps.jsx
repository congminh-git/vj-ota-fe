'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import StepItem from './step_item';

function Steps() {
    const pathname = usePathname();

    return (
        <div className="p-2 flex justify-center items-center">
            <StepItem number={1} title={'Chọn vé'} end={false} active={pathname.includes('dat-ve/danh-sach-ve')} />
            <StepItem
                number={2}
                title={'Thông tin hành khách'}
                end={false}
                active={pathname.includes('dat-ve/thong-tin-hanh-khach')}
            />
            <StepItem number={3} title={'Thêm dịch vụ'} end={false} active={pathname.includes('dat-ve/them-dich-vu')} />
            <StepItem number={4} title={'Thanh toán'} end={true} active={pathname.includes('dat-ve/thanh-toan')} />
        </div>
    );
}

export default Steps;