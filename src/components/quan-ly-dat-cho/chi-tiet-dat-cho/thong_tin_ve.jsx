'use client';

import { parseNgayThang } from '@/components/danh-sach-ve/chuyen_bay_item';

export default function ReservationInformation({ reservation, reservationByLocator, debt }) {
    return (
        <div className="border p-4 rounded-lg text-start h-full bg-white col-span-1">
            <h3 className="mb-2 flex justify-between items-center">
                Thông tin vé
                <span
                    className={`text-sm ${
                        debt == 0 ? 'text-green-500 bg-green-100' : 'text-red-500 bg-red-100'
                    }  rounded-md px-2 py-1 ml-4 font-semibold`}
                >
                    {debt == 0 ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
            </h3>
            <div className="text-sm">
                <p className="my-2 grid grid-cols-2 gap-2">
                    <span className="col-span-1 text-gray-500">Mã đặt chỗ:</span>
                    <span className="col-span-1 text-sky-400">{reservation?.locator}</span>
                </p>
                <p className="my-2 grid grid-cols-2 gap-2">
                    <span className="col-span-1 text-gray-500">Thời gian đặt vé:</span>
                    <span className="col-span-1">
                        {parseNgayThang(reservation?.bookingInformation.creation.time).time +
                            ' ' +
                            parseNgayThang(reservation?.bookingInformation.creation.time).date} {' (Giờ địa phương)'}
                    </span>
                </p>
                {reservation?.bookingInformation.hold ? (
                    <p className="my-2 grid grid-cols-2 gap-2">
                        <span className="col-span-1 text-gray-500">Thời hạn giữ chỗ:</span>
                        <span className="col-span-1">
                            {parseNgayThang(reservation?.bookingInformation.hold.expiryTime).time +
                                ' ' +
                                parseNgayThang(reservation?.bookingInformation.hold.expiryTime).date}
                        </span>
                    </p>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}