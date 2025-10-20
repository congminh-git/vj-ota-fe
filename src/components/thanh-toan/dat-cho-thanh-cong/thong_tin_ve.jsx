'use client';

import { parseNgayThang } from '@/components/danh-sach-ve/chuyen_bay_item';

export default function ReservationInformation({ bookingSuccessResult }) {
    console.log(bookingSuccessResult);
    return (
        <div className="border p-4 rounded-lg text-start h-full bg-white col-span-1">
            <h3 className="mb-2 flex justify-between items-center">Thông tin vé</h3>
            <div className="text-sm">
                <p className="my-2 grid grid-cols-2 gap-2">
                    <span className="col-span-1 text-gray-500">Mã đặt chỗ:</span>
                    <span className="col-span-1 text-sky-400">{bookingSuccessResult?.locator}</span>
                </p>
                <p className="my-2 grid grid-cols-2 gap-2">
                    <span className="col-span-1 text-gray-500">Thời gian đặt vé:</span>
                    <span className="col-span-1">
                        {parseNgayThang(bookingSuccessResult?.bookingInformation.creation.time).time +
                            ' ' +
                            parseNgayThang(bookingSuccessResult?.bookingInformation.creation.time).date}
                        {' (Giờ địa phương)'}
                    </span>
                </p>
                {bookingSuccessResult?.bookingInformation.hold ? (
                    <p className="my-2 grid grid-cols-2 gap-2">
                        <span className="col-span-1 text-gray-500">Thời hạn giữ chỗ:</span>
                        <span className="col-span-1">
                            {bookingSuccessResult?.bookingInformation.hold
                                ? parseNgayThang(bookingSuccessResult?.bookingInformation.hold.expiryTime).time +
                                  ' ' +
                                  parseNgayThang(bookingSuccessResult?.bookingInformation.hold.expiryTime).date
                                : ''}
                        </span>
                    </p>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}